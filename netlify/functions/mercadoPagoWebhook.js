const nodemailer = require("nodemailer");
const axios = require("axios");
const path = require("path");
const crypto = require("crypto");

exports.handler = async function (event, context) {
  // Função auxiliar para validar o formato básico de um e-mail
  function isValidEmailString(emailStr) {
    if (typeof emailStr !== 'string') {
      return false;
    }
    const trimmedEmail = emailStr.trim();
    if (trimmedEmail === "") {
      return false;
    }
    // Regex básico para validar o formato nome@dominio.com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmedEmail);
  }

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

  console.log("Webhook payload recebido:", data) // Log do payload completo

  const type = data.topic;
  const paymentId = data.resource; // Para topic: 'payment', resource é o payment_id
  const action = data.action; 

  console.log(`Webhook processando - Action: ${action || 'N/A'}, Type: ${type}, Payment ID: ${paymentId}`);

  if (type !== "payment" || !paymentId) {
    console.log("Notificação ignorada: não é um 'payment' ou ID do pagamento ausente.");
    return {
      statusCode: 200,
      body: "Ignored: Not a payment notification or missing payment ID.",
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
    console.log("Dados detalhados do pagamento:", paymentInfo);
  } catch (err) { 
    console.error("Erro ao consultar detalhes do pagamento:", err.response ? err.response.data : err.message);
    return {
      statusCode: 500, // Ou 404 se o erro for específico de pagamento não encontrado
      body: "Erro ao consultar detalhes do pagamento.",
    };
  }

  // Alterado para processar pagamentos com status 'pending' para fins de teste
  if (paymentInfo.status !== "pending") {
    console.log(`Pagamento ${paymentId} não está com status 'pending' (status atual: ${paymentInfo.status}). Ignorado para este teste.`);
    return {
      statusCode: 200,
      body: "Pagamento não está pendente, ignorado para este teste.",
    };
  }

  let userEmail; 

  // 1. Tentar obter do metadata (se você configurou para enviar)
  const emailFromMetadata = paymentInfo.metadata?.customer_email; 
  if (isValidEmailString(emailFromMetadata)) {
    userEmail = emailFromMetadata.trim();
    console.log(`E-mail do pagador obtido do metadata: ${userEmail}`);
  }

  // 2. Se não encontrado no metadata, tentar obter dos dados diretos do pagamento
  if (!userEmail) {
    const payerEmailFromPayment = paymentInfo.payer?.email;
    if (isValidEmailString(payerEmailFromPayment)) {
      userEmail = payerEmailFromPayment.trim();
      console.log(`E-mail do pagador obtido diretamente dos dados do pagamento: ${userEmail}`);
    } else {
      if (payerEmailFromPayment) { 
        console.log(`E-mail ('${payerEmailFromPayment}') nos dados do pagamento é inválido ou está em branco. Payment ID: ${paymentId}.`);
      } else {
        console.log(`E-mail não encontrado nos dados do pagamento para Payment ID: ${paymentId}.`);
      }
    }
  }
  
  // 3. Se ainda não encontrado, e temos um customerId, tentamos a API de Clientes
  if (!userEmail) {
    const customerId = paymentInfo.payer?.id;
    if (customerId) {
      console.log(`Tentando buscar e-mail via Customer ID: ${customerId} para Payment ID: ${paymentId}`);
      try {
        const customerResponse = await axios.get(`https://api.mercadopago.com/v1/customers/${customerId}`, {
          headers: {
            Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          },
        });
        console.log("Dados do cliente obtidos:", customerResponse.data);
        const emailFromCustomerApi = customerResponse.data?.email;

        if (isValidEmailString(emailFromCustomerApi)) {
          userEmail = emailFromCustomerApi.trim();
          console.log(`E-mail do pagador obtido via API de Clientes: ${userEmail}`);
        } else if (emailFromCustomerApi) { 
          console.log(`Cliente ${customerId} encontrado, mas o e-mail registrado ('${emailFromCustomerApi}') é inválido ou está em branco.`);
        } else {
          console.log(`Cliente ${customerId} encontrado, mas sem e-mail registrado ou campo de e-mail ausente nos dados do cliente.`);
        }
      } catch (customerErr) {
        console.error(`Erro ao buscar dados do cliente ${customerId}:`, customerErr.response ? customerErr.response.data : customerErr.message);
      }
    }
  }

  // Se, após todas as tentativas, nenhum e-mail válido foi encontrado
  if (!userEmail) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const customerId = paymentInfo.payer?.id; // Para incluir no log de erro
    const errorMessage = `ALERTA: E-mail do pagador não pôde ser determinado para o Payment ID: ${paymentId}. Payer ID: ${customerId || 'N/A'}. Detalhes do pagamento (payer): ${JSON.stringify(paymentInfo.payer)}. Metadata: ${JSON.stringify(paymentInfo.metadata)}. Ação manual necessária.`;
    console.error(errorMessage);
    console.log(`[DEBUG Admin Email] Valor de process.env.ADMIN_EMAIL: '${adminEmail}'`);

    if (adminEmail && isValidEmailString(adminEmail)) { // Verifica se adminEmail é válido também
      try {
        const transporter = nodemailer.createTransport({ 
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
    } else {
      console.log("[DEBUG Admin Email] adminEmail é Falsy, inválido, ou não configurado. Pulando envio de e-mail de alerta.");
    }
    return { 
      statusCode: 200,
      body: "Notificação processada. E-mail do pagador não encontrado, administrador notificado (se configurado e válido).",
    };
  }

  const productConfigurations = [
    { id: "guerreiro_sem_suporte", pdf: "guerreiro-viking.pdf", fileName: "guerreiro-viking.pdf" },
    { id: "guerreiro_com_suporte", pdf: "guerreiro-viking.pdf", fileName: "guerreiro-viking.pdf" },
    { id: "valquiria_sem_suporte", pdf: "dama-do-escudo.pdf", fileName: "dama-do-escudo.pdf" },
    { id: "valquiria_com_suporte", pdf: "dama-do-escudo.pdf", fileName: "dama-do-escudo.pdf" },
    { id: "combo_lendario_com_suporte", pdf: "combo.pdf", fileName: "combo.pdf" },
  ];

  const productIdFromMetadata = paymentInfo.metadata?.product_id_original;
  let selectedProduct = productConfigurations.find(p => p.id === productIdFromMetadata);

  if (!selectedProduct) {
    // Fallback para detecção por título se o ID do metadata não funcionar
    const itemTitle = paymentInfo.additional_info?.items?.[0]?.title?.toLowerCase() || "";
    const fallbackKeywords = [
        { id: "guerreiro_sem_suporte", keywords: ["guerreiro viking"] }, // Mais específico
        { id: "guerreiro_com_suporte", keywords: ["guerreiro viking + suporte"] },
        { id: "valquiria_sem_suporte", keywords: ["dama do escudo"] },
        { id: "valquiria_com_suporte", keywords: ["dama do escudo + suporte"] },
        { id: "combo_lendario_com_suporte", keywords: ["combo lendário"] },
    ];
    const foundByKeyword = fallbackKeywords.find(product =>
        product.keywords.some(keyword => itemTitle.includes(keyword))
    );
    if (foundByKeyword) {
        selectedProduct = productConfigurations.find(p => p.id === foundByKeyword.id);
    }
  }

  if (!selectedProduct) {
    console.warn(`Produto não reconhecido. Metadata Product ID: "${productIdFromMetadata}", Título do Item: "${paymentInfo.additional_info?.items?.[0]?.title || 'N/A'}". Payment ID: ${paymentId}`);
    // Notificar admin sobre produto não reconhecido
    // ... (lógica similar à de e-mail ausente)
    return {
      statusCode: 400, // Ou 200 se preferir apenas logar e não reenviar
      body: "Produto não reconhecido.",
    };
  }

  // __dirname é /var/task/netlify/functions/
  // Os arquivos incluídos via netlify.toml (src/doc/**) estarão em /var/task/src/doc/
  const arquivoPdf = path.join(__dirname, "..", "..", "src", "doc", selectedProduct.pdf);
  const nomeArquivo = selectedProduct.fileName;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_FROM, 
        pass: process.env.EMAIL_PASS  
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
      body: "E-mail enviado com sucesso.",
    };
  } catch (err) {
    console.error("Erro ao enviar e-mail para o cliente:", err);
    return {
      statusCode: 500,
      body: "Erro ao enviar o e-mail para o cliente.",
    };
  }
};