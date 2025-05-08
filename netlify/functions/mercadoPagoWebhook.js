// netlify/functions/mercadoPagoWebhook.js

// exports.handler = async (event) => {
//     const body = JSON.parse(event.body);
  
//     // Confirma se o evento é de pagamento aprovado
//     if (body.type === "payment" && body.data && body.action === "payment.updated") {
//       const paymentId = body.data.id;
  
//       // Faça requisição para API do Mercado Pago para pegar dados completos do pagamento
//       const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
//         headers: {
//           Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
//         }
//       });
  
//       const payment = await response.json();
  
//       if (payment.status === "approved") {
//         const email = payment.payer.email;
  
//         // Enviar e-mail com documento (ex: SendGrid API)
//         await sendEmailWithDocument(email, payment);
  
//         return {
//           statusCode: 200,
//           body: JSON.stringify({ success: true })
//         };
//       }
//     }
  
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ received: true })
//     };
//   };

exports.handler = async (event, context) => {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Webhook recebido com sucesso!" }),
    };
  };