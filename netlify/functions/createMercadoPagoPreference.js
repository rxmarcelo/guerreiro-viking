// netlify/functions/create-mercadopago-preference.js
const { MercadoPagoConfig, Preference } = require('mercadopago');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { productId, productTitle, productPrice, customerEmail } = JSON.parse(event.body);

    if (!productId || !productTitle || !productPrice || !customerEmail) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Dados incompletos.' }) };
    }

    // Inicializa o cliente do Mercado Pago com o Access Token
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN 
    });

    const preferenceData = {
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
      // back_urls: { // Removido - ATENÇÃO: Isso pode impactar a experiência do usuário após o pagamento.
      //   success: 'https://SEU_SITE.com/sucesso', 
      //   failure: 'https://SEU_SITE.com/falha',
      //   pending: 'https://SEU_SITE.com/pendente',
      // },
      auto_return: 'approved',
      // notification_url: 'https://SEU_SITE.com/.netlify/functions/mercadoPagoWebhook', // Se não configurado globalmente no MP
    };

    const preferenceClient = new Preference(client);
    const result = await preferenceClient.create({ body: preferenceData });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ init_point: result.init_point }),
    };

  } catch (error) {
    console.error('Erro ao criar preferência MP:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha ao criar preferência de pagamento no servidor.' }),
    };
  }
};