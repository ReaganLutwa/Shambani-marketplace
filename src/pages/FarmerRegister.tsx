import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User, Phone, Mail, Lock, MapPin, Tractor, FileText,
  ChevronRight, ChevronLeft, Check, CreditCard, Landmark,
  Globe, Smartphone, AlertCircle, Eye, EyeOff,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { countriesData, getDistrictsForCountry, supportedCountries } from '@/data/districts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types & Schema                                                      */
/* ------------------------------------------------------------------ */

type PaymentMethod = 'airtel' | 'mtn' | 'paypal' | 'bank';

interface FormData {
  // Step 1
  fullName: string;
  phone: string;
  email: string;
  country: string;
  language: string;
  password: string;
  confirmPassword: string;
  // Step 2
  farmName: string;
  farmAbout: string;
  region: string;
  district: string;
  village: string;
  farmSize: string;
  farmSizeUnit: 'acres' | 'hectares';
  produceTypes: string[];
  // Step 3
  paymentMethods: PaymentMethod[];
  airtelNumber: string;
  mtnNumber: string;
  paypalEmail: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankBranch: string;
  termsAccepted: boolean;
}

const step1Schema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  phone: z.string().min(5, 'Phone number is required'),
  email: z.string().email('Invalid email').or(z.literal('')),
  country: z.string().min(1, 'Country is required'),
  language: z.string().min(1, 'Language is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const step2Schema = z.object({
  farmName: z.string().min(1, 'Farm name is required'),
  farmAbout: z.string().min(10, 'Please write at least 10 characters'),
  region: z.string().min(1, 'Region is required'),
  district: z.string().min(1, 'District is required'),
  village: z.string().min(1, 'Village/Area is required'),
  farmSize: z.string().optional(),
  farmSizeUnit: z.enum(['acres', 'hectares']).optional(),
  produceTypes: z.array(z.string()).min(1, 'Select at least one produce type'),
});

const step3Schema = z.object({
  paymentMethods: z.array(z.enum(['airtel', 'mtn', 'paypal', 'bank'])).min(1, 'Select at least one payment method'),
  airtelNumber: z.string().optional(),
  mtnNumber: z.string().optional(),
  paypalEmail: z.string().optional(),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountName: z.string().optional(),
  bankBranch: z.string().optional(),
  termsAccepted: z.boolean().refine((v) => v === true, { message: 'You must accept the terms' }),
});

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                   */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] },
  }),
};

/* ------------------------------------------------------------------ */
/*  Password strength                                                   */
/* ------------------------------------------------------------------ */

function getPasswordStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

function strengthLabel(s: number): { text: string; color: string } {
  if (s === 0) return { text: 'Very Weak', color: 'bg-error' };
  if (s === 1) return { text: 'Weak', color: 'bg-error' };
  if (s === 2) return { text: 'Fair', color: 'bg-warning' };
  if (s === 3) return { text: 'Good', color: 'bg-sun' };
  return { text: 'Strong', color: 'bg-leaf' };
}

/* ------------------------------------------------------------------ */
/*  Produce options                                                     */
/* ------------------------------------------------------------------ */

const produceOptions = [
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'grains', label: 'Grains' },
  { id: 'livestock', label: 'Livestock' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'spices', label: 'Spices' },
  { id: 'nuts', label: 'Nuts & Seeds' },
  { id: 'roots', label: 'Root Crops' },
  { id: 'other', label: 'Other' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'rw', name: 'Runyarwanda' },
  { code: 'lg', name: 'Luganda' },
];

/* ================================================================== */
/*  MAIN COMPONENT                                                      */
/* ================================================================== */

export default function FarmerRegister() {
  const { t } = useTranslation();
  const { login } = useAuthStore();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      country: '', language: 'en', paymentMethods: [], produceTypes: [],
      farmSizeUnit: 'acres', email: '', termsAccepted: false,
    },
    resolver: (step === 1 ? zodResolver(step1Schema)
      : step === 2 ? zodResolver(step2Schema)
      : step === 3 ? zodResolver(step3Schema)
      : undefined) as unknown as import('react-hook-form').Resolver<FormData> | undefined,
    mode: 'onChange',
  });

  const selectedCountry = watch('country');
  const selectedPaymentMethods = watch('paymentMethods') || [];
  const passwordValue = watch('password') || '';
  const produceTypes = watch('produceTypes') || [];

  const districts = useMemo(
    () => (selectedCountry ? getDistrictsForCountry(selectedCountry) : []),
    [selectedCountry]
  );

  const regions = useMemo(() => {
    if (!selectedCountry) return [];
    return countriesData[selectedCountry]?.regions.map((r) => r.name) || [];
  }, [selectedCountry]);

  /* --- step navigation --- */
  const goNext = async () => {
    const fields: Record<number, (keyof FormData)[]> = {
      1: ['fullName', 'phone', 'email', 'country', 'language', 'password', 'confirmPassword'],
      2: ['farmName', 'farmAbout', 'region', 'district', 'village', 'produceTypes'],
      3: ['paymentMethods', 'termsAccepted'],
    };
    const ok = await trigger(fields[step] || []);
    if (!ok) return;

    /* extra validation for step 3 payment details */
    if (step === 3) {
      const pm = watch('paymentMethods');
      if (pm.includes('airtel') && !watch('airtelNumber')) {
        return;
      }
      if (pm.includes('mtn') && !watch('mtnNumber')) {
        return;
      }
      if (pm.includes('paypal') && !watch('paypalEmail')) {
        return;
      }
      if (pm.includes('bank') && (!watch('bankName') || !watch('bankAccountNumber') || !watch('bankAccountName'))) {
        return;
      }
    }

    setDirection(1);
    setStep((s) => Math.min(s + 1, 4));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const onSubmit = () => {
    // Simulate submission
    login({
      id: crypto.randomUUID(),
      name: watch('fullName'),
      email: watch('email') || watch('phone'),
      role: 'farmer',
    });
    setSubmitted(true);
  };

  /* --- stepper --- */
  const steps = [
    { label: t('farmerRegister.step1Label'), icon: User },
    { label: t('farmerRegister.step2Label'), icon: Tractor },
    { label: t('farmerRegister.step3Label'), icon: CreditCard },
    { label: t('farmerRegister.step4Label'), icon: Check },
  ];

  /* ================================================================== */
  /*  RENDER                                                              */
  /* ================================================================== */

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* ---- Header ---- */}
      <div className="pt-8 pb-6 md:pt-12 md:pb-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] }}
          className="text-3xl md:text-[40px] font-poppins font-bold text-charcoal leading-tight"
        >
          {t('farmerRegister.pageTitle')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] }}
          className="mt-3 text-base md:text-lg text-stone max-w-xl mx-auto"
        >
          {t('farmerRegister.pageSubtitle')}
        </motion.p>
      </div>

      {/* ---- Stepper ---- */}
      <div className="bg-white border-b border-fog sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-[800px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => {
              const StepIcon = s.icon;
              const isActive = step === i + 1;
              const isCompleted = step > i + 1 || submitted;
              return (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors duration-300',
                        isActive && 'bg-leaf border-leaf text-white',
                        isCompleted && 'bg-leaf border-leaf text-white',
                        !isActive && !isCompleted && 'border-fog text-stone bg-white'
                      )}
                    >
                      {isCompleted && !isActive ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-4 h-4" />
                      )}
                    </motion.div>
                    <span
                      className={cn(
                        'mt-1.5 text-[11px] font-medium hidden sm:block',
                        isActive ? 'text-leaf' : 'text-stone'
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn(
                      'h-0.5 flex-1 mx-2 md:mx-4 transition-colors duration-300',
                      step > i + 1 ? 'bg-leaf' : 'bg-fog'
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---- Content ---- */}
      <div className="max-w-[600px] mx-auto px-4 py-8 md:py-12">
        {submitted ? (
          <SuccessView t={t} />
        ) : (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] }}
              className="bg-white rounded-2xl border border-fog p-6 md:p-8 shadow-sm"
            >
              {step === 1 && (
                <Step1Personal
                  t={t}
                  register={register}
                  control={control}
                  errors={errors}
                  passwordValue={passwordValue}
                  showPw={showPw}
                  setShowPw={setShowPw}
                  showConfirmPw={showConfirmPw}
                  setShowConfirmPw={setShowConfirmPw}
                  onNext={goNext}
                />
              )}
              {step === 2 && (
                <Step2Farm
                  t={t}
                  register={register}
                  control={control}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  districts={districts}
                  regions={regions}
                  selectedCountry={selectedCountry}
                  produceTypes={produceTypes}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}
              {step === 3 && (
                <Step3Payment
                  t={t}
                  register={register}
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  selectedPaymentMethods={selectedPaymentMethods}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}
              {step === 4 && (
                <Step4Review
                  t={t}
                  watch={watch}
                  onSubmit={handleSubmit(onSubmit)}
                  onBack={goBack}
                  onEditStep={(s) => { setDirection(-1); setStep(s); }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  STEP 1: PERSONAL INFO                                               */
/* ================================================================== */

function Step1Personal({
  t, register, control, errors, passwordValue, showPw, setShowPw, showConfirmPw, setShowConfirmPw, onNext,
}: {
  t: (k: string) => string;
  register: any;
  control: any;
  errors: any;
  passwordValue: string;
  showPw: boolean;
  setShowPw: (v: boolean) => void;
  showConfirmPw: boolean;
  setShowConfirmPw: (v: boolean) => void;
  onNext: () => void;
}) {
  const pwStrength = getPasswordStrength(passwordValue);
  const pwLabel = strengthLabel(pwStrength);

  return (
    <div>
      <h3 className="text-xl md:text-[22px] font-poppins font-semibold text-charcoal mb-1">
        {t('farmerRegister.step1Title')}
      </h3>
      <p className="text-sm text-stone mb-6">{t('farmerRegister.step1Desc')}</p>

      <div className="space-y-4">
        {/* Full Name */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <Label htmlFor="fullName" className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-leaf" />
            {t('farmerRegister.fullName')} *
          </Label>
          <Input
            id="fullName"
            placeholder={t('farmerRegister.fullNamePlaceholder')}
            className="mt-1.5 rounded-xl border-fog focus:border-leaf focus:ring-leaf/20"
            {...register('fullName')}
          />
          {errors.fullName && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName.message}</p>}
        </motion.div>

        {/* Phone */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <Label htmlFor="phone" className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-leaf" />
            {t('farmerRegister.phone')} *
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t('farmerRegister.phonePlaceholder')}
            className="mt-1.5 rounded-xl border-fog focus:border-leaf focus:ring-leaf/20"
            {...register('phone')}
          />
          {errors.phone && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone.message}</p>}
          <p className="text-[11px] text-info mt-1">{t('farmerRegister.phoneNote')}</p>
        </motion.div>

        {/* Email */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <Label htmlFor="email" className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-leaf" />
            {t('farmerRegister.email')}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t('farmerRegister.emailPlaceholder')}
            className="mt-1.5 rounded-xl border-fog focus:border-leaf focus:ring-leaf/20"
            {...register('email')}
          />
          {errors.email && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email.message}</p>}
        </motion.div>

        {/* Country */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
          <Label htmlFor="country" className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-leaf" />
            {t('farmerRegister.country')} *
          </Label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <select
                id="country"
                className="mt-1.5 w-full rounded-xl border border-fog bg-white px-4 py-3 text-sm focus:border-leaf focus:ring-2 focus:ring-leaf/20 focus:outline-none transition-colors"
                {...field}
              >
                <option value="">{t('farmerRegister.selectCountry')}</option>
                {supportedCountries.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            )}
          />
          {errors.country && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.country.message}</p>}
        </motion.div>

        {/* Language */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
          <Label htmlFor="language" className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-leaf" />
            {t('farmerRegister.language')} *
          </Label>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <select
                id="language"
                className="mt-1.5 w-full rounded-xl border border-fog bg-white px-4 py-3 text-sm focus:border-leaf focus:ring-2 focus:ring-leaf/20 focus:outline-none transition-colors"
                {...field}
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            )}
          />
          <p className="text-[11px] text-info mt-1">{t('farmerRegister.languageNote')}</p>
        </motion.div>

        {/* Password */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <Label htmlFor="password" className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-leaf" />
            {t('farmerRegister.password')} *
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPw ? 'text' : 'password'}
              placeholder={t('farmerRegister.passwordPlaceholder')}
              className="rounded-xl border-fog focus:border-leaf focus:ring-leaf/20 pr-10"
              {...register('password')}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-charcoal">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Strength */}
          {passwordValue && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-1 flex-1">
                {[1,2,3,4].map((i) => (
                  <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors', i <= pwStrength ? pwLabel.color : 'bg-fog')} />
                ))}
              </div>
              <span className="text-[11px] text-stone">{pwLabel.text}</span>
            </div>
          )}
        </motion.div>

        {/* Confirm Password */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <Label htmlFor="confirmPassword" className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-leaf" />
            {t('farmerRegister.confirmPassword')} *
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="confirmPassword"
              type={showConfirmPw ? 'text' : 'password'}
              placeholder={t('farmerRegister.confirmPasswordPlaceholder')}
              className="rounded-xl border-fog focus:border-leaf focus:ring-leaf/20 pr-10"
              {...register('confirmPassword')}
            />
            <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-charcoal">
              {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirmPassword.message}</p>}
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-end">
        <Button onClick={onNext} className="bg-leaf hover:bg-forest text-white font-poppins font-semibold rounded-xl px-6 py-5 text-sm">
          {t('farmerRegister.nextFarm')} <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  STEP 2: FARM DETAILS                                                */
/* ================================================================== */

function Step2Farm({
  t, register, control, errors, watch, setValue, districts, regions, selectedCountry, produceTypes, onNext, onBack,
}: {
  t: (k: string) => string;
  register: any;
  control: any;
  errors: any;
  watch: any;
  setValue: any;
  districts: string[];
  regions: string[];
  selectedCountry: string;
  produceTypes: string[];
  onNext: () => void;
  onBack: () => void;
}) {
  const farmAbout = watch('farmAbout') || '';
  const selectedRegion = watch('region') || '';

  const regionDistricts = useMemo(() => {
    if (!selectedCountry || !selectedRegion) return districts;
    const country = countriesData[selectedCountry];
    const region = country?.regions.find((r) => r.name === selectedRegion);
    return region?.districts || districts;
  }, [selectedCountry, selectedRegion, districts]);

  const toggleProduce = (id: string) => {
    const current = produceTypes;
    const updated = current.includes(id) ? current.filter((p: string) => p !== id) : [...current, id];
    setValue('produceTypes', updated, { shouldValidate: true });
  };

  return (
    <div>
      <h3 className="text-xl md:text-[22px] font-poppins font-semibold text-charcoal mb-1">
        {t('farmerRegister.step2Title')}
      </h3>
      <p className="text-sm text-stone mb-6">{t('farmerRegister.step2Desc')}</p>

      <div className="space-y-4">
        {/* Farm Name */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <Label htmlFor="farmName" className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
            <Tractor className="w-3.5 h-3.5 text-leaf" />
            {t('farmerRegister.farmName')} *
          </Label>
          <Input
            id="farmName"
            placeholder={t('farmerRegister.farmNamePlaceholder')}
            className="mt-1.5 rounded-xl border-fog focus:border-leaf focus:ring-leaf/20"
            {...register('farmName')}
          />
          {errors.farmName && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.farmName.message}</p>}
        </motion.div>

        {/* Farm About */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <Label htmlFor="farmAbout" className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-leaf" />
            {t('farmerRegister.farmAbout')} *
          </Label>
          <textarea
            id="farmAbout"
            rows={4}
            placeholder={t('farmerRegister.farmAboutPlaceholder')}
            className="mt-1.5 w-full rounded-xl border border-fog bg-white px-4 py-3 text-sm focus:border-leaf focus:ring-2 focus:ring-leaf/20 focus:outline-none transition-colors resize-none"
            {...register('farmAbout')}
          />
          <div className="flex justify-between mt-1">
            {errors.farmAbout && <p className="text-error text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.farmAbout.message}</p>}
            <span className="text-[11px] text-stone ml-auto">{farmAbout.length} / 500</span>
          </div>
        </motion.div>

        {/* Region */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <Label htmlFor="region" className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-leaf" />
            {t('farmerRegister.region')} *
          </Label>
          <Controller
            name="region"
            control={control}
            render={({ field }) => (
              <select
                id="region"
                className="mt-1.5 w-full rounded-xl border border-fog bg-white px-4 py-3 text-sm focus:border-leaf focus:ring-2 focus:ring-leaf/20 focus:outline-none transition-colors"
                {...field}
              >
                <option value="">{t('farmerRegister.selectRegion')}</option>
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            )}
          />
          {errors.region && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.region.message}</p>}
        </motion.div>

        {/* District */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
          <Label htmlFor="district" className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-leaf" />
            {t('farmerRegister.district')} *
          </Label>
          <Controller
            name="district"
            control={control}
            render={({ field }) => (
              <select
                id="district"
                className="mt-1.5 w-full rounded-xl border border-fog bg-white px-4 py-3 text-sm focus:border-leaf focus:ring-2 focus:ring-leaf/20 focus:outline-none transition-colors"
                {...field}
              >
                <option value="">{t('farmerRegister.selectDistrict')}</option>
                {regionDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            )}
          />
          {errors.district && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.district.message}</p>}
        </motion.div>

        {/* Village */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
          <Label htmlFor="village" className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-leaf" />
            {t('farmerRegister.village')} *
          </Label>
          <Input
            id="village"
            placeholder={t('farmerRegister.villagePlaceholder')}
            className="mt-1.5 rounded-xl border-fog focus:border-leaf focus:ring-leaf/20"
            {...register('village')}
          />
          {errors.village && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.village.message}</p>}
        </motion.div>

        {/* Farm Size */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <Label className="text-sm font-semibold text-charcoal">{t('farmerRegister.farmSize')}</Label>
          <div className="flex gap-2 mt-1.5">
            <Input
              type="number"
              placeholder="5"
              className="rounded-xl border-fog focus:border-leaf focus:ring-leaf/20 flex-1"
              {...register('farmSize')}
            />
            <Controller
              name="farmSizeUnit"
              control={control}
              render={({ field }) => (
                <select className="rounded-xl border border-fog bg-white px-3 py-3 text-sm focus:border-leaf focus:outline-none" {...field}>
                  <option value="acres">acres</option>
                  <option value="hectares">hectares</option>
                </select>
              )}
            />
          </div>
        </motion.div>

        {/* Produce Types */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <Label className="text-sm font-semibold text-charcoal mb-2 block">
            {t('farmerRegister.produceTypes')} *
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {produceOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleProduce(opt.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all duration-200 text-left',
                  produceTypes.includes(opt.id)
                    ? 'border-leaf bg-mint/15 text-forest'
                    : 'border-fog bg-white text-charcoal hover:bg-cloud'
                )}
              >
                <div className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center transition-all',
                  produceTypes.includes(opt.id) ? 'bg-leaf border-leaf' : 'border-stone'
                )}>
                  {produceTypes.includes(opt.id) && <Check className="w-3 h-3 text-white" />}
                </div>
                {opt.label}
              </button>
            ))}
          </div>
          {errors.produceTypes && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.produceTypes.message}</p>}
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={onBack} className="text-charcoal hover:bg-cloud font-poppins font-semibold rounded-xl px-6 py-5 text-sm">
          <ChevronLeft className="w-4 h-4 mr-1" /> {t('farmerRegister.back')}
        </Button>
        <Button onClick={onNext} className="bg-leaf hover:bg-forest text-white font-poppins font-semibold rounded-xl px-6 py-5 text-sm">
          {t('farmerRegister.nextPayment')} <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  STEP 3: PAYMENT SETUP                                               */
/* ================================================================== */

const paymentCards: { id: PaymentMethod; icon: React.ElementType; title: string; desc: string; note?: string }[] = [
  { id: 'airtel', icon: Phone, title: 'Airtel Money', desc: 'Receive payments via Airtel Money across East Africa' },
  { id: 'mtn', icon: Smartphone, title: 'MTN Mobile Money', desc: 'Receive payments via MTN Mobile Money' },
  { id: 'paypal', icon: Globe, title: 'PayPal', desc: 'Receive international payments via PayPal', note: 'Handle: @LutwamaReagan will process your PayPal payments' },
  { id: 'bank', icon: Landmark, title: 'Bank Transfer', desc: 'Receive payments via direct bank transfer' },
];

function Step3Payment({
  t, register, control, errors, setValue, selectedPaymentMethods, onNext, onBack,
}: {
  t: (k: string) => string;
  register: any;
  control: any;
  errors: any;
  setValue: any;
  selectedPaymentMethods: PaymentMethod[];
  onNext: () => void;
  onBack: () => void;
}) {
  const togglePayment = (id: PaymentMethod) => {
    const current = selectedPaymentMethods;
    const updated = current.includes(id) ? current.filter((p: string) => p !== id) : [...current, id];
    setValue('paymentMethods', updated, { shouldValidate: true });
  };

  return (
    <div>
      <h3 className="text-xl md:text-[22px] font-poppins font-semibold text-charcoal mb-1">
        {t('farmerRegister.step3Title')}
      </h3>
      <p className="text-sm text-stone mb-4">{t('farmerRegister.step3Desc')}</p>

      <div className="bg-info/10 rounded-xl p-3 mb-6 text-xs text-info">
        {t('farmerRegister.paymentInfoNote')}
      </div>

      <div className="space-y-3">
        {paymentCards.map((card, idx) => {
          const Icon = card.icon;
          const isSelected = selectedPaymentMethods.includes(card.id);
          return (
            <motion.div
              key={card.id}
              custom={idx}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className={cn(
                'border rounded-xl transition-all duration-200 overflow-hidden',
                isSelected ? 'border-leaf bg-mint/10' : 'border-fog bg-white hover:border-leaf/40'
              )}
            >
              <button
                type="button"
                onClick={() => togglePayment(card.id)}
                className="w-full flex items-start gap-3 p-4 text-left"
              >
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                  isSelected ? 'border-leaf bg-leaf' : 'border-fog'
                )}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-leaf" />
                    <span className="font-poppins font-semibold text-charcoal">{card.title}</span>
                  </div>
                  <p className="text-xs text-stone mt-0.5">{card.desc}</p>
                  {card.note && <p className="text-[11px] text-info mt-0.5">{card.note}</p>}
                </div>
              </button>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0">
                      {card.id === 'airtel' && (
                        <div>
                          <Label className="text-xs font-semibold">{t('farmerRegister.airtelNumber')} *</Label>
                          <Input placeholder="+256 7XX XXX XXX" className="mt-1 rounded-xl border-fog focus:border-leaf" {...register('airtelNumber')} />
                        </div>
                      )}
                      {card.id === 'mtn' && (
                        <div>
                          <Label className="text-xs font-semibold">{t('farmerRegister.mtnNumber')} *</Label>
                          <Input placeholder="+256 7XX XXX XXX" className="mt-1 rounded-xl border-fog focus:border-leaf" {...register('mtnNumber')} />
                        </div>
                      )}
                      {card.id === 'paypal' && (
                        <div>
                          <Label className="text-xs font-semibold">{t('farmerRegister.paypalEmail')} *</Label>
                          <Input placeholder="your@email.com" className="mt-1 rounded-xl border-fog focus:border-leaf" {...register('paypalEmail')} />
                        </div>
                      )}
                      {card.id === 'bank' && (
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs font-semibold">{t('farmerRegister.bankName')} *</Label>
                            <Input placeholder="e.g., Equity Bank" className="mt-1 rounded-xl border-fog focus:border-leaf" {...register('bankName')} />
                          </div>
                          <div>
                            <Label className="text-xs font-semibold">{t('farmerRegister.bankAccountNumber')} *</Label>
                            <Input placeholder="Account Number" className="mt-1 rounded-xl border-fog focus:border-leaf" {...register('bankAccountNumber')} />
                          </div>
                          <div>
                            <Label className="text-xs font-semibold">{t('farmerRegister.bankAccountName')} *</Label>
                            <Input placeholder="Account Holder Name" className="mt-1 rounded-xl border-fog focus:border-leaf" {...register('bankAccountName')} />
                          </div>
                          <div>
                            <Label className="text-xs font-semibold">{t('farmerRegister.bankBranch')}</Label>
                            <Input placeholder="Branch (optional)" className="mt-1 rounded-xl border-fog focus:border-leaf" {...register('bankBranch')} />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {errors.paymentMethods && <p className="text-error text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.paymentMethods.message}</p>}

      {/* Terms */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 flex items-start gap-2">
        <Controller
          name="termsAccepted"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="terms"
              checked={field.value}
              onCheckedChange={field.onChange}
              className="mt-0.5 data-[state=checked]:bg-leaf data-[state=checked]:border-leaf"
            />
          )}
        />
        <Label htmlFor="terms" className="text-sm text-charcoal leading-snug cursor-pointer">
          {t('farmerRegister.termsPrefix')}{' '}
          <Link to="/" className="text-leaf hover:underline">{t('footer.terms')}</Link>{' '}
          {t('farmerRegister.termsAnd')}{' '}
          <Link to="/" className="text-leaf hover:underline">{t('footer.privacy')}</Link> *
        </Label>
      </motion.div>
      {errors.termsAccepted && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.termsAccepted.message}</p>}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={onBack} className="text-charcoal hover:bg-cloud font-poppins font-semibold rounded-xl px-6 py-5 text-sm">
          <ChevronLeft className="w-4 h-4 mr-1" /> {t('farmerRegister.back')}
        </Button>
        <Button onClick={onNext} className="bg-leaf hover:bg-forest text-white font-poppins font-semibold rounded-xl px-6 py-5 text-sm">
          {t('farmerRegister.nextReview')} <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  STEP 4: REVIEW & SUBMIT                                             */
/* ================================================================== */

function Step4Review({
  t, watch, onSubmit, onBack, onEditStep,
}: {
  t: (k: string) => string;
  watch: any;
  onSubmit: () => void;
  onBack: () => void;
  onEditStep: (s: number) => void;
}) {
  const country = supportedCountries.find((c) => c.code === watch('country'));
  const lang = languages.find((l) => l.code === watch('language'));
  const paymentMethods = (watch('paymentMethods') || []) as PaymentMethod[];

  const sections = [
    {
      title: t('farmerRegister.reviewPersonal'),
      step: 1,
      fields: [
        { label: t('farmerRegister.fullName'), value: watch('fullName') },
        { label: t('farmerRegister.phone'), value: watch('phone') },
        { label: t('farmerRegister.email'), value: watch('email') || '—' },
        { label: t('farmerRegister.country'), value: country?.name },
        { label: t('farmerRegister.language'), value: lang?.name },
      ],
    },
    {
      title: t('farmerRegister.reviewFarm'),
      step: 2,
      fields: [
        { label: t('farmerRegister.farmName'), value: watch('farmName') },
        { label: t('farmerRegister.farmAbout'), value: watch('farmAbout') },
        { label: t('farmerRegister.region'), value: watch('region') },
        { label: t('farmerRegister.district'), value: watch('district') },
        { label: t('farmerRegister.village'), value: watch('village') },
        { label: t('farmerRegister.farmSize'), value: watch('farmSize') ? `${watch('farmSize')} ${watch('farmSizeUnit')}` : '—' },
        { label: t('farmerRegister.produceTypes'), value: (watch('produceTypes') || []).join(', ') },
      ],
    },
    {
      title: t('farmerRegister.reviewPayment'),
      step: 3,
      fields: [
        ...paymentMethods.map((pm: PaymentMethod) => {
          if (pm === 'airtel') return { label: 'Airtel Money', value: watch('airtelNumber') };
          if (pm === 'mtn') return { label: 'MTN Mobile Money', value: watch('mtnNumber') };
          if (pm === 'paypal') return { label: 'PayPal', value: watch('paypalEmail') };
          if (pm === 'bank') return { label: 'Bank Transfer', value: `${watch('bankName')} - ${watch('bankAccountName')} (${watch('bankAccountNumber')})` };
          return { label: pm, value: '' };
        }),
      ],
    },
  ];

  return (
    <div>
      <h3 className="text-xl md:text-[22px] font-poppins font-semibold text-charcoal mb-1">
        {t('farmerRegister.step4Title')}
      </h3>
      <p className="text-sm text-stone mb-6">{t('farmerRegister.step4Desc')}</p>

      <div className="space-y-4">
        {sections.map((section, sIdx) => (
          <motion.div
            key={sIdx}
            custom={sIdx}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl border border-fog p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-poppins font-semibold text-charcoal">{section.title}</h4>
              <button
                type="button"
                onClick={() => onEditStep(section.step)}
                className="text-xs text-leaf hover:underline font-medium"
              >
                {t('common.edit')}
              </button>
            </div>
            <div className="space-y-2">
              {section.fields.map((field, fIdx) => (
                <div key={fIdx} className="flex flex-col sm:flex-row sm:justify-between sm:gap-4 text-sm">
                  <span className="text-stone">{field.label}</span>
                  <span className="text-charcoal font-medium text-right">{field.value || '—'}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submit */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-6"
      >
        <Button
          onClick={onSubmit}
          className="w-full bg-leaf hover:bg-forest text-white font-poppins font-semibold rounded-xl h-14 text-base"
        >
          {t('farmerRegister.submit')}
        </Button>
        <p className="text-center text-xs text-stone mt-3">
          {t('farmerRegister.submitNote')}
        </p>
      </motion.div>

      <div className="mt-4 flex justify-start">
        <Button variant="ghost" onClick={onBack} className="text-charcoal hover:bg-cloud font-poppins font-semibold rounded-xl px-6 py-5 text-sm">
          <ChevronLeft className="w-4 h-4 mr-1" /> {t('farmerRegister.back')}
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  SUCCESS VIEW                                                        */
/* ================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */
function SuccessView({ t }: { t: (k: string) => string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] }}
      className="bg-white rounded-2xl border border-fog p-8 md:p-12 shadow-sm text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.1, 1] }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] }}
        className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6"
      >
        <Check className="w-10 h-10 text-success" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-2xl md:text-[32px] font-poppins font-bold text-charcoal mb-3"
      >
        {t('farmerRegister.successTitle')}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-sm text-stone max-w-md mx-auto mb-6"
      >
        {t('farmerRegister.successMessage')}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-8"
      >
        <span className="font-space-grotesk text-[40px] font-bold text-sun">*252#</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Link
          to="/ussd"
          className="inline-flex items-center justify-center bg-leaf hover:bg-forest text-white font-poppins font-semibold rounded-xl px-7 py-3.5 text-sm transition-all hover:scale-[1.02]"
        >
          {t('farmerRegister.successCtaUssd')}
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center text-forest font-poppins font-semibold rounded-xl px-7 py-3.5 text-sm border-2 border-forest hover:bg-forest hover:text-white transition-all"
        >
          {t('farmerRegister.successCtaHome')}
        </Link>
      </motion.div>
    </motion.div>
  );
}
