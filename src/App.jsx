
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Axe, Shield, Instagram, MessageSquare, Zap, Heart } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

const VikingLandingPage = () => {
  const { toast } = useToast();

  const handleBuyClick = (productName, checkoutUrl) => {
    toast({
      title: "Redirecionando...",
      description: `Você será redirecionado para o Mercado Pago para comprar ${productName}.`,
      duration: 3000,
    });
    console.log(`Comprar ${productName} - Redirecionar para: ${checkoutUrl}`);
    window.open(checkoutUrl, '_blank');
  };

  const backgroundImage1 = "https://storage.googleapis.com/hostinger-horizons-assets-prod/f9552480-90c3-4198-9467-b312fd76a586/c40faa7c51cc2d7b54f6228aa1a73e4e.jpg";
  const backgroundImage2 = "https://storage.googleapis.com/hostinger-horizons-assets-prod/f9552480-90c3-4198-9467-b312fd76a586/83022a09cf98a59c5fd3aa9285b5931b.jpg";
  
  const fichaMasculinaImg = "https://storage.googleapis.com/hostinger-horizons-assets-prod/f9552480-90c3-4198-9467-b312fd76a586/7f386aa144b9abe89ae38eb70835d1bc.jpg";
  const fichaFemininaImg = "https://storage.googleapis.com/hostinger-horizons-assets-prod/f9552480-90c3-4198-9467-b312fd76a586/7ab4904de7f02114916189d7d341fe89.jpg";


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative py-20 md:py-32 bg-cover bg-center bg-no-repeat bg-fixed bg-image-overlay"
        style={{ backgroundImage: `url(${backgroundImage1})` }}
      >
        <div className="container mx-auto px-6 text-center content-z-index">
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
        className="py-16 md:py-24 bg-background"
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
              <img src={fichaMasculinaImg} alt="Ficha de Treino Masculina Viking" className="rounded-lg shadow-2xl w-full max-w-md h-auto border-4 border-primary/70 object-cover aspect-[3/4] mb-6" />
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
              <img src={fichaFemininaImg} alt="Ficha de Treino Feminina Viking" className="rounded-lg shadow-2xl w-full max-w-md h-auto border-4 border-pink-400/70 object-cover aspect-[3/4] mb-6" />
              <p className="text-center text-gray-300 mb-6 max-w-md">Agilidade, poder e graça para forjar um corpo de guerreira. Perfeita para mulheres prontas para a batalha.</p>
               <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold" onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}>
                Ver Planos <Heart className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section 
        id="pricing" 
        className="py-16 md:py-24 bg-cover bg-center bg-no-repeat bg-fixed bg-image-overlay"
        style={{ backgroundImage: `url(${backgroundImage2})` }}
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
              { title: "Ficha Dama do Escudo", price: "49,90", support: false, icon: Axe, borderColor: "border-pink-400/50", shadowColor: "hover:shadow-pink-400/40", buttonColor: "bg-pink-500 hover:bg-pink-600", idSuffix:"valquiria_sem_suporte", checkoutUrl: "https://mpago.li/31PARuD" },
              { title: "Ficha Dama do Escudo + Suporte", price: "99,90", support: true, icon: Shield, borderColor: "border-purple-400/70", shadowColor: "hover:shadow-purple-400/40", buttonColor: "bg-purple-500 hover:bg-purple-600", idSuffix:"valquiria_com_suporte", checkoutUrl: "https://mpago.li/2UVu9Ma" },
              { title: "Combo Lendário: Guerreiro + Dama do Escudo", price: "149,85", support: true, icon: Zap, borderColor: "border-yellow-400/70", shadowColor: "hover:shadow-yellow-400/40", buttonColor: "bg-yellow-500 hover:bg-yellow-600", idSuffix:"combo_lendario_com_suporte", checkoutUrl: "https://mpago.li/2XW4YwY" },
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
                  ? "md:max-w-lg" // Limita a largura do card centralizado
                  : "w-full"      // Garante que os outros cards ocupem a coluna
                }`}>
                  <CardHeader className="items-center">
                    <plan.icon className={`h-16 w-16 ${plan.support ? 'text-accent' : 'text-primary'} mb-4`} />
                    <CardTitle 
                      className={`text-2xl lg:text-3xl text-center ${
                        plan.title.includes("Combo") ? 'text-yellow-400' : 
                        plan.support ? (plan.title.includes("Dama") ? 'text-purple-400' : 'text-accent') : 
                        (plan.title.includes("Dama") ? 'text-pink-400' : 'text-primary')
                      }`} 
                      style={{ fontFamily: "'Cinzel Decorative', serif" }}
                    >{plan.title}</CardTitle>
                    <CardDescription 
                      className={`text-2xl font-bold text-center ${
                        plan.title.includes("Combo") ? 'text-yellow-300' :
                        plan.support ? (plan.title.includes("Dama") ? 'text-purple-300' : 'text-primary') : 
                        (plan.title.includes("Dama") ? 'text-pink-300' : 'text-accent')
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
                    <Button variant={plan.support ? "secondary" : "primary"} size="lg" className={`w-full ${plan.buttonColor} text-primary-foreground font-semibold`} onClick={() => handleBuyClick(plan.title, plan.checkoutUrl)}>
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
  