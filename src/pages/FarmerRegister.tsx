import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, User, MapPin, CreditCard, ClipboardCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ProfilePhotoUpload from '@/components/ProfilePhotoUpload';
import { countries } from '@/data/countries';
import { useTranslation } from 'react-i18next';

/* ─── validation schemas ─── */
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
  farmName: z.string().min(2, 'Farm name is required'),
  farmAbout: z.string().min(10, 'Please tell us more about your farm'),
  region: z.string().min(1, 'Region is required'),
  district: z.string().min(1, 'District is required'),
  village: z.string().min(1, 'Village or area is required'),
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
}).superRefine((data, ctx) => {
  if (data.paymentMethods.includes('airtel') && !data.airtelNumber) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Airtel Money number is required', path: ['airtelNumber'] });
  }
  if (data.paymentMethods.includes('mtn') && !data.mtnNumber) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'MTN Mobile Money number is required', path: ['mtnNumber'] });
  }
  if (data.paymentMethods.includes('paypal') && !data.paypalEmail) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'PayPal email is required', path: ['paypalEmail'] });
  }
  if (data.paymentMethods.includes('bank')) {
    if (!data.bankName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Bank name is required', path: ['bankName'] });
    if (!data.bankAccountNumber) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Account number is required', path: ['bankAccountNumber'] });
    if (!data.bankAccountName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Account holder name is required', path: ['bankAccountName'] });
  }
});

/* ─── step fields for partial validation ─── */
const step1Fields = ['fullName', 'phone', 'email', 'country', 'language', 'password', 'confirmPassword'] as const;
const step2Fields = ['farmName', 'farmAbout', 'region', 'district', 'village', 'produceTypes'] as const;
const step3Fields = ['paymentMethods', 'termsAccepted'] as const;

const allSteps = [step1Fields, step2Fields, step3Fields];

type FormData = z.infer<typeof step1Schema> & z.infer<typeof step2Schema> & z.infer<typeof step3Schema> & {
  profilePhoto?: string;
};

/* ─── produce options ─── */
const PRODUCE_OPTIONS = [
  'Vegetables', 'Fruits', 'Grains', 'Livestock', 'Dairy', 'Spices', 'Nuts & Seeds', 'Root Crops', 'Poultry', 'Fish'
];

/* ─── languages ─── */
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'lg', label: 'Luganda' },
  { code: 'rw', label: 'Runyarwanda' },
];

/* ─── step config ─── */
const STEPS = [
  { label: 'Personal Info', icon: User },
  { label: 'Farm Details', icon: MapPin },
  { label: 'Payment', icon: CreditCard },
  { label: 'Review', icon: ClipboardCheck },
];

export default function FarmerRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      country: 'Uganda',
      language: 'en',
      password: '',
      confirmPassword: '',
      profilePhoto: '',
      farmName: '',
      farmAbout: '',
      region: '',
      district: '',
      village: '',
      produceTypes: [],
      paymentMethods: [],
      airtelNumber: '',
      mtnNumber: '',
      paypalEmail: '',
      bankName: '',
      bankAccountNumber: '',
      bankAccountName: '',
      bankBranch: '',
      termsAccepted: false,
    },
    resolver: (step === 1 ? zodResolver(step1Schema)
      : step === 2 ? zodResolver(step2Schema)
      : step === 3 ? zodResolver(step3Schema)
      : undefined) as any,
    mode: 'onChange',
  });

  const country = watch('country');
  const paymentMethods = watch('paymentMethods') || [];

  /* Update resolver when step changes */
  useEffect(() => {
    // Resolver updates automatically via the step variable in useForm config
    // But we need to trigger re-validation when step changes
    if (step <= 3) {
      trigger(allSteps[step - 1] as any);
    }
  }, [step, trigger]);

  const goNext = async () => {
    const fields = allSteps[step - 1];
    const ok = await trigger(fields as any);
    if (!ok) return;

    /* extra validation for step 3 payment details — now with VISIBLE errors */
    if (step === 3) {
      const pm = watch('paymentMethods');
      let hasError = false;

      if (pm.includes('airtel') && !watch('airtelNumber')) {
        setError('airtelNumber', { type: 'required', message: 'Airtel Money number is required when Airtel is selected' });
        hasError = true;
      } else {
        clearErrors('airtelNumber');
      }

      if (pm.includes('mtn') && !watch('mtnNumber')) {
        setError('mtnNumber', { type: 'required', message: 'MTN Mobile Money number is required when MTN is selected' });
        hasError = true;
      } else {
        clearErrors('mtnNumber');
      }

      if (pm.includes('paypal') && !watch('paypalEmail')) {
        setError('paypalEmail', { type: 'required', message: 'PayPal email is required when PayPal is selected' });
        hasError = true;
      } else {
        clearErrors('paypalEmail');
      }

      if (pm.includes('bank')) {
        if (!watch('bankName')) {
          setError('bankName', { type: 'required', message: 'Bank name is required when Bank Transfer is selected' });
          hasError = true;
        } else {
          clearErrors('bankName');
        }
        if (!watch('bankAccountNumber')) {
          setError('bankAccountNumber', { type: 'required', message: 'Account number is required when Bank Transfer is selected' });
          hasError = true;
        } else {
          clearErrors('bankAccountNumber');
        }
        if (!watch('bankAccountName')) {
          setError('bankAccountName', { type: 'required', message: 'Account holder name is required when Bank Transfer is selected' });
          hasError = true;
        } else {
          clearErrors('bankAccountName');
        }
      }

      if (hasError) return;
    }

    setDirection(1);
    setStep((s) => Math.min(s + 1, 4));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const onSubmit = () => {
    setSubmitError(null);
    
    const farmerData = {
      id: crypto.randomUUID(),
      fullName: watch('fullName'),
      phone: watch('phone'),
      email: watch('email') || undefined,
      country: watch('country'),
      language: watch('language'),
      password: watch('password'),
      profilePhoto: watch('profilePhoto') || undefined,
      farmName: watch('farmName'),
      farmAbout: watch('farmAbout'),
      region: watch('region'),
      district: watch('district'),
      village: watch('village'),
      produceTypes: watch('produceTypes'),
      paymentMethods: watch('paymentMethods'),
      airtelNumber: watch('airtelNumber') || undefined,
      mtnNumber: watch('mtnNumber') || undefined,
      paypalEmail: watch('paypalEmail') || undefined,
      bankName: watch('bankName') || undefined,
      bankAccountNumber: watch('bankAccountNumber') || undefined,
      bankAccountName: watch('bankAccountName') || undefined,
      bankBranch: watch('bankBranch') || undefined,
      status: 'pending',
      joined: new Date().toISOString().split('T')[0],
    };

    try {
      const existing = JSON.parse(localStorage.getItem('shambani_farmers') || '[]');
      const updated = [...existing, farmerData];
      localStorage.setItem('shambani_farmers', JSON.stringify(updated));
      login(farmerData as any);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Failed to save registration:', err);
      if (err.name === 'QuotaExceededError' || err.code === 22) {
        setSubmitError('Your profile photo is too large to save. Please go back to Step 1 and upload a smaller photo (under 2MB), then try again.');
      } else {
        setSubmitError('Failed to save your registration. Please try again or contact support.');
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1E293B] border border-[#334155] rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{t('farmerRegister.successTitle')}</h2>
          <p className="text-sm text-[#94A3B8] mb-6">{t('farmerRegister.successMessage')}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/ussd')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {t('farmerRegister.successCtaUssd')}
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-[#334155] hover:border-[#475569] text-[#E2E8F0] rounded-lg text-sm transition-colors"
            >
              {t('farmerRegister.successCtaHome')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{t('farmerRegister.pageTitle')}</h1>
          <p className="text-sm text-[#94A3B8]">{t('farmerRegister.pageSubtitle')}</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === i + 1;
            const isCompleted = step > i + 1;
            return (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-emerald-500 text-white'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-[#334155] text-[#64748B]'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-1 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-[#334155]'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Labels */}
        <div className="flex justify-center gap-8 mb-8 text-xs text-[#64748B]">
          {STEPS.map((s, i) => (
            <span key={i} className={step === i + 1 ? 'text-emerald-400 font-medium' : ''}>
              {s.label}
            </span>
          ))}
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            {submitError}
          </div>
        )}

        {/* Form Steps */}
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <Step1Personal
              key="step1"
              register={register}
              control={control}
              errors={errors}
              watch={watch}
              setValue={setValue}
              onNext={goNext}
              t={t}
            />
          )}
          {step === 2 && (
            <Step2Farm
              key="step2"
              register={register}
              control={control}
              errors={errors}
              watch={watch}
              setValue={setValue}
              onBack={goBack}
              onNext={goNext}
              t={t}
            />
          )}
          {step === 3 && (
            <Step3Payment
              key="step3"
              register={register}
              control={control}
              watch={watch}
              setValue={setValue}
              errors={errors}
              onBack={goBack}
              onNext={goNext}
              t={t}
            />
          )}
          {step === 4 && (
            <Step4Review
              key="step4"
              t={t}
              watch={watch}
              onSubmit={handleSubmit(onSubmit)}
              onBack={goBack}
              onEditStep={(s) => { setDirection(-1); setStep(s); }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Step 1: Personal Information ─── */
function Step1Personal({ register, errors, watch, setValue, onNext, t }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-white">{t('farmerRegister.step1Title')}</h2>
        <p className="text-sm text-[#94A3B8]">{t('farmerRegister.step1Desc')}</p>
      </div>

      {/* Profile Photo */}
      <ProfilePhotoUpload
        value={watch('profilePhoto')}
        onChange={(photo) => setValue('profilePhoto', photo, { shouldValidate: false })}
      />

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
          {t('farmerRegister.fullName')} <span className="text-red-400">*</span>
        </label>
        <input
          {...register('fullName')}
          className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
          placeholder={t('farmerRegister.fullNamePlaceholder')}
        />
        {errors.fullName && (
          <span className="text-xs text-red-400 mt-1 block">{errors.fullName.message as string}</span>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
          {t('farmerRegister.phone')} <span className="text-red-400">*</span>
        </label>
        <input
          {...register('phone')}
          className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
          placeholder={t('farmerRegister.phonePlaceholder')}
        />
        {errors.phone && (
          <span className="text-xs text-red-400 mt-1 block">{errors.phone.message as string}</span>
        )}
        <p className="text-xs text-[#64748B] mt-1">{t('farmerRegister.phoneNote')}</p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#E2E8F0] mb-2">{t('farmerRegister.email')}</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
          placeholder={t('farmerRegister.emailPlaceholder')}
        />
        {errors.email && (
          <span className="text-xs text-red-400 mt-1 block">{errors.email.message as string}</span>
        )}
      </div>

      {/* Country & Language */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
            {t('farmerRegister.country')} <span className="text-red-400">*</span>
          </label>
          <select
            {...register('country')}
            className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
          >
            <option value="">{t('farmerRegister.selectCountry')}</option>
            {countries.map((c) => (
              <option key={c.code} value={c.name}>{c.name}</option>
            ))}
          </select>
          {errors.country && (
            <span className="text-xs text-red-400 mt-1 block">{errors.country.message as string}</span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
            {t('farmerRegister.language')} <span className="text-red-400">*</span>
          </label>
          <select
            {...register('language')}
            className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          {errors.language && (
            <span className="text-xs text-red-400 mt-1 block">{errors.language.message as string}</span>
          )}
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
          {t('farmerRegister.password')} <span className="text-red-400">*</span>
        </label>
        <input
          {...register('password')}
          type="password"
          className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
          placeholder={t('farmerRegister.passwordPlaceholder')}
        />
        {errors.password && (
          <span className="text-xs text-red-400 mt-1 block">{errors.password.message as string}</span>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
          {t('farmerRegister.confirmPassword')} <span className="text-red-400">*</span>
        </label>
        <input
          {...register('confirmPassword')}
          type="password"
          className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
          placeholder={t('farmerRegister.confirmPasswordPlaceholder')}
        />
        {errors.confirmPassword && (
          <span className="text-xs text-red-400 mt-1 block">{errors.confirmPassword.message as string}</span>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        {t('farmerRegister.nextFarm')}
        <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

/* ─── Step 2: Farm Details ─── */
function Step2Farm({ register, errors, watch, setValue, onBack, onNext, t }: any) {
  const country = watch('country');
  const districts = countries.find((c) => c.name === country)?.districts || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-white">{t('farmerRegister.step2Title')}</h2>
        <p className="text-sm text-[#94A3B8]">{t('farmerRegister.step2Desc')}</p>
      </div>

      {/* Farm Name */}
      <div>
        <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
          {t('farmerRegister.farmName')} <span className="text-red-400">*</span>
        </label>
        <input
          {...register('farmName')}
          className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
          placeholder={t('farmerRegister.farmNamePlaceholder')}
        />
        {errors.farmName && (
          <span className="text-xs text-red-400 mt-1 block">{errors.farmName.message as string}</span>
        )}
      </div>

      {/* Farm About */}
      <div>
        <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
          {t('farmerRegister.farmAbout')} <span className="text-red-400">*</span>
        </label>
        <textarea
          {...register('farmAbout')}
          rows={4}
          className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors resize-none"
          placeholder={t('farmerRegister.farmAboutPlaceholder')}
        />
        {errors.farmAbout && (
          <span className="text-xs text-red-400 mt-1 block">{errors.farmAbout.message as string}</span>
        )}
      </div>

      {/* Region & District */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
            {t('farmerRegister.region')} <span className="text-red-400">*</span>
          </label>
          <input
            {...register('region')}
            className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
            placeholder={t('farmerRegister.selectRegion')}
          />
          {errors.region && (
            <span className="text-xs text-red-400 mt-1 block">{errors.region.message as string}</span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
            {t('farmerRegister.district')} <span className="text-red-400">*</span>
          </label>
          <select
            {...register('district')}
            className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
          >
            <option value="">{t('farmerRegister.selectDistrict')}</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.district && (
            <span className="text-xs text-red-400 mt-1 block">{errors.district.message as string}</span>
          )}
        </div>
      </div>

      {/* Village */}
      <div>
        <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
          {t('farmerRegister.village')} <span className="text-red-400">*</span>
        </label>
        <input
          {...register('village')}
          className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
          placeholder={t('farmerRegister.villagePlaceholder')}
        />
        {errors.village && (
          <span className="text-xs text-red-400 mt-1 block">{errors.village.message as string}</span>
        )}
      </div>

      {/* Produce Types */}
      <div>
        <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
          {t('farmerRegister.produceTypes')} <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PRODUCE_OPTIONS.map((type) => {
            const selected = (watch('produceTypes') || []).includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  const current = watch('produceTypes') || [];
                  const updated = selected
                    ? current.filter((t: string) => t !== type)
                    : [...current, type];
                  setValue('produceTypes', updated, { shouldValidate: true });
                }}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                  selected
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'bg-[#0F172A] border-[#334155] text-[#94A3B8] hover:border-[#475569]'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
        {errors.produceTypes && (
          <span className="text-xs text-red-400 mt-1 block">{errors.produceTypes.message as string}</span>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-[#334155] hover:border-[#475569] text-[#E2E8F0] font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          {t('farmerRegister.back')}
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {t('farmerRegister.nextPayment')}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Step 3: Payment Setup ─── */
function Step3Payment({ register, watch, setValue, errors, onBack, onNext, t }: any) {
  const pm = watch('paymentMethods') || [];
  const togglePayment = (method: string) => {
    const current = watch('paymentMethods') || [];
    const updated = current.includes(method)
      ? current.filter((m: string) => m !== method)
      : [...current, method];
    setValue('paymentMethods', updated, { shouldValidate: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-white">{t('farmerRegister.step3Title')}</h2>
        <p className="text-sm text-[#94A3B8]">{t('farmerRegister.step3Desc')}</p>
      </div>

      <p className="text-xs text-[#64748B] bg-[#0F172A] p-3 rounded-lg">{t('farmerRegister.paymentInfoNote')}</p>

      {/* Payment Methods */}
      <div>
        <label className="block text-sm font-medium text-[#E2E8F0] mb-3">
          {t('farmerRegister.paymentMethod')} <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['airtel', 'mtn', 'paypal', 'bank'] as const).map((method) => {
            const selected = pm.includes(method);
            const labels: Record<string, string> = {
              airtel: 'Airtel Money',
              mtn: 'MTN Mobile Money',
              paypal: 'PayPal',
              bank: 'Bank Transfer',
            };
            return (
              <button
                key={method}
                type="button"
                onClick={() => togglePayment(method)}
                className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                  selected
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'bg-[#0F172A] border-[#334155] text-[#94A3B8] hover:border-[#475569]'
                }`}
              >
                {labels[method]}
              </button>
            );
          })}
        </div>
        {errors.paymentMethods && (
          <span className="text-xs text-red-400 mt-1 block">{errors.paymentMethods.message as string}</span>
        )}
      </div>

      {/* Airtel Number */}
      {pm.includes('airtel') && (
        <div>
          <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
            {t('farmerRegister.airtelNumber')} <span className="text-red-400">*</span>
          </label>
          <input
            {...register('airtelNumber')}
            className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
            placeholder="e.g., +256 7XX XXX XXX"
          />
          {errors.airtelNumber && (
            <span className="text-xs text-red-400 mt-1 block">{errors.airtelNumber.message as string}</span>
          )}
        </div>
      )}

      {/* MTN Number */}
      {pm.includes('mtn') && (
        <div>
          <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
            {t('farmerRegister.mtnNumber')} <span className="text-red-400">*</span>
          </label>
          <input
            {...register('mtnNumber')}
            className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
            placeholder="e.g., +256 7XX XXX XXX"
          />
          {errors.mtnNumber && (
            <span className="text-xs text-red-400 mt-1 block">{errors.mtnNumber.message as string}</span>
          )}
        </div>
      )}

      {/* PayPal Email */}
      {pm.includes('paypal') && (
        <div>
          <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
            {t('farmerRegister.paypalEmail')} <span className="text-red-400">*</span>
          </label>
          <input
            {...register('paypalEmail')}
            type="email"
            className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
            placeholder="e.g., your@email.com"
          />
          {errors.paypalEmail && (
            <span className="text-xs text-red-400 mt-1 block">{errors.paypalEmail.message as string}</span>
          )}
        </div>
      )}

      {/* Bank Details */}
      {pm.includes('bank') && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
              {t('farmerRegister.bankName')} <span className="text-red-400">*</span>
            </label>
            <input
              {...register('bankName')}
              className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
              placeholder="e.g., Stanbic Bank"
            />
            {errors.bankName && (
              <span className="text-xs text-red-400 mt-1 block">{errors.bankName.message as string}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
              {t('farmerRegister.bankAccountNumber')} <span className="text-red-400">*</span>
            </label>
            <input
              {...register('bankAccountNumber')}
              className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
              placeholder="e.g., 0123456789"
            />
            {errors.bankAccountNumber && (
              <span className="text-xs text-red-400 mt-1 block">{errors.bankAccountNumber.message as string}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
              {t('farmerRegister.bankAccountName')} <span className="text-red-400">*</span>
            </label>
            <input
              {...register('bankAccountName')}
              className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
              placeholder="e.g., Reagan Mitanda Lutwama"
            />
            {errors.bankAccountName && (
              <span className="text-xs text-red-400 mt-1 block">{errors.bankAccountName.message as string}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#E2E8F0] mb-2">{t('farmerRegister.bankBranch')}</label>
            <input
              {...register('bankBranch')}
              className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
              placeholder="e.g., Kampala Road Branch"
            />
          </div>
        </div>
      )}

      {/* Terms */}
      <div className="flex items-start gap-3">
        <input
          {...register('termsAccepted')}
          type="checkbox"
          id="terms"
          className="mt-1 w-4 h-4 rounded border-[#334155] bg-[#0F172A] text-emerald-500 focus:ring-emerald-500"
        />
        <label htmlFor="terms" className="text-sm text-[#94A3B8]">
          {t('farmerRegister.termsPrefix')} <a href="/terms" className="text-emerald-400 hover:underline">Terms</a> and <a href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</a>
        </label>
      </div>
      {errors.termsAccepted && (
        <span className="text-xs text-red-400 block">{errors.termsAccepted.message as string}</span>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-[#334155] hover:border-[#475569] text-[#E2E8F0] font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          {t('farmerRegister.back')}
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {t('farmerRegister.nextReview')}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Step 4: Review & Submit ─── */
function Step4Review({ t, watch, onSubmit, onBack, onEditStep }: any) {
  const sections = [
    { title: t('farmerRegister.reviewPersonal'), step: 1, fields: [
      { label: 'Name', value: watch('fullName') },
      { label: 'Phone', value: watch('phone') },
      { label: 'Email', value: watch('email') || '—' },
      { label: 'Country', value: watch('country') },
      { label: 'Language', value: LANGUAGES.find(l => l.code === watch('language'))?.label },
    ]},
    { title: t('farmerRegister.reviewFarm'), step: 2, fields: [
      { label: 'Farm Name', value: watch('farmName') },
      { label: 'About', value: watch('farmAbout') },
      { label: 'Region', value: watch('region') },
      { label: 'District', value: watch('district') },
      { label: 'Village', value: watch('village') },
      { label: 'Produce', value: (watch('produceTypes') || []).join(', ') },
    ]},
    { title: t('farmerRegister.reviewPayment'), step: 3, fields: [
      { label: 'Methods', value: (watch('paymentMethods') || []).join(', ') },
      ...(watch('airtelNumber') ? [{ label: 'Airtel', value: watch('airtelNumber') }] : []),
      ...(watch('mtnNumber') ? [{ label: 'MTN', value: watch('mtnNumber') }] : []),
      ...(watch('paypalEmail') ? [{ label: 'PayPal', value: watch('paypalEmail') }] : []),
      ...(watch('bankName') ? [{ label: 'Bank', value: `${watch('bankName')} - ${watch('bankAccountNumber')}` }] : []),
    ]},
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-white">{t('farmerRegister.step4Title')}</h2>
        <p className="text-sm text-[#94A3B8]">{t('farmerRegister.step4Desc')}</p>
      </div>

      {/* Profile Photo */}
      {watch('profilePhoto') && (
        <div className="flex justify-center">
          <img
            src={watch('profilePhoto')}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500"
          />
        </div>
      )}

      {/* Review Sections */}
      {sections.map((section) => (
        <div key={section.title} className="bg-[#0F172A] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#E2E8F0]">{section.title}</h3>
            <button
              onClick={() => onEditStep(section.step)}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2">
            {section.fields.map((field) => (
              <div key={field.label} className="flex justify-between text-sm">
                <span className="text-[#64748B]">{field.label}</span>
                <span className="text-[#E2E8F0] text-right max-w-[60%] truncate">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="text-xs text-[#64748B] text-center">{t('farmerRegister.submitNote')}</p>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-[#334155] hover:border-[#475569] text-[#E2E8F0] font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          {t('farmerRegister.back')}
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Check className="w-5 h-5" />
          {t('farmerRegister.submit')}
        </button>
      </div>
    </motion.div>
  );
}
