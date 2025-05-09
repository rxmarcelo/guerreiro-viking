import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle, Home } from 'lucide-react';
import logoVHTraining from './img/rafael-cardoso.png';
import logoGuerreiroViking from './img/valhalla2.png';
import { Toaster } from '@/components/ui/toaster';

const PaymentStatusPage = () => {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [icon, setIcon] = useState(null);
  const [title, setTitle] = useState('Status do Pagamento');

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get('status');
    setStatus(paymentStatus);

    switch (paymentStatus) {
      case 'sucesso':
        setTitle('Pagamento Aprovado!');
        setMessage('Sua jornada para Valhalla começou! Sua ficha de treino será enviada para o seu e-mail em breve. Verifique sua caixa de entrada e spam.');
        setIcon(<CheckCircle className="h-16 w-16 text-green-500" />);
        break;
      case 'falha':
        setTitle('Falha no Pagamento');
        setMessage('Houve um problema ao processar seu pagamento. Por favor, verifique os dados inseridos ou tente novamente com outro método de pagamento.');
        setIcon(<XCircle className="h-16 w-16 text-red-500" />);
        break;
      case 'pendente':
        setTitle('Pagamento Pendente');
        setMessage('Seu pagamento está pendente. Se você gerou um PIX ou boleto, por favor, realize o pagamento para liberar sua ficha de treino. A confirmação pode levar algum tempo.');
        setIcon(<AlertTriangle className="h-16 w-16 text-yellow-500" />);
        break;
      default:
        setTitle('Status Desconhecido');
        setMessage('Não foi possível determinar o status do seu pagamento. Se você acredita que houve um erro, entre em contato conosco.');
        setIcon(<AlertTriangle className="h-16 w-16 text-gray-500" />);
    }
  }, []);

  const backgroundImage1 = "https://storage.googleapis.com/hostinger-horizons-assets-prod/f9552480-90c3-4198-9467-b312fd76a586/c40faa7c51cc2d7b54f6228aa1a73e4e.jpg";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
      <Toaster />
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed bg-image-overlay"
        style={{ backgroundImage: `url(${backgroundImage1})`, backgroundPosition: 'top' }}
      >
        <div className="container mx-auto px-6 text-center content-z-index py-10 md:py-20">
          <div className="flex justify-center items-center space-x-4 sm:space-x-6 md:space-x-10 mb-8 md:mb-12">
            <img src={logoVHTraining} alt="Logo Rafael Cardoso Treinador" className="w-28 sm:w-36 md:w-40 h-auto" />
            <img src={logoGuerreiroViking} alt="Logo Valhalla Training Center" className="w-32 sm:w-40 md:w-48 h-auto" />
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border-2 border-primary/50 shadow-xl max-w-2xl mx-auto">
            <CardHeader className="items-center">
              {icon && <div className="mb-4">{icon}</div>}
              <CardTitle 
                className="text-3xl md:text-4xl text-center text-primary"
                style={{ fontFamily: "'Cinzel Decorative', serif" }}
              >
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-200 text-lg md:text-xl">
              <p>{message}</p>
              <Button 
                size="lg" 
                variant="primary" 
                className="bg-primary hover:bg-yellow-600 text-primary-foreground font-bold text-lg px-10 py-6 mt-8" 
                onClick={() => window.location.href = '/'} // Redireciona para a página inicial
              >
                <Home className="mr-2 h-5 w-5" /> Voltar para a Página Inicial
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.section>
      
      <footer className="bg-gray-900/70 py-6 border-t border-gray-700 w-full mt-auto">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p className="text-sm">&copy; {new Date().getFullYear()} Treinamento Guerreiro Viking - Valhalla Training Center - Rafael Cardoso Treinador. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default PaymentStatusPage;