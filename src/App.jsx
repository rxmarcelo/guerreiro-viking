
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Axe, Shield, Instagram, MessageSquare, Zap, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';


import logoVHTraining from './img/rafael-cardoso.png';
import logoGuerreiroViking from './img/valhalla2.png';
import backgroundImage1Src from './img/bg-dama.jpg';
import backgroundImage2Src from './img/bg-guerreiro.jpg';
import fichaMasculinaImgSrc from './img/ficha-guerreiro-viking.jpg';
import fichaFemininaImgSrc from './img/ficha-dama-escudo.jpg';
import bkViking from './img/bg-viking.jpg';

const VikingLandingPage = () => {
  const { toast } = useToast();
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const openEmailDialog = (product) => {
    setSelectedProduct(product);
    setCustomerEmail('');
    setIsEmailDialogOpen(true);
  };

  const handleProceedToPayment = async () => {
    if (!selectedProduct || !customerEmail) {
      toast({
        title: "Erro",
        description: "Por favor, insira um e-mail válido.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      toast({
        title: "E-mail Inválido",
        description: "Por favor, insira um endereço de e-mail válido.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsRedirecting(true);
    toast({
      title: "Redirecionando...",
      description: `Você será redirecionado para o Mercado Pago para comprar ${selectedProduct.title}.`,
      duration: 3000,
    });

    try {
      const response = await fetch('/.netlify/functions/createMercadoPagoPreference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.idSuffix,
          productTitle: selectedProduct.title,
          productPrice: parseFloat(selectedProduct.price.replace(',', '.')),
          customerEmail: customerEmail
        }),
      });

      if (!response.ok) {
        let errorDetails = 'Falha ao criar preferência de pagamento. O servidor respondeu com um erro.';
        try {
          const errorText = await response.text();
          console.error("Resposta crua do servidor (erro):", errorText);
          const errorData = JSON.parse(errorText);
          if (errorData && errorData.error) {
            errorDetails = errorData.error;
          }
        } catch (e) {
          console.error("Não foi possível fazer o parse da resposta de erro como JSON ou obter o texto:", e);
          errorDetails = `Falha ao criar preferência de pagamento. Status: ${response.status}. Não foi possível ler a resposta do servidor.`;
        }
        throw new Error(errorDetails);
      }

      const { init_point } = await response.json();
      
      setIsEmailDialogOpen(false);
      window.open(init_point, '_blank');

    } catch (error) {
      console.error("Erro ao criar preferência de pagamento:", error);
      toast({
        title: "Erro no Pagamento",
        description: error.message || "Não foi possível iniciar o pagamento. Tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsRedirecting(false);
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative pt-12 pb-20 md:pt-16 md:pb-32 bg-cover bg-center bg-no-repeat bg-fixed bg-image-overlay hero-overlay-tall"
        style={{ backgroundImage: `url(${backgroundImage1Src})`, backgroundPosition: 'top' }}
      >
        <div className="container mx-auto px-6 text-center content-z-index">
          <div className="flex justify-center items-center space-x-4 sm:space-x-6 md:space-x-10 mb-8 md:mb-12">
            <img src={logoVHTraining} alt="Logo Rafael Cardoso Treinador" className="w-36 sm:w-44 md:w-48 h-auto" /> 
            <img src={logoGuerreiroViking} alt="Logo Valhalla Training Center" className="w-40 sm:w-52 md:w-62 h-auto" /> 
          </div>
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-primary mb-6 text-shadow-hard"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Fichas de Treino Viking
          </motion.h1>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto text-shadow-soft"
          >
            Olá meu nome é Rafael Queiroz Cardoso – CREF 186915-G
          </motion.p>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto text-shadow-soft"
          >
            Com 24 anos de experiência em treinamento, experimentei diversas metodologias ao longo da minha jornada. Treinei com fisiculturistas e grandes treinadores, absorvendo na prática o que realmente funciona.
          </motion.p>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto text-shadow-soft"
          >
            Ao longo desse tempo, aliei o embasamento científico com a realidade do treino intenso, aplicando essa fusão em mim mesmo e em meus alunos.
          </motion.p>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto text-shadow-soft"
          >
            Depois de anos de tentativa, erro e refinamento, posso afirmar: essa é a melhor forma de treinar que já encontrei para maximizar a hipertrofia muscular — com estratégia, segurança e resultado de verdade.
          </motion.p>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto text-shadow-soft"
            >
              Aqui você encontra um método testado, validado e direto ao ponto.
          </motion.p>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto text-shadow-soft"
          >
            Transforme seu físico com as fichas de treino mais brutais da internet. Treinos avançados, organização por semanas, imagens ilustrativas e estrutura para progressão de cargas.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button size="lg" variant="primary" className="bg-primary hover:bg-yellow-600 text-primary-foreground font-bold text-lg px-10 py-6" onClick={() => document.getElementById('fichas').scrollIntoView({ behavior: 'smooth' })}>
              Conheça as Fichas <Axe className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <section 
        id="fichas" 
        className="py-16 md:py-24 bg-background relative z-10"
      >
        <div className="container mx-auto px-6">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center text-primary mb-16 text-shadow-hard"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Para Guerreiros e Guerreiras
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-3xl text-accent mb-6 text-center font-bold" style={{ fontFamily: "'Cinzel Decorative', serif" }}>Ficha Guerreiro Viking</h3>
              <img src={fichaMasculinaImgSrc} alt="Ficha de Treino Masculina Viking" className="rounded-lg shadow-2xl w-full max-w-md h-auto border-4 border-primary/70 object-cover aspect-[3/4] mb-6" />
              <p className="text-center text-gray-300 mb-6 max-w-md">Força e brutalidade para construir um físico lendário. Ideal para homens que buscam o ápice da performance.</p>
              <Button size="lg" className="bg-primary hover:bg-yellow-600 text-primary-foreground font-semibold" onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}>
                Ver Planos <Zap className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-3xl text-accent mb-6 text-center font-bold" style={{ fontFamily: "'Cinzel Decorative', serif" }}>Ficha Dama do Escudo</h3>
              <img src={fichaFemininaImgSrc} alt="Ficha de Treino Feminina Viking" className="rounded-lg shadow-2xl w-full max-w-md h-auto border-4 border-red-400/70 object-cover aspect-[3/4] mb-6" />
              <p className="text-center text-gray-300 mb-6 max-w-md">Agilidade, poder e graça para forjar um corpo de guerreira. Perfeita para mulheres prontas para a batalha.</p>
               <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white font-semibold" onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}>
                Ver Planos <Heart className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section 
        id="pricing" 
        className="py-16 md:py-24 bg-cover bg-center bg-no-repeat bg-fixed bg-image-overlay"
        style={{ backgroundImage: `url(${backgroundImage2Src})`, backgroundPosition: 'top' }}
      >
        <div className="container mx-auto px-6 content-z-index">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center text-primary mb-12 text-shadow-hard"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Escolha Sua Arma
          </h2>
          
          {(() => {
            const pricingPlans = [
              { title: "Ficha Guerreiro Viking", price: "49,90", support: false, icon: Axe, borderColor: "border-primary/50", shadowColor: "hover:shadow-primary/40", buttonColor: "bg-primary hover:bg-yellow-600", idSuffix:"guerreiro_sem_suporte", checkoutUrl: "https://mpago.li/31PARuD" },
              { title: "Ficha Guerreiro Viking + Suporte", price: "99,90", support: true, icon: Shield, borderColor: "border-accent/70", shadowColor: "hover:shadow-accent/40", buttonColor: "bg-accent hover:bg-orange-400", idSuffix:"guerreiro_com_suporte", checkoutUrl: "https://mpago.li/2UVu9Ma"},
              { title: "Ficha Dama do Escudo", price: "49,90", support: false, icon: Axe, borderColor: "border-red-400/50", shadowColor: "hover:shadow-red-400/40", buttonColor: "bg-red-500 hover:bg-red-600", idSuffix:"dama_escudo_sem_suporte", checkoutUrl: "https://mpago.li/343Ritx" },
              { title: "Ficha Dama do Escudo + Suporte", price: "99,90", support: true, icon: Shield, borderColor: "border-red-400/50", shadowColor: "hover:shadow-red-400/50", buttonColor: "bg-red-600 hover:bg-red-700", idSuffix:"dama_escudo_com_suporte", checkoutUrl: "https://mpago.li/2rAYHEu" },
              { title: "Combo Lendário: Guerreiro Viking + Dama do Escudo", price: "149,85", support: true, icon: Zap, borderColor: "border-yellow-400/70", shadowColor: "hover:shadow-yellow-400/40", buttonColor: "bg-yellow-500 hover:bg-yellow-600", idSuffix:"combo_lendario_com_suporte", checkoutUrl: "https://mpago.li/2XW4YwY" },
            ];

            return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.title + (plan.support ? '_suporte' : '')}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + (index * 0.1) }}
                className={`${
                  index === pricingPlans.length - 1 && pricingPlans.length % 2 !== 0 
                  ? "md:col-span-2 flex justify-center" 
                  : ""
                }`}
              >
                <Card className={`bg-card/80 backdrop-blur-sm border-2 ${plan.borderColor} shadow-xl ${plan.shadowColor} transition-shadow duration-300 h-full flex flex-col ${
                  index === pricingPlans.length - 1 && pricingPlans.length % 2 !== 0 
                  ? "md:max-w-lg"
                  : "w-full"
                }`}>
                  <CardHeader className="items-center">
                    <plan.icon className={`h-16 w-16 ${plan.support ? 'text-accent' : 'text-primary'} mb-4`} />
                    <CardTitle 
                      className={`text-2xl lg:text-3xl text-center ${
                        plan.title.includes("Combo") ? 'text-yellow-400' : 
                        plan.support ? (plan.title.includes("Dama") ? 'text-red-400' : 'text-accent') : 
                        (plan.title.includes("Dama") ? 'text-red-400' : 'text-primary')
                      }`} 
                      style={{ fontFamily: "'Cinzel Decorative', serif" }}
                    >{plan.title}</CardTitle>
                    <CardDescription 
                      className={`text-2xl font-bold text-center ${
                        plan.title.includes("Combo") ? 'text-yellow-300' :
                        plan.support ? (plan.title.includes("Dama") ? 'text-red-300' : 'text-primary') : 
                        (plan.title.includes("Dama") ? 'text-red-300' : 'text-accent')
                      }`}
                    >R$ {plan.price}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center text-gray-300 flex-grow">
                    {plan.title.includes("Combo") ? (
                      <>
                        <p>Leve as fichas Guerreiro Viking e Dama do Escudo juntas!</p>
                        <p className="mt-2">Inclui 60 dias de suporte via WhatsApp para AMBAS as fichas.</p>
                        <p className="mt-2">Desconto de R$ 99,90 em consultoria online (aplicado uma vez).</p>
                        <p className="mt-4 text-sm">A combinação definitiva para um treino completo e assistido!</p>
                        <p className="mt-4 text-sm">Neste combo, a segunda ficha sai com 50% de desconto.</p>
                      </>
                    ) : plan.support ? (
                      <>
                        <p>Inclui 60 dias de suporte via WhatsApp.</p>
                        <p className="mt-2">Desconto de R$ 99,90 em consultoria online.</p>
                        <p className="mt-4 text-sm">Para {plan.title.includes("Guerreiro") ? "guerreiros" : "damas"} que buscam orientação total!</p>
                      </>
                    ) : (
                      <>
                        <p>Versão sem suporte.</p>
                        <p className="mt-4 text-sm">Ideal para {plan.title.includes("Guerreiro") ? "guerreiros" : "damas"} auto-suficientes!</p>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-center mt-auto">
                    <Button variant={plan.support ? "secondary" : "primary"} size="lg" className={`w-full ${plan.buttonColor} text-primary-foreground font-semibold`} onClick={() => openEmailDialog(plan)}>
                      Comprar
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
            );
          })()}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center text-gray-400 mt-4 text-md text-shadow-soft"
          >
            Pagamento via Mercado Pago (Pix, cartão ou boleto).
          </motion.p>
        </div>
      </section>

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-primary">
          <DialogHeader>
            <DialogTitle className="text-primary" style={{ fontFamily: "'Cinzel Decorative', serif" }}>Confirmar Compra</DialogTitle>
            <DialogDescription>
              Para prosseguir com a compra de "{selectedProduct?.title}", por favor, informe seu melhor e-mail.
              A ficha de treino será enviada para este endereço após a aprovação do pagamento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right col-span-1">
                E-mail
              </label>
              <Input 
                id="email" 
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="col-span-3" 
                placeholder="seu.email@exemplo.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)} disabled={isRedirecting}>Cancelar</Button>
            <Button type="submit" onClick={handleProceedToPayment} className="bg-primary hover:bg-yellow-600" disabled={isRedirecting}>
              {isRedirecting ? "Processando..." : "Ir para Pagamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="bg-gray-900/70 py-10 border-t border-gray-700">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <div className="flex justify-center space-x-6 mb-6">
            <motion.a 
              href="https://wa.me/+5511997711072" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, color: '#25D366' }}
              className="text-gray-400 hover:text-green-500 transition-colors"
            >
              <MessageSquare size={32} />
              <span className="sr-only">WhatsApp</span>
            </motion.a>
            <motion.a 
              href="https://instagram.com/rafael.cardoso.treinador" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, color: '#E1306C' }}
              className="text-gray-400 hover:text-pink-500 transition-colors"
            >
              <Instagram size={32} />
              <span className="sr-only">Instagram</span>
            </motion.a>
          </div>
          <p className="mb-2">Suporte via WhatsApp: (11) 99771-1072</p>
          <p className="mb-2">Instagram: @rafael.cardoso.treinador</p>
          <p className="text-sm">&copy; {new Date().getFullYear()} Treinamento Guerreiro Viking - Valhalla Training Center - Rafael Cardoso Treinador. Todos os direitos reservados.</p>
          <p className="text-xs mt-2">Desenvolvido por Marcelo Rodrigues.</p>
        </div>
      </footer>
    </div>
  );
};

export default VikingLandingPage;
  