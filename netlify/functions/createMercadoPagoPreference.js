// netlify/functions/create-mercadopago-preference.js
const mercadopago = require('mercadopago');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { productId, productTitle, productPrice, customerEmail } = JSON.parse(event.body);

    if (!productId || !productTitle || !productPrice || !customerEmail) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Dados incompletos.' }) };
    }

    mercadopago.configure({
      access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN, // Use seu Access Token de PRODUÇÃO ou TESTE
    });

    const preference = {
      items: [
        {
          id: productId,
          title: productTitle,
          unit_price: productPrice,
          quantity: 1,
        },
      ],
      payer: { // Opcional, mas bom preencher se tiver mais dados
        email: customerEmail,
      },
      metadata: {
        customer_email: customerEmail,
        product_id_original: productId, // Para referência no webhook
      },
      back_urls: {
        success: 'https://SEU_SITE.com/sucesso', // Configure suas URLs de retorno
        failure: 'https://SEU_SITE.com/falha',
        pending: 'https://SEU_SITE.com/pendente',
      },
      auto_return: 'approved',
      // notification_url: 'https://SEU_SITE.com/.netlify/functions/mercadoPagoWebhook', // Se não configurado globalmente no MP
    };

    const response = await mercadopago.preferences.create(preference);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ init_point: response.body.init_point }),
    };

  } catch (error) {
    console.error('Erro ao criar preferência MP:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha ao criar preferência de pagamento no servidor.' }),
    };
  }
};