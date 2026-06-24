import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Phone, TrendingDown, Globe,
  Landmark, Smartphone, ChevronRight,
  Leaf, Package, Truck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ================================================================== */
/*  MAIN COMPONENT                                                      */
/* ================================================================== */

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="bg-cream">
      <HeroSection t={t} />
      <StorySection t={t} />
      <CoverageMap t={t} />
      <WhyDifferent t={t} />
      <ImpactStats t={t} />
      <PaymentPartners t={t} />
      <HowItWorks t={t} />
      <VisionSection t={t} />
      <CtaBanner t={t} />
    </div>
  );
}

/* ================================================================== */
/*  HERO                                                                */
/* ================================================================== */

function HeroSection({ t }: { t: (k: string) => string }) {
  return (
    <section className="relative min-h-[100dvh] bg-forest overflow-hidden flex items-center justify-center">
      {/* Leaf pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5C20 15 10 25 10 35c0 12 9 20 20 20s20-8 20-20C50 25 40 15 30 5z' fill='white'/%3E%3C/svg%3E")`,
          backgroundSize: 80,
        }}
      />

      <div className="container-main relative z-10 text-center py-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-mint uppercase tracking-[0.15em] text-sm font-semibold mb-4"
        >
          {t('aboutPage.heroEyebrow')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-[64px] font-poppins font-bold text-white leading-tight max-w-[800px] mx-auto mb-6"
        >
          {t('aboutPage.heroTitle')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-base md:text-lg text-white/80 max-w-[640px] mx-auto mb-12"
        >
          {t('aboutPage.heroDesc')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex items-center justify-center gap-8 md:gap-12"
        >
          {[
            { num: 4, label: t('aboutPage.heroStat1') },
            { num: 200, suffix: '+', label: t('aboutPage.heroStat2') },
            { num: 4, label: t('aboutPage.heroStat3') },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-space-grotesk text-3xl md:text-4xl font-bold text-white">
                {i === 1 ? <AnimatedCounter target={200} suffix="+" /> : stat.num}
                {stat.suffix && i !== 1 ? stat.suffix : null}
              </div>
              <div className="text-[13px] text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll chevron */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/40"
        >
          <ChevronRight className="w-6 h-6 rotate-90" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ================================================================== */
/*  OUR STORY                                                           */
/* ================================================================== */

function StorySection({ t }: { t: (k: string) => string }) {
  const paragraphs = [
    t('aboutPage.storyPara1'),
    t('aboutPage.storyPara2'),
    t('aboutPage.storyPara3'),
  ];

  return (
    <section className="section-padding bg-cream">
      <div className="container-main max-w-[800px]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-leaf uppercase tracking-[0.1em] text-sm font-semibold text-center mb-8"
        >
          {t('aboutPage.storyEyebrow')}
        </motion.p>

        <div className="space-y-6">
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="text-base md:text-lg text-charcoal leading-[1.9]"
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Pull quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 border-l-4 border-leaf pl-6 py-2"
        >
          <p className="font-poppins font-semibold text-lg md:text-2xl text-leaf italic leading-relaxed">
            {t('aboutPage.pullQuote')}
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  COVERAGE MAP                                                        */
/* ================================================================== */

function CoverageMap({ t }: { t: (k: string) => string }) {
  const countries = [
    { flag: '\uD83C\uDDFA\uD83C\uDDEC', name: 'Uganda', subtitle: t('aboutPage.ugandaSubtitle'), details: '111 districts \u2022 English / Luganda / Swahili \u2022 UGX', stats: '800+ farmers \u2022 2,100+ orders', borderColor: 'border-l-leaf' },
    { flag: '\uD83C\uDDF0\uD83C\uDDEA', name: 'Kenya', subtitle: '', details: '47 counties \u2022 English / Swahili \u2022 KES', stats: '250+ farmers \u2022 680+ orders', borderColor: 'border-l-[#388E3C]' },
    { flag: '\uD83C\uDDF9\uD83C\uDDFF', name: 'Tanzania', subtitle: '', details: '31 regions \u2022 Swahili / English \u2022 TZS', stats: '120+ farmers \u2022 310+ orders', borderColor: 'border-l-[#43A047]' },
    { flag: '\uD83C\uDDF7\uD83C\uDDFC', name: 'Rwanda', subtitle: '', details: '30 districts \u2022 Kinyarwanda / English / French \u2022 RWF', stats: '80+ farmers \u2022 180+ orders', borderColor: 'border-l-[#4CAF50]' },
  ];

  return (
    <section className="section-padding bg-cloud">
      <div className="container-main max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-leaf uppercase tracking-[0.1em] text-sm font-semibold mb-2">
            {t('aboutPage.mapEyebrow')}
          </p>
          <h2 className="text-2xl md:text-[40px] font-poppins font-bold text-charcoal">
            {t('aboutPage.mapTitle')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src="map-east-africa.svg"
              alt="East Africa Map"
              className="w-full h-auto rounded-2xl"
            />
            {/* Pulsing pins on capital cities */}
            {[
              { top: '28%', left: '35%', label: 'Kampala' },
              { top: '35%', left: '18%', label: 'Nairobi' },
              { top: '60%', left: '30%', label: 'Dodoma' },
              { top: '50%', left: '22%', label: 'Kigali' },
            ].map((pin, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.2, duration: 0.4 }}
                className="absolute"
                style={{ top: pin.top, left: pin.left }}
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-sun rounded-full" />
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 w-4 h-4 bg-sun rounded-full"
                  />
                </div>
                <span className="text-[10px] text-white font-medium bg-forest/80 px-1.5 py-0.5 rounded mt-1 block whitespace-nowrap">
                  {pin.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Country cards */}
          <div className="space-y-4">
            {countries.map((c, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className={cn(
                  'bg-white rounded-2xl border border-fog p-5 border-l-4',
                  c.borderColor
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{c.flag}</span>
                  <h3 className="font-poppins font-semibold text-charcoal text-lg">{c.name}</h3>
                </div>
                {c.subtitle && <p className="text-sm text-leaf font-medium mb-1">{c.subtitle}</p>}
                <p className="text-sm text-stone">{c.details}</p>
                <p className="text-xs text-stone mt-1">{c.stats}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  WHY SHAMBANI                                                        */
/* ================================================================== */

function WhyDifferent({ t }: { t: (k: string) => string }) {
  const cards = [
    { icon: Phone, title: t('aboutPage.why1Title'), desc: t('aboutPage.why1Desc') },
    { icon: TrendingDown, title: t('aboutPage.why2Title'), desc: t('aboutPage.why2Desc') },
    { icon: Globe, title: t('aboutPage.why3Title'), desc: t('aboutPage.why3Desc') },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-main max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-[40px] font-poppins font-bold text-charcoal">
            {t('aboutPage.whyTitle')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="bg-cloud rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-mint/20 flex items-center justify-center mx-auto mb-5">
                <card.icon className="w-8 h-8 text-leaf" />
              </div>
              <h3 className="font-poppins font-semibold text-xl text-charcoal mb-3">{card.title}</h3>
              <p className="text-sm text-stone leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  IMPACT STATS                                                        */
/* ================================================================== */

function ImpactStats({ t }: { t: (k: string) => string }) {
  const stats = [
    { target: 245, suffix: 'M+', prefix: 'UGX ', label: t('aboutPage.impactStat1') },
    { target: 1200, suffix: '+', prefix: '', label: t('aboutPage.impactStat2') },
    { target: 3800, suffix: '+', prefix: '', label: t('aboutPage.impactStat3') },
    { target: 200, suffix: '+', prefix: '', label: t('aboutPage.impactStat4') },
  ];

  return (
    <section className="section-padding bg-forest">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-mint uppercase tracking-[0.1em] text-sm font-semibold mb-2">
            {t('aboutPage.impactEyebrow')}
          </p>
          <h2 className="text-2xl md:text-[40px] font-poppins font-bold text-white">
            {t('aboutPage.impactTitle')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="text-center"
            >
              <div className="font-space-grotesk text-3xl md:text-[44px] font-bold text-sun">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-sm text-white/70 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  PAYMENT PARTNERS                                                    */
/* ================================================================== */

function PaymentPartners({ t }: { t: (k: string) => string }) {
  const payments = [
    { icon: Phone, name: 'Airtel Money', desc: t('aboutPage.paymentAirtel') },
    { icon: Smartphone, name: 'MTN Mobile Money', desc: t('aboutPage.paymentMtn') },
    { icon: Globe, name: 'PayPal', desc: t('aboutPage.paymentPaypal') },
    { icon: Landmark, name: 'Bank Transfer', desc: t('aboutPage.paymentBank') },
  ];

  return (
    <section className="section-padding bg-wheat">
      <div className="container-main max-w-[1000px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h3 className="text-xl md:text-2xl font-poppins font-semibold text-charcoal mb-2">
            {t('aboutPage.paymentsTitle')}
          </h3>
          <p className="text-sm text-stone">{t('aboutPage.paymentsDesc')}</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {payments.map((p, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="bg-white rounded-2xl p-6 text-center"
            >
              <p.icon className="w-8 h-8 text-forest mx-auto mb-3" />
              <p className="font-poppins font-medium text-sm text-charcoal">{p.name}</p>
              <p className="text-xs text-stone mt-1">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  HOW IT WORKS (VISUAL STEPS)                                         */
/* ================================================================== */

function HowItWorks({ t }: { t: (k: string) => string }) {
  const steps = [
    { icon: Leaf, title: t('aboutPage.hiw1Title'), desc: t('aboutPage.hiw1Desc') },
    { icon: Package, title: t('aboutPage.hiw2Title'), desc: t('aboutPage.hiw2Desc') },
    { icon: Truck, title: t('aboutPage.hiw3Title'), desc: t('aboutPage.hiw3Desc') },
  ];

  return (
    <section className="section-padding bg-cream">
      <div className="container-main max-w-[1000px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-[40px] font-poppins font-bold text-charcoal">
            {t('aboutPage.hiwTitle')}
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-10 left-[16%] right-[16%] h-0.5 bg-fog hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="text-center relative"
              >
                <div className="w-20 h-20 rounded-full bg-leaf/10 flex items-center justify-center mx-auto mb-5 relative z-10 border-4 border-cream">
                  <step.icon className="w-9 h-9 text-leaf" />
                </div>
                <div className="md:absolute md:-top-3 left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-leaf text-white text-sm font-bold flex items-center justify-center mx-auto mb-3 md:mb-0 z-20">
                  {i + 1}
                </div>
                <h4 className="font-poppins font-semibold text-charcoal text-lg mb-2">{step.title}</h4>
                <p className="text-sm text-stone leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Transparent Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-white rounded-2xl border border-fog p-8 md:p-10 text-center max-w-lg mx-auto"
        >
          <h4 className="font-poppins font-semibold text-charcoal text-lg mb-6">
            {t('aboutPage.pricingTitle')}
          </h4>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="text-center">
              <div className="font-space-grotesk text-3xl font-bold text-leaf">97.5%</div>
              <div className="text-stone mt-1">{t('aboutPage.pricingFarmer')}</div>
            </div>
            <div className="text-stone text-2xl">=</div>
            <div className="text-center">
              <div className="font-space-grotesk text-3xl font-bold text-sun">100%</div>
              <div className="text-stone mt-1">{t('aboutPage.pricingSale')}</div>
            </div>
            <div className="text-stone text-2xl">-</div>
            <div className="text-center">
              <div className="font-space-grotesk text-3xl font-bold text-clay">2.5%</div>
              <div className="text-stone mt-1">{t('aboutPage.pricingFee')}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  VISION                                                              */
/* ================================================================== */

function VisionSection({ t }: { t: (k: string) => string }) {
  return (
    <section className="section-padding bg-cream">
      <div className="container-main max-w-[800px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-leaf uppercase tracking-[0.1em] text-sm font-semibold mb-2">
            {t('aboutPage.visionEyebrow')}
          </p>
          <h2 className="text-2xl md:text-[40px] font-poppins font-bold text-charcoal">
            {t('aboutPage.visionTitle')}
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-base md:text-lg text-charcoal leading-[1.9] text-center mb-10"
        >
          {t('aboutPage.visionText')}
        </motion.p>

        {/* Founder Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl border border-fog p-6 md:p-8 md:ml-5"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-leaf text-white font-poppins font-bold flex items-center justify-center shrink-0">
              RL
            </div>
            <div>
              <p className="font-poppins font-medium text-charcoal italic leading-relaxed">
                {t('aboutPage.founderQuote')}
              </p>
              <p className="text-sm text-leaf font-semibold mt-3 text-right">
                {t('aboutPage.founderName')}
              </p>
            </div>
          </div>
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
            {t('aboutPage.ctaTitle')}
          </h2>
          <p className="text-sm md:text-base text-white/80 max-w-lg mx-auto mb-8">
            {t('aboutPage.ctaDesc')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/browse"
            className="inline-flex items-center justify-center bg-white text-forest font-poppins font-semibold rounded-xl px-7 py-3.5 text-sm hover:bg-white/90 transition-all hover:scale-[1.02]"
          >
            {t('aboutPage.ctaBrowse')}
          </Link>
          <Link
            to="/farmer-register"
            className="inline-flex items-center justify-center border-2 border-white text-white font-poppins font-semibold rounded-xl px-7 py-3.5 text-sm hover:bg-white/10 transition-all"
          >
            {t('aboutPage.ctaSell')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
