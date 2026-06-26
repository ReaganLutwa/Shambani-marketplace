import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Printer, MessageCircle, Calculator, CheckCircle, Truck,
  ChevronRight, ExternalLink, Phone, Mail, MapPin,
  FileText, Palette, Building2, PackageCheck, Upload,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FileUpload, { type UploadedFile, type PrintConfig } from '@/components/FileUpload';

/* ───────── Animation variants ───────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

/* ───────── Pricing tiers ───────── */
const pricingTiers = [
  {
    name: 'Black & White',
    nameKey: 'printDrop.bwTitle',
    descKey: 'printDrop.bwDesc',
    price: '500',
    unitKey: 'printDrop.perPage',
    features: [
      'printDrop.featA4',
      'printDrop.featSingle',
      'printDrop.featLaser',
      'printDrop.featSameDay',
    ],
    ctaKey: 'printDrop.orderBw',
    highlighted: false,
  },
  {
    name: 'Color Print',
    nameKey: 'printDrop.colorTitle',
    descKey: 'printDrop.colorDesc',
    price: '1,500',
    unitKey: 'printDrop.perPage',
    features: [
      'printDrop.featA4',
      'printDrop.featVibrant',
      'printDrop.featSingle',
      'printDrop.featSameDay',
      'printDrop.featPresentation',
    ],
    ctaKey: 'printDrop.orderColor',
    highlighted: true,
  },
  {
    name: 'Bulk / Business',
    nameKey: 'printDrop.bulkTitle',
    descKey: 'printDrop.bulkDesc',
    price: 'Custom',
    unitKey: 'printDrop.pricing',
    features: [
      'printDrop.featDiscounted',
      'printDrop.featMonthly',
      'printDrop.featScheduled',
      'printDrop.featBinding',
      'printDrop.featSupport',
    ],
    ctaKey: 'printDrop.getQuote',
    highlighted: false,
  },
];

/* ───────── Ecosystem links ───────── */
const ecosystemLinks = [
  {
    name: 'Unifiedfarm BLM',
    desc: 'Premium poultry farm in Mpigi, Uganda',
    icon: '\uD83C\uDF3F',
    href: 'https://www.unifiedfarmblm.com',
    bg: 'bg-green-50',
  },
  {
    name: 'PrintDrop',
    desc: 'Document printing & delivery',
    icon: '\uD83D\uDDA8',
    href: '#',
    bg: 'bg-green-50',
    current: true,
  },
  {
    name: 'Farm Blog',
    desc: 'Chicken & coffee farming stories',
    icon: '\u270D',
    href: 'https://unifiedfarmblm.blogspot.com',
    bg: 'bg-orange-50',
  },
  {
    name: 'Fiverr',
    desc: 'Freelance digital services',
    icon: '\uD83D\uDCBC',
    href: 'https://www.fiverr.com',
    bg: 'bg-red-50',
  },
];

/* ═══════════════ PRINTDROP PAGE ═══════════════ */
export default function PrintDrop() {
  const { t } = useTranslation();
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);

  // WhatsApp order handler
  const handleWhatsAppOrder = (files: UploadedFile[], config: PrintConfig) => {
    const fileNames = files.map(f => f.name).join(', ');
    const totalPages = files.reduce((sum, f) => sum + f.pages * config.copies, 0);
    const pricePerPage = config.printType === 'bw' ? 500 : 1500;
    const bindingCosts = { none: 0, comb: 5000, staple: 1000 };
    const subtotal = totalPages * pricePerPage;
    const bindingCost = files.length > 0 ? bindingCosts[config.binding] * files.length : 0;
    const total = subtotal + bindingCost;

    const message = encodeURIComponent(
      `*PrintDrop Order*\n\n` +
      `Files: ${fileNames}\n` +
      `Print Type: ${config.printType === 'bw' ? 'Black & White' : 'Color'}\n` +
      `Copies: ${config.copies}\n` +
      `Pages: ${totalPages}\n` +
      `Binding: ${config.binding === 'none' ? 'None' : config.binding === 'comb' ? 'Comb (UGX 5,000)' : 'Staple (UGX 1,000)'}\n` +
      `Total Estimate: *UGX ${total.toLocaleString()}*\n\n` +
      `Please confirm and I will send the files for printing.`
    );

    window.open(`https://wa.me/256708813419?text=${message}`, '_blank');
  };

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section
        className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2818 0%, #1a4d2e 50%, #2E7D32 100%)' }}
      >
        {/* Leaf pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q45 20 30 55 Q15 20 30 5' fill='white'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="container-main relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.2}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 text-mint px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-mint rounded-full animate-pulse" />
                {t('printDrop.heroBadge')}
              </div>
              <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-[56px] text-white leading-[1.1] tracking-[-0.02em]">
                {t('printDrop.heroTitle')}{' '}
                <span className="text-mint">{t('printDrop.heroHighlight')}</span>
              </h1>
              <p className="mt-5 text-lg text-white/80 max-w-[480px] leading-relaxed">
                {t('printDrop.heroSubtitle')}
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <a
                  href="https://wa.me/256708813419"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-forest font-poppins font-semibold rounded-xl hover:bg-mint transition-all duration-200 hover:scale-[1.02]"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('printDrop.ctaWhatsApp')}
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/30 text-white font-poppins font-semibold rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  {t('printDrop.ctaPricing')}
                </a>
              </div>
            </motion.div>

            {/* Right: Price Card */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-[380px] w-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-mint/20 rounded-xl flex items-center justify-center">
                    <Printer className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-charcoal text-lg">{t('printDrop.priceCardTitle')}</h3>
                    <p className="text-sm text-stone">A4 | 80 GSM | {t('printDrop.singleSide')}</p>
                  </div>
                </div>

                <div className="space-y-0 mt-6">
                  {[
                    { label: t('printDrop.bwLabel'), dot: 'bg-charcoal', price: 'UGX 500 / page' },
                    { label: t('printDrop.colorLabel'), dot: 'bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500', price: 'UGX 1,500 / page' },
                    { label: t('printDrop.deliveryLabel'), dot: 'bg-sun', price: t('printDrop.deliveryPrice') },
                    { label: t('printDrop.bindingLabel'), dot: 'bg-forest', price: 'UGX 5,000' },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3.5 border-b border-fog last:border-0"
                    >
                      <span className="flex items-center gap-3 text-charcoal font-medium">
                        <span className={`w-3 h-3 rounded-full ${row.dot}`} />
                        {row.label}
                      </span>
                      <span className="font-space font-bold text-forest">{row.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <p className="text-leaf font-poppins font-semibold text-sm uppercase tracking-[0.1em] mb-2">
              {t('printDrop.hiwEyebrow')}
            </p>
            <h2 className="font-poppins font-bold text-3xl md:text-[40px] text-charcoal leading-tight tracking-[-0.01em]">
              {t('printDrop.hiwTitle')}
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { num: '1', titleKey: 'printDrop.step1Title', descKey: 'printDrop.step1Desc', Icon: MessageCircle },
              { num: '2', titleKey: 'printDrop.step2Title', descKey: 'printDrop.step2Desc', Icon: Calculator },
              { num: '3', titleKey: 'printDrop.step3Title', descKey: 'printDrop.step3Desc', Icon: Printer },
              { num: '4', titleKey: 'printDrop.step4Title', descKey: 'printDrop.step4Desc', Icon: Truck },
            ].map((step) => (
              <motion.div
                key={step.num}
                variants={staggerItem}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-leaf flex items-center justify-center mb-5">
                  <span className="font-space font-bold text-xl text-white">{step.num}</span>
                </div>
                <step.Icon className="w-7 h-7 text-leaf mb-3" />
                <h3 className="font-poppins font-semibold text-lg text-charcoal mb-2">
                  {t(step.titleKey)}
                </h3>
                <p className="text-stone text-sm leading-relaxed max-w-xs">
                  {t(step.descKey)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ UPLOAD FILES ═══════ */}
      <section className="section-padding bg-[#0F172A]">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Upload className="w-4 h-4" />
              Upload & Print
            </div>
            <h2 className="font-poppins font-bold text-3xl md:text-[40px] text-[#E2E8F0] leading-tight tracking-[-0.01em]">
              Upload Your Files
            </h2>
            <p className="text-[#94A3B8] mt-3 max-w-lg mx-auto">
              Drag and drop files, take a photo, or browse. We will calculate the price instantly.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.2}
          >
            <FileUpload onOrderReady={handleWhatsAppOrder} />
          </motion.div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section id="pricing" className="section-padding bg-cloud">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <p className="text-leaf font-poppins font-semibold text-sm uppercase tracking-[0.1em] mb-2">
              {t('printDrop.pricingEyebrow')}
            </p>
            <h2 className="font-poppins font-bold text-3xl md:text-[40px] text-charcoal leading-tight tracking-[-0.01em]">
              {t('printDrop.pricingTitle')}
            </h2>
            <p className="text-stone mt-3 max-w-lg mx-auto">
              {t('printDrop.pricingSubtitle')}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto"
          >
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                variants={staggerItem}
                onMouseEnter={() => setHoveredTier(i)}
                onMouseLeave={() => setHoveredTier(null)}
                className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 ${
                  tier.highlighted
                    ? 'border-leaf shadow-lg scale-[1.02]'
                    : 'border-fog hover:border-leaf/50 hover:shadow-md'
                } ${hoveredTier !== null && hoveredTier !== i && !tier.highlighted ? 'scale-[0.98] opacity-90' : ''}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-leaf text-white text-xs font-bold px-4 py-1 rounded-full">
                    {t('printDrop.popular')}
                  </div>
                )}

                <h3 className="font-poppins font-bold text-charcoal text-lg">{t(tier.nameKey)}</h3>
                <p className="text-sm text-stone mt-1">{t(tier.descKey)}</p>

                <div className="mt-5">
                  <span className={`font-space font-bold ${tier.price === 'Custom' ? 'text-2xl' : 'text-4xl'} text-forest`}>
                    {tier.price === 'Custom' ? t(tier.price) : `UGX ${tier.price}`}
                  </span>
                  {tier.price !== 'Custom' && (
                    <span className="text-stone text-sm"> / {t(tier.unitKey)}</span>
                  )}
                </div>

                <ul className="mt-6 space-y-3">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-charcoal">
                      <CheckCircle className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
                      {t(feat)}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/256708813419"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full mt-8 py-3 rounded-xl font-poppins font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] ${
                    tier.highlighted
                      ? 'bg-leaf text-white hover:bg-forest'
                      : tier.price === 'Custom'
                      ? 'bg-charcoal text-white hover:bg-night'
                      : 'bg-cloud text-charcoal hover:bg-fog border border-fog'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  {t(tier.ctaKey)}
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ SERVICES DETAIL ═══════ */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <p className="text-leaf font-poppins font-semibold text-sm uppercase tracking-[0.1em] mb-2">
              {t('printDrop.servicesEyebrow')}
            </p>
            <h2 className="font-poppins font-bold text-3xl md:text-[40px] text-charcoal leading-tight tracking-[-0.01em]">
              {t('printDrop.servicesTitle')}
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { title: t('printDrop.svcDocuments'), desc: t('printDrop.svcDocumentsDesc'), Icon: FileText },
              { title: t('printDrop.svcPhotos'), desc: t('printDrop.svcPhotosDesc'), Icon: Palette },
              { title: t('printDrop.svcBinding'), desc: t('printDrop.svcBindingDesc'), Icon: PackageCheck },
              { title: t('printDrop.svcBusiness'), desc: t('printDrop.svcBusinessDesc'), Icon: Building2 },
            ].map((svc) => (
              <motion.div
                key={svc.title}
                variants={staggerItem}
                className="bg-cloud rounded-2xl p-6 text-center card-hover"
              >
                <div className="w-14 h-14 bg-mint/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svc.Icon className="w-7 h-7 text-forest" />
                </div>
                <h3 className="font-poppins font-semibold text-charcoal mb-2">{svc.title}</h3>
                <p className="text-sm text-stone leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ ECOSYSTEM ═══════ */}
      <section className="section-padding bg-cloud">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <p className="text-leaf font-poppins font-semibold text-sm uppercase tracking-[0.1em] mb-2">
              {t('printDrop.ecoEyebrow')}
            </p>
            <h2 className="font-poppins font-bold text-3xl md:text-[40px] text-charcoal leading-tight tracking-[-0.01em]">
              {t('printDrop.ecoTitle')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ecosystemLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`relative bg-white border-2 rounded-2xl p-7 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                  link.current ? 'border-leaf' : 'border-fog hover:border-leaf/50'
                }`}
              >
                {link.current && (
                  <span className="absolute -top-2.5 right-3 bg-leaf text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    YOU ARE HERE
                  </span>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl ${link.bg}`}>
                  {link.icon}
                </div>
                <h4 className="font-poppins font-bold text-charcoal text-sm">{link.name}</h4>
                <p className="text-xs text-stone mt-1">{link.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)' }}>
        <div className="container-main text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={staggerItem}
              className="font-poppins font-bold text-3xl md:text-[40px] text-white leading-tight tracking-[-0.01em] mb-4"
            >
              {t('printDrop.ctaTitle')}
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="text-lg text-white/80 max-w-xl mx-auto mb-8 leading-relaxed"
            >
              {t('printDrop.ctaSubtitle')}
            </motion.p>
            <motion.div variants={staggerItem} className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/256708813419"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-forest font-poppins font-semibold rounded-xl hover:bg-mint transition-all duration-200 hover:scale-[1.02]"
              >
                <MessageCircle className="w-5 h-5" />
                {t('printDrop.ctaWhatsApp')}
              </a>
            </motion.div>
            <motion.p variants={staggerItem} className="text-white/60 text-sm mt-6 flex flex-wrap items-center justify-center gap-4">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                +256 708 813 419
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                ryglutwa0@gmail.com
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Mpigi, Uganda
              </span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ BACK TO SHAMBANI ═══════ */}
      <section className="py-10 bg-cream border-t border-fog">
        <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-stone text-sm">
            {t('printDrop.backToShambani')}
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-leaf font-poppins font-semibold hover:text-forest transition-colors"
          >
            {t('printDrop.browseProduce')}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
