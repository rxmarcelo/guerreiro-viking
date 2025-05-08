const nodemailer = require("nodemailer");
const axios = require("axios");
const path = require("path");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: "Invalid JSON",
    };
  }

  const { type, data: { id: paymentId } = {} } = data;

  if (type !== "payment" || !paymentId) {
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
  } catch (err) {
    console.error("Erro ao consultar pagamento:", err);
    return {
      statusCode: 500,
      body: "Erro ao consultar pagamento",
    };
  }

  if (paymentInfo.status !== "approved") {
    return {
      statusCode: 200,
      body: "Pagamento não aprovado, ignorado",
    };
  }

  const userEmail = paymentInfo.payer.email;

  // Detecta o produto comprado
  const tituloProduto = paymentInfo.additional_info?.items?.[0]?.title?.toLowerCase() || "";
  let arquivoPdf;
  let nomeArquivo;

  if (tituloProduto.includes("guerreiro") || tituloProduto.includes("viking")) {
    arquivoPdf = path.join(__dirname, "src", "documentos", "guerreiro-viking.pdf");
    nomeArquivo = "guerreiro-viking.pdf";
  } else if (tituloProduto.includes("dama") || tituloProduto.includes("escudo")) {
    arquivoPdf = path.join(__dirname, "src", "documentos", "dama-do-escudo.pdf");
    nomeArquivo = "dama-do-escudo.pdf";
  } else if (tituloProduto.includes("combo")) {
    arquivoPdf = path.join(__dirname, "src", "documentos", "combo.pdf");
    nomeArquivo = "combo.pdf";
  } else {
    console.warn("Produto não reconhecido:", tituloProduto);
    return {
      statusCode: 400,
      body: "Produto não reconhecido",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Rafael Cardoso - Projeto Guerreiro Viking" <${process.env.EMAIL_FROM}>`,
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
