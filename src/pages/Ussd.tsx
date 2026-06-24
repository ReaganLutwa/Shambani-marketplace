import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Smartphone, ChevronDown, ChevronRight,
  CreditCard, Bell, TrendingUp, ArrowLeft, CornerDownLeft,
} from 'lucide-react';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-unused-vars */

/* ================================================================== */
/*  MENU DATA                                                           */
/* ================================================================== */

interface MenuNode {
  title: string;
  options: { key: string; label: string; action?: string }[];
}

const menuData: Record<string, MenuNode> = {
  main: {
    title: 'Welcome to ShambaNi',
    options: [
      { key: '1', label: 'List Produce' },
      { key: '2', label: 'My Orders' },
      { key: '3', label: 'Payment Status' },
      { key: '4', label: 'Help' },
      { key: '5', label: 'Change Language' },
    ],
  },
  '1': {
    title: 'Select Category:',
    options: [
      { key: '1', label: 'Vegetables' },
      { key: '2', label: 'Fruits' },
      { key: '3', label: 'Grains' },
      { key: '4', label: 'Livestock' },
      { key: '5', label: 'Dairy' },
      { key: '6', label: 'Spices' },
      { key: '7', label: 'Nuts & Seeds' },
      { key: '8', label: 'Root Crops' },
      { key: '0', label: 'Back', action: 'back' },
    ],
  },
  '2': {
    title: 'Your Orders:',
    options: [
      { key: '1', label: 'New Orders (3)' },
      { key: '2', label: 'In Progress (1)' },
      { key: '3', label: 'Completed (12)' },
      { key: '0', label: 'Back', action: 'back' },
    ],
  },
  '3': {
    title: 'Payments:',
    options: [
      { key: '1', label: 'Pending (UGX 115,000)' },
      { key: '2', label: 'This Week (UGX 345,000)' },
      { key: '3', label: 'All Time (UGX 2.1M)' },
      { key: '0', label: 'Back', action: 'back' },
    ],
  },
  '4': {
    title: 'Help & Support:',
    options: [
      { key: '1', label: 'Call: +256 700 123 456' },
      { key: '2', label: 'SMS Tips Available' },
      { key: '0', label: 'Back', action: 'back' },
    ],
  },
  '5': {
    title: 'Select Language:',
    options: [
      { key: '1', label: 'English' },
      { key: '2', label: 'Luganda' },
      { key: '3', label: 'Kiswahili' },
      { key: '4', label: 'Runyarwanda' },
      { key: '0', label: 'Back', action: 'back' },
    ],
  },
};

/* ================================================================== */
/*  ANIMATION HELPERS                                                   */
/* ================================================================== */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] },
  }),
};

/* ================================================================== */
/*  MAIN COMPONENT                                                      */
/* ================================================================== */

export default function Ussd() {
  const { t } = useTranslation();

  return (
    <div className="bg-cream">
      <HeroSection t={t} />
      <HowItWorks t={t} />
      <PhoneSimulator t={t} />
      <LanguagesSection t={t} />
      <SmsAlerts t={t} />
      <FaqSection t={t} />
      <CtaBanner t={t} />
    </div>
  );
}

/* ================================================================== */
/*  HERO                                                                */
/* ================================================================== */

function HeroSection({ t }: { t: (k: string) => string }) {
  return (
    <section className="relative min-h-[100dvh] bg-gradient-to-br from-forest to-leaf overflow-hidden">
      {/* Decorative floating circles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-mint/[0.12]"
          style={{
            width: 12 + Math.random() * 20,
            height: 12 + Math.random() * 20,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      <div className="container-main relative z-10 min-h-[100dvh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full py-20">
          {/* Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-mint uppercase tracking-[0.1em] text-sm font-semibold mb-4"
            >
              {t('ussdPage.heroEyebrow')}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-[56px] font-poppins font-bold text-white leading-tight mb-5"
            >
              {t('ussdPage.heroTitle')}{' '}
              <span className="italic text-sun">{t('ussdPage.heroTitleEmphasis')}</span>{' '}
              {t('ussdPage.heroTitleEnd')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base md:text-lg text-white/80 max-w-[480px] mb-8"
            >
              {t('ussdPage.heroDesc')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <span
                className="font-space-grotesk text-[48px] md:text-[72px] font-bold text-sun inline-block"
                style={{ textShadow: '0 0 60px rgba(255,179,0,0.4)' }}
              >
                *288#
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-8"
            >
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 border-2 border-white text-white font-poppins font-semibold rounded-xl px-7 py-3.5 hover:bg-white/10 transition-all"
              >
                {t('ussdPage.heroCta')} <ChevronDown className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* Phone image */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotate: -8 }}
            animate={{ opacity: 1, x: 0, rotate: -5 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] }}
            className="hidden lg:flex justify-center"
          >
            <img
              src="/ussd-phone-mockup.png"
              alt="USSD Phone"
              className="max-w-[280px] drop-shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  HOW IT WORKS                                                        */
/* ================================================================== */

function HowItWorks({ t }: { t: (k: string) => string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    {
      number: '1',
      title: t('ussdPage.step1Title'),
      desc: t('ussdPage.step1Desc'),
      align: 'left' as const,
      miniScreen: '*288#',
    },
    {
      number: '2',
      title: t('ussdPage.step2Title'),
      desc: t('ussdPage.step2Desc'),
      align: 'right' as const,
      miniScreen: `ShambaNi\n1. List Produce\n2. Check Orders\n3. Payment\n4. Help`,
    },
    {
      number: '3',
      title: t('ussdPage.step3Title'),
      desc: t('ussdPage.step3Desc'),
      align: 'left' as const,
      miniScreen: t('ussdPage.smsMockup'),
    },
  ];

  return (
    <section id="how-it-works" className="section-padding bg-cream">
      <div className="container-main max-w-[1000px]" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-leaf uppercase tracking-[0.1em] text-sm font-semibold mb-2">
            {t('ussdPage.howEyebrow')}
          </p>
          <h2 className="text-2xl md:text-[40px] font-poppins font-bold text-charcoal">
            {t('ussdPage.howTitle')}
          </h2>
        </motion.div>

        <div className="relative">
          {/* Central timeline line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 border-l-2 border-dashed border-mint/50" />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, x: step.align === 'left' ? -30 : 30 }}
                animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
                className={cn(
                  'relative flex items-start gap-6 md:gap-0',
                  step.align === 'right' ? 'md:flex-row-reverse' : ''
                )}
              >
                {/* Number circle */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-leaf text-white font-space-grotesk font-bold text-lg flex items-center justify-center z-10 shadow-lg">
                  {step.number}
                </div>

                {/* Content */}
                <div className={cn(
                  'ml-16 md:ml-0 md:w-[45%]',
                  step.align === 'left' ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'
                )}>
                  <h3 className="text-lg md:text-xl font-poppins font-semibold text-charcoal mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-stone mb-4">{step.desc}</p>
                  {/* Mini phone screen */}
                  <div className={cn(
                    'inline-block bg-night rounded-lg p-3 font-mono text-[10px] text-mint/80 whitespace-pre leading-relaxed shadow-lg',
                    step.align === 'left' ? 'md:ml-auto' : ''
                  )}>
                    {step.miniScreen}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  PHONE SIMULATOR                                                     */
/* ================================================================== */

function PhoneSimulator({ t }: { t: (k: string) => string }) {
  const [screen, setScreen] = useState<string>('main');
  const [displayText, setDisplayText] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const fullTextRef = useRef('');

  const currentMenu = menuData[screen] || menuData['main'];

  // Typewriter effect
  useEffect(() => {
    const text = `${currentMenu.title}\n${currentMenu.options.map((o) => `${o.key}. ${o.label}`).join('\n')}`;
    fullTextRef.current = text;
    setDisplayText('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [screen]);

  const handleKey = useCallback((key: string) => {
    const option = currentMenu.options.find((o) => o.key === key);
    if (!option) return;
    if (option.action === 'back') {
      setHistory((h) => h.slice(0, -1));
      setScreen(history.length > 0 ? history[history.length - 1] : 'main');
    } else if (menuData[key]) {
      setHistory((h) => [...h, screen]);
      setScreen(key);
    }
  }, [currentMenu, history, screen]);

  const goBack = () => {
    if (history.length > 0) {
      setScreen(history[history.length - 1]);
      setHistory((h) => h.slice(0, -1));
    }
  };

  return (
    <section className="section-padding bg-cloud">
      <div className="container-main max-w-[800px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-[40px] font-poppins font-bold text-charcoal">
            {t('ussdPage.exploreTitle')}
          </h2>
          <p className="text-sm text-stone mt-2 max-w-md mx-auto">
            {t('ussdPage.exploreDesc')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          {/* Phone body */}
          <div className="bg-[#333] rounded-[32px] p-4 shadow-2xl w-[280px] md:w-[320px]">
            {/* Screen */}
            <div className="bg-[#C8E6C9] rounded-xl p-3 mb-4 h-[200px] font-mono text-xs text-[#1B5E20] overflow-hidden relative">
              <div className="absolute top-2 right-2 text-[10px] text-[#1B5E20]/60 flex items-center gap-1">
                <Smartphone className="w-3 h-3" /> ShambaNi
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed mt-4">{displayText}</pre>
              <div className="absolute bottom-2 left-3 text-[10px] text-[#1B5E20]/50 animate-pulse">_</div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {['1','2','3','4','5','6','7','8','9','*','0','#'].map((key) => (
                <motion.button
                  key={key}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleKey(key)}
                  className="w-full aspect-square rounded-full bg-[#444] text-white text-sm font-medium flex items-center justify-center hover:bg-[#555] transition-colors active:bg-[#555]"
                >
                  {key}
                </motion.button>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-3 px-1">
              <motion.button whileTap={{ scale: 0.9 }} onClick={goBack} className="p-2 rounded-full bg-[#555] text-white hover:bg-[#666]">
                <ArrowLeft className="w-4 h-4" />
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} className="flex-1 mx-3 py-2 rounded-full bg-leaf text-white text-xs font-medium flex items-center justify-center gap-1 hover:bg-forest">
                <CornerDownLeft className="w-3 h-3" /> OK
              </motion.button>
              <div className="w-8" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  LANGUAGES                                                           */
/* ================================================================== */

function LanguagesSection({ t }: { t: (k: string) => string }) {
  const languages = [
    { flag: '\uD83C\uDDFA\uD83C\uDDEC', name: 'English', greeting: 'Welcome to ShambaNi!' },
    { flag: '\uD83C\uDDF9\uD83C\uDDFF', name: 'Kiswahili', greeting: 'Karibu ShambaNi!' },
    { flag: '\uD83C\uDDF7\uD83C\uDDFC', name: 'Runyarwanda', greeting: 'Murakaza neza muri ShambaNi!' },
    { flag: '\uD83C\uDDFA\uD83C\uDDEC', name: 'Luganda', greeting: 'Tukusiza mu ShambaNi!' },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-main max-w-[1000px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-[40px] font-poppins font-bold text-charcoal">
            {t('ussdPage.langTitle')}
          </h2>
          <p className="text-sm text-stone mt-2 max-w-lg mx-auto">
            {t('ussdPage.langDesc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {languages.map((lang, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="bg-white border border-fog rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
            >
              <span className="text-4xl mb-3 block">{lang.flag}</span>
              <h4 className="font-poppins font-semibold text-charcoal mb-1">{lang.name}</h4>
              <p className="text-xs text-stone italic mb-3">{lang.greeting}</p>
              <span className="inline-block bg-mint/20 text-forest text-[11px] font-medium px-2.5 py-1 rounded-full">
                {t('ussdPage.availableNow')}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  SMS ALERTS                                                          */
/* ================================================================== */

function SmsAlerts({ t }: { t: (k: string) => string }) {
  const messages = [
    {
      icon: Bell,
      title: t('ussdPage.sms1Title'),
      content: t('ussdPage.sms1Content'),
      time: t('ussdPage.sms1Time'),
      align: 'left' as const,
      bg: 'bg-white',
    },
    {
      icon: CreditCard,
      title: t('ussdPage.sms2Title'),
      content: t('ussdPage.sms2Content'),
      time: t('ussdPage.sms2Time'),
      align: 'right' as const,
      bg: 'bg-wheat',
    },
    {
      icon: TrendingUp,
      title: t('ussdPage.sms3Title'),
      content: t('ussdPage.sms3Content'),
      time: t('ussdPage.sms3Time'),
      align: 'left' as const,
      bg: 'bg-white',
    },
  ];

  return (
    <section className="section-padding bg-forest">
      <div className="container-main max-w-[900px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-mint uppercase tracking-[0.1em] text-sm font-semibold mb-2">
            {t('ussdPage.smsEyebrow')}
          </p>
          <h2 className="text-2xl md:text-[40px] font-poppins font-bold text-white">
            {t('ussdPage.smsTitle')}
          </h2>
        </motion.div>

        <div className="space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.align === 'left' ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className={cn(
                'flex',
                msg.align === 'right' ? 'justify-end' : 'justify-start'
              )}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                className={cn(
                  'max-w-[400px] rounded-2xl p-5 shadow-lg',
                  msg.bg
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <msg.icon className="w-5 h-5 text-leaf" />
                  <span className="font-poppins font-semibold text-sm text-charcoal">{msg.title}</span>
                </div>
                <p className="text-sm text-stone leading-relaxed">{msg.content}</p>
                <p className="text-[11px] text-stone mt-2">{msg.time}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  FAQ                                                                 */
/* ================================================================== */

function FaqSection({ t }: { t: (k: string) => string }) {
  const faqs = [
    { q: 'faqQ1', a: 'faqA1' },
    { q: 'faqQ2', a: 'faqA2' },
    { q: 'faqQ3', a: 'faqA3' },
    { q: 'faqQ4', a: 'faqA4' },
    { q: 'faqQ5', a: 'faqA5' },
    { q: 'faqQ6', a: 'faqA6' },
  ];

  return (
    <section className="section-padding bg-cream">
      <div className="container-main max-w-[800px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-[40px] font-poppins font-bold text-charcoal">
            {t('ussdPage.faqTitle')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-white border border-fog rounded-xl px-5 overflow-hidden data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-left font-poppins font-semibold text-sm md:text-base text-charcoal hover:no-underline py-4">
                  {t(`ussdPage.${faq.q}`)}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-stone pb-4 leading-relaxed">
                  {t(`ussdPage.${faq.a}`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  CTA BANNER                                                          */
/* ================================================================== */

function CtaBanner({ t }: { t: (k: string) => string }) {
  return (
    <section className="bg-gradient-to-br from-leaf to-sprout py-16 md:py-20">
      <div className="container-main text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-[40px] font-poppins font-bold text-white mb-4">
            {t('ussdPage.ctaTitle')}
          </h2>
          <p className="text-sm md:text-base text-white/85 max-w-lg mx-auto mb-6">
            {t('ussdPage.ctaDesc')}
          </p>
          <span
            className="font-space-grotesk text-[36px] md:text-[48px] font-bold text-sun inline-block mb-8"
            style={{ textShadow: '0 0 40px rgba(255,179,0,0.3)' }}
          >
            *288#
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/farmer-register"
            className="inline-flex items-center justify-center bg-white text-forest font-poppins font-semibold rounded-xl px-7 py-3.5 text-sm hover:bg-white/90 transition-all hover:scale-[1.02]"
          >
            {t('ussdPage.ctaRegister')} <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center border-2 border-white text-white font-poppins font-semibold rounded-xl px-7 py-3.5 text-sm hover:bg-white/10 transition-all"
          >
            {t('ussdPage.ctaHome')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
