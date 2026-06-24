import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Percent, Globe, CreditCard, Bell, Database, Trash2, Download } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import type { PaymentMethod } from '@/store/useAdminStore';

export default function SettingsView() {
  const { t } = useTranslation();
  const settings = useAdminStore((s) => s.settings);
  const updateSettings = useAdminStore((s) => s.updateSettings);
  const [feeValue, setFeeValue] = useState(settings.platformFeePercent);
  const [paypalHandle, setPaypalHandle] = useState(settings.paypalHandle);
  const [defaultLang, setDefaultLang] = useState(settings.defaultLanguage);
  const [smsNotif, setSmsNotif] = useState(settings.smsNotifications);
  const [emailNotif, setEmailNotif] = useState(settings.emailNotifications);
  const [autoRelease, setAutoRelease] = useState(settings.autoReleasePayments);
  const [saved, setSaved] = useState(false);

  const togglePaymentMethod = (method: PaymentMethod) => {
    const current = settings.enabledPaymentMethods;
    if (current.includes(method)) {
      updateSettings({ enabledPaymentMethods: current.filter((m) => m !== method) });
    } else {
      updateSettings({ enabledPaymentMethods: [...current, method] });
    }
  };

  const toggleCountry = (country: string) => {
    const current = settings.enabledCountries;
    if (current.includes(country)) {
      updateSettings({ enabledCountries: current.filter((c) => c !== country) });
    } else {
      updateSettings({ enabledCountries: [...current, country] });
    }
  };

  const handleSave = () => {
    updateSettings({
      platformFeePercent: feeValue,
      paypalHandle,
      defaultLanguage: defaultLang,
      smsNotifications: smsNotif,
      emailNotifications: emailNotif,
      autoReleasePayments: autoRelease,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'sw', label: 'Kiswahili' },
    { code: 'rw', label: 'Runyarwanda' },
    { code: 'lg', label: 'Luganda' },
  ];

  const paymentMethods: { key: PaymentMethod; label: string }[] = [
    { key: 'paypal', label: 'PayPal' },
    { key: 'airtel', label: 'Airtel Money' },
    { key: 'mtn', label: 'MTN Mobile Money' },
    { key: 'bank', label: 'Bank Transfer' },
  ];

  const countries = ['Uganda', 'Kenya', 'Tanzania', 'Rwanda'];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Platform Fee */}
      <div className="bg-admin-card border border-admin-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-admin-accent/10 flex items-center justify-center">
            <Percent className="w-5 h-5 text-admin-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-admin-text">
              {t('admin.platformFee') || 'Platform Fee Percentage'}
            </h3>
            <p className="text-xs text-admin-muted">
              {t('admin.feeDescription') || 'This fee is deducted from each transaction. The farmer receives the remaining amount.'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-admin-muted">{t('admin.currentFee') || 'Currently set to'}</span>
              <span className="text-2xl font-semibold text-admin-text font-space">{feeValue.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={feeValue}
              onChange={(e) => setFeeValue(parseFloat(e.target.value))}
              className="w-full h-2 bg-admin-bg rounded-full appearance-none cursor-pointer accent-admin-accent"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-admin-muted">0%</span>
              <span className="text-xs text-admin-muted">10%</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-admin-bg rounded-lg">
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={feeValue}
              onChange={(e) => setFeeValue(parseFloat(e.target.value) || 0)}
              className="w-20 h-9 bg-admin-card border border-admin-border rounded-md px-3 text-sm text-admin-text focus:outline-none focus:border-admin-accent"
            />
            <span className="text-sm text-admin-muted">%</span>
          </div>
        </div>
      </div>

      {/* PayPal Handle */}
      <div className="bg-admin-card border border-admin-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-admin-text">
              {t('admin.paypalHandle') || 'PayPal Handle'}
            </h3>
            <p className="text-xs text-admin-muted">
              {t('admin.paypalDescription') || 'The PayPal handle used for receiving international payments.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={paypalHandle}
            onChange={(e) => setPaypalHandle(e.target.value)}
            className="flex-1 h-10 bg-admin-bg border border-admin-border rounded-lg px-4 text-sm text-admin-text placeholder:text-admin-muted focus:outline-none focus:border-admin-accent"
            placeholder="@username"
          />
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-admin-card border border-admin-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-admin-text">
              {t('admin.paymentMethods') || 'Payment Methods'}
            </h3>
            <p className="text-xs text-admin-muted">
              {t('admin.paymentMethodsDesc') || 'Enable or disable payment methods for the platform.'}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const enabled = settings.enabledPaymentMethods.includes(method.key);
            return (
              <div key={method.key} className="flex items-center justify-between p-3 bg-admin-bg rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${enabled ? 'bg-admin-accent/10' : 'bg-gray-500/10'}`}>
                    <CreditCard className={`w-4 h-4 ${enabled ? 'text-admin-accent' : 'text-gray-500'}`} />
                  </div>
                  <span className="text-sm text-admin-text">{method.label}</span>
                </div>
                <button
                  onClick={() => togglePaymentMethod(method.key)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-admin-accent' : 'bg-gray-600'}`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Default Language */}
      <div className="bg-admin-card border border-admin-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-admin-text">
              {t('admin.defaultLanguage') || 'Default Language'}
            </h3>
            <p className="text-xs text-admin-muted">
              {t('admin.languageDesc') || 'Set the default language for the platform.'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setDefaultLang(lang.code)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                defaultLang === lang.code
                  ? 'border-admin-accent bg-admin-accent/10'
                  : 'border-admin-border bg-admin-bg hover:border-admin-muted'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                defaultLang === lang.code ? 'border-admin-accent' : 'border-admin-muted'
              }`}>
                {defaultLang === lang.code && <div className="w-2 h-2 rounded-full bg-admin-accent" />}
              </div>
              <span className={`text-sm ${defaultLang === lang.code ? 'text-admin-accent font-medium' : 'text-admin-text'}`}>
                {lang.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Country Enablement */}
      <div className="bg-admin-card border border-admin-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-admin-text">
              {t('admin.enabledCountries') || 'Enabled Countries'}
            </h3>
            <p className="text-xs text-admin-muted">
              {t('admin.countriesDesc') || 'Select which countries are active on the platform.'}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {countries.map((country) => {
            const enabled = settings.enabledCountries.includes(country);
            return (
              <div key={country} className="flex items-center justify-between p-3 bg-admin-bg rounded-lg">
                <span className="text-sm text-admin-text">{country}</span>
                <button
                  onClick={() => toggleCountry(country)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-admin-accent' : 'bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-admin-card border border-admin-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-admin-text">
              {t('admin.notifications') || 'Notification Settings'}
            </h3>
            <p className="text-xs text-admin-muted">
              {t('admin.notificationsDesc') || 'Configure platform notification preferences.'}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-admin-bg rounded-lg">
            <span className="text-sm text-admin-text">{t('admin.smsNotifications') || 'Send SMS alerts to farmers on new orders'}</span>
            <button
              onClick={() => setSmsNotif(!smsNotif)}
              className={`relative w-11 h-6 rounded-full transition-colors ${smsNotif ? 'bg-admin-accent' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${smsNotif ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-admin-bg rounded-lg">
            <span className="text-sm text-admin-text">{t('admin.emailNotifications') || 'Send email notifications to admin on pending approvals'}</span>
            <button
              onClick={() => setEmailNotif(!emailNotif)}
              className={`relative w-11 h-6 rounded-full transition-colors ${emailNotif ? 'bg-admin-accent' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${emailNotif ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-admin-bg rounded-lg">
            <span className="text-sm text-admin-text">{t('admin.autoRelease') || 'Auto-release payments after 48h of delivery confirmation'}</span>
            <button
              onClick={() => setAutoRelease(!autoRelease)}
              className={`relative w-11 h-6 rounded-full transition-colors ${autoRelease ? 'bg-admin-accent' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${autoRelease ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-admin-card border border-admin-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
            <Database className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-admin-text">
              {t('admin.dataManagement') || 'Data Management'}
            </h3>
            <p className="text-xs text-admin-muted">
              {t('admin.dataDesc') || 'Export and manage platform data.'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-admin-bg border border-admin-border text-admin-text text-sm rounded-lg hover:bg-white/5 transition-colors">
            <Download className="w-4 h-4" />
            {t('admin.exportAllData') || 'Export All Data'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-admin-bg border border-admin-border text-admin-text text-sm rounded-lg hover:bg-white/5 transition-colors">
            <Database className="w-4 h-4" />
            {t('admin.backup') || 'Backup Database'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/20 transition-colors">
            <Trash2 className="w-4 h-4" />
            {t('admin.clearCache') || 'Clear Cache'}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-admin-accent text-white text-sm font-medium rounded-xl hover:bg-emerald-500 transition-colors"
        >
          <Save className="w-4 h-4" />
          {t('common.save') || 'Save Changes'}
        </button>
        {saved && (
          <span className="text-sm text-admin-accent animate-pulse">
            {t('admin.saved') || 'Settings saved successfully!'}
          </span>
        )}
      </div>
    </div>
  );
}
