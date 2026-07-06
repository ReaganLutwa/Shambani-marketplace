# ShambaNi Enhancement Integration Guide

## All New Components (Pushed to `enhancements` branch)

### 1. Chatbot (`src/components/ShambaNiChatbot/`)
- Multi-language (EN/LG/SW)
- Farmer/Buyer auto-detection
- WhatsApp fallback

**Import in App.tsx:**
```tsx
import ShambaNiChatbot from './components/ShambaNiChatbot/ShambaNiChatbot';
<ShambaNiChatbot />
```

### 2. Buyer Registration (`src/components/BuyerRegistration/`)
- 4-step form for 8 buyer types
- Country/Region/District cascading selector

**Add route:**
```tsx
import BuyerRegistration from './components/BuyerRegistration/BuyerRegistration';
<Route path="/buyer-register" element={<BuyerRegistration />} />
```

### 3. Legal Pages (`src/components/LegalPages/`)
- Privacy Policy (DPPA 2019 compliant)
- Terms of Service
- Cookie Consent Banner

**Import:**
```tsx
import { CookieConsentBanner, PrivacyPolicy, TermsOfService } from './components/LegalPages/LegalPages';
<Route path="/privacy" element={<PrivacyPolicy />} />
<Route path="/terms" element={<TermsOfService />} />
<CookieConsentBanner />
```

### 4. For Buyers Page (`src/pages/`)
- Landing page for buyers
- Benefits, buyer types, how it works, FAQ

**Add route:**
```tsx
import ForBuyers from './pages/ForBuyers';
<Route path="/for-buyers" element={<ForBuyers />} />
```

**Add to footer:**
```tsx
{ title: 'For Buyers', links: [
  { label: 'Why Buy on ShambaNi', href: '/for-buyers' },
  { label: 'Register as Buyer', href: '/buyer-register' },
  { label: 'Browse Produce', href: '/browse-produce' }
]}
```

### 5. Location Selector (`src/components/LocationSelector/`)
- Country → Region → District cascading
- 332 districts across UG/KE/TZ/RW

### 6. Admin Buyers (`src/admin/components/`)
- Buyers list with stats
- Buyer verification modal
- Unified verification queue

**Add to admin sidebar:**
```tsx
{ icon: '🏢', label: 'Buyers', path: '/admin/buyers' }
```

### 7. Data Module (`src/data/locationData.ts`)
- All 4 countries, regions, 332 districts
- Phone validation per country
- Currency symbols

## Critical Fixes to Apply in Your Source

### Fix 1: Hide Personal Phone & Email
In your footer component, replace:
```tsx
// REMOVE:
<p>+256 708 813 419</p>
<p>ryglutwa0@gmail.com</p>

// ADD:
<p>support@shambani-market.africa</p>
<p>💬 Live Chat (bottom right)</p>
```

### Fix 2: Replace "0+" Counters
Show real data or hide until meaningful numbers exist.

### Fix 3: Add "For Buyers" to Navigation
```tsx
{ label: 'For Buyers', href: '/for-buyers' }
```

## Next Steps
1. Review all files in the `enhancements` branch
2. Import components into your App.tsx
3. Add routes
4. Update footer nav
5. Build and deploy
