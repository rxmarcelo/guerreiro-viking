const nodemailer = require("nodemailer");
const axios = require("axios");
const path = require("path");
const crypto = require("crypto");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  // TODO: Implementar Verificação de Assinatura do Webhook (CRUCIAL PARA SEGURANÇA)
  // Consulte a documentação do Mercado Pago para os detalhes corretos (header, algoritmo).
  // Exemplo conceitual:
  // const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  // const signatureHeader = event.headers['x-signature'] || event.headers['x-mp-signature']; // Verifique o nome correto do header

  // if (secret && signatureHeader) {
  //   const hmac = crypto.createHmac('sha256', secret);
  //   const calculatedSignature = hmac.update(event.body).digest('hex');
  //   // Use crypto.timingSafeEqual para comparar as assinaturas para evitar ataques de timing
  //   if (!crypto.timingSafeEqual(Buffer.from(calculatedSignature, 'utf8'), Buffer.from(signatureHeader, 'utf8'))) {
  //     console.error("Assinatura do webhook inválida.");
  //     return { statusCode: 403, body: "Proibido: Assinatura inválida" };
  //   }
  //   console.log("Assinatura do webhook verificada com sucesso.");
  // } else {
  //   console.warn("AVISO: Verificação de assinatura do webhook não configurada ou header ausente. Processando sem verificação (RISCO DE SEGURANÇA).");
  // }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: "Invalid JSON",
    };
  }

  console.log(data)

  // A desestruturação original esperava uma estrutura aninhada que não corresponde ao log.
  // const { action, type, data: { id: paymentId } = {} } = data;

  // Ajustando para a estrutura observada no log: { resource: 'ID_PAGAMENTO', topic: 'payment' }
  const type = data.topic;
  const paymentId = data.resource;
  const action = data.action; // 'action' pode não estar presente neste formato de payload.

  console.log(`Webhook recebido - Action: ${action || 'N/A'}, Type: ${type}, Payment ID: ${paymentId}`);

  if (type !== "payment" || !paymentId) {
    console.log("Notificação ignorada: não é um pagamento ou ID do pagamento ausente.");
    return {
      statusCode: 200,
      body: "Ignored non-payment notification",
    };
  }


  let paymentInfo;
  try {
    const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    });
    paymentInfo = response.data;
    console.log("Dados do pagamento:", paymentInfo);
  } catch (err) { // Mantenha 'err' para o console.error
    console.error("Erro ao consultar pagamento:", err);
    return {
      statusCode: 500,
      body: "Erro ao consultar pagamento",
    };
  }

  if (paymentInfo.status !== "approved") {
    console.log(`Pagamento ${paymentId} não aprovado (status: ${paymentInfo.status}). Ignorado.`);
    return {
      statusCode: 200,
      body: "Pagamento não aprovado, ignorado",
    };
  }

  let userEmail = paymentInfo.payer?.email;
  // Verifica se o e-mail inicial é uma string em branco
  if (typeof userEmail === 'string' && userEmail.trim() === "") {
    console.log(`E-mail do pagador ('${userEmail}') nos dados do pagamento estava em branco. Tratando como ausente.`);
    userEmail = undefined; // Garante que seja falsy para as próximas verificações
  }
  const customerId = paymentInfo.payer?.id;

  if (!userEmail) {
    console.log(`E-mail não encontrado (ou estava em branco) nos dados do pagamento para Payment ID: ${paymentId}. Tentando buscar via Customer ID: ${customerId}`);
    if (customerId) {
      try {
        const customerResponse = await axios.get(`https://api.mercadopago.com/v1/customers/${customerId}`, {
          headers: {
            Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          },
        });
        console.log("Dados do cliente:", customerResponse.data)
        // Verifica se o e-mail do cliente existe, é uma string e não está em branco após o trim
        if (customerResponse.data && typeof customerResponse.data.email === 'string' && customerResponse.data.email.trim() !== "") {
          userEmail = customerResponse.data.email;
          console.log(`E-mail do pagador obtido via API de Clientes: ${userEmail}`);
        } else if (customerResponse.data && customerResponse.data.hasOwnProperty('email')) {
          // Log se o campo email existe mas está em branco ou não é uma string utilizável
          console.log(`Cliente ${customerId} encontrado, mas o e-mail registrado está em branco ou é inválido ('${customerResponse.data.email}').`);
        } else {
          console.log(`Cliente ${customerId} encontrado, mas sem e-mail registrado.`);
        }
      } catch (customerErr) {
        console.error(`Erro ao buscar dados do cliente ${customerId}:`, customerErr.response ? customerErr.response.data : customerErr.message);
        // Não retorna erro aqui, pois o fluxo principal continua para notificar o admin se o email ainda estiver faltando
      }
    }
  }

  // Se, mesmo após todas as tentativas, o e-mail não for encontrado (ou for inválido/em branco)
  // A lógica anterior deve garantir que userEmail é undefined se estava em branco.
  if (!userEmail) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const errorMessage = `ALERTA: E-mail do pagador não pôde ser determinado para o Payment ID: ${paymentId}. Payer ID: ${customerId}. Detalhes do pagamento: ${JSON.stringify(paymentInfo.payer)}. Ação manual necessária.`;
    console.error(errorMessage);

    if (adminEmail) {
      try {
        const transporter = nodemailer.createTransport({ // Reutilize a configuração do transporter abaixo ou defina aqui
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASS
          },
        });
        await transporter.sendMail({
          from: `"Alerta Sistema - Guerreiro Viking" <${process.env.EMAIL_FROM}>`,
          to: adminEmail,
          subject: `ALERTA URGENTE: E-mail do cliente ausente para Pagamento ${paymentId}`,
          text: errorMessage,
        });
        console.log(`E-mail de alerta sobre e-mail ausente enviado para o administrador: ${adminEmail}`);
      } catch (emailError) {
        console.error("Erro ao enviar e-mail de alerta para o administrador:", emailError);
      }
    }
    return { // Responde 200 ao MP para evitar reenvios desnecessários, já que o problema é de dados
      statusCode: 200,
      body: "Notificação processada. E-mail do pagador não encontrado, administrador notificado (se configurado).",
    };
  }

  // Configuração dos produtos
  const productConfigurations = [
    {
      id: "GUERREIRO_VIKING",
      keywords: ["guerreiro", "viking"],
      pdf: "guerreiro-viking.pdf",
      fileName: "guerreiro-viking.pdf",
    },
    {
      id: "DAMA_DO_ESCUDO",
      keywords: ["dama", "escudo"],
      pdf: "dama-do-escudo.pdf",
      fileName: "dama-do-escudo.pdf",
    },
    {
      id: "COMBO_TREINOS",
      keywords: ["combo"],
      pdf: "combo.pdf",
      fileName: "combo.pdf",
    },
  ];

  // Detecta o produto comprado
  const itemTitle = paymentInfo.additional_info?.items?.[0]?.title?.toLowerCase() || "";
  // const itemId = paymentInfo.additional_info?.items?.[0]?.id; // Considere usar o ID do item (SKU) se disponível e confiável

  let arquivoPdf;
  let nomeArquivo;

  const selectedProduct = productConfigurations.find(product =>
    product.keywords.some(keyword => itemTitle.includes(keyword))
  );

  if (!selectedProduct) {
    console.warn(`Produto não reconhecido pelo título: "${itemTitle}". Payment ID: ${paymentId}`);
    return {
      statusCode: 400,
      body: "Produto não reconhecido",
    };
  }
  arquivoPdf = path.join(__dirname, "src", "documentos", selectedProduct.pdf);
  nomeArquivo = selectedProduct.fileName;

  try {
    // Configuração do Nodemailer para Gmail com Senha de App
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_FROM, // Seu e-mail do Gmail (ex: seu.email@gmail.com)
        pass: process.env.EMAIL_PASS  // A Senha de App de 16 caracteres gerada no Google
      },
    });

    await transporter.sendMail({
      from: `"Rafael Cardoso - Ficha de treino de Valhalla" <${process.env.EMAIL_FROM}>`,
      to: userEmail,
      subject: "Aqui está sua ficha de treino, direto de Valhalla!",
      text: "Obrigado pela compra! Segue em anexo o seu treinamento digno de um(a) verdadeiro(a) guerreiro(a). Bom treino!",
      attachments: [
        {
          filename: nomeArquivo,
          path: arquivoPdf,
        },
      ],
    });

    console.log(`E-mail enviado com sucesso para ${userEmail} para o produto ${selectedProduct.id} (Payment ID: ${paymentId}).`);
    return {
      statusCode: 200,
      body: "E-mail enviado com sucesso",
    };
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err);
    return {
      statusCode: 500,
      body: "Erro ao enviar o e-mail",
    };
  }
};
