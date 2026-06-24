# ShambaNi - East Africa's Farmers Marketplace

A platform connecting smallholder farmers directly with buyers across Uganda, Kenya, Tanzania, and Rwanda. Built with React, TypeScript, Tailwind CSS, and Vite.

## Features

- **Multi-Language Support**: English, Kiswahili, Runyarwanda (Kinyarwanda), Luganda
- **Admin Dashboard**: Full management panel for payments, orders, farmers, products, analytics
- **District Coverage**: Uganda (111 districts), Kenya (47 counties), Tanzania (31 regions), Rwanda (30 districts)
- **USSD Access**: *144# feature for farmers without smartphones
- **Payment Methods**: PayPal (@LutwamaReagan), Airtel Money, MTN Mobile Money, Bank Transfer
- **Marketplace**: Browse, search, filter produce by category, district, and country
- **Cart & Checkout**: Full shopping cart with 2.5% platform fee
- **Farmer Registration**: 4-step wizard with cascading district selection
- **Responsive Design**: Works on all devices

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- HashRouter (GitHub Pages compatible)
- i18next (4 languages)
- Zustand (state management)
- Framer Motion (animations)

## Deployment to GitHub Pages

### Option 1: Auto-Deploy via GitHub Actions (Recommended)

1. **Create a GitHub repository** (e.g., `shambani-marketplace`)
2. **Push this code** to your repository:
   ```bash
   git remote add origin https://github.com/reaganlutwa/shambani-marketplace.git
   git branch -M main
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Go to your repo on GitHub
   - Click **Settings** → **Pages**
   - Under "Build and deployment", select **GitHub Actions**
4. The workflow will automatically build and deploy on every push

### Option 2: Manual Deploy

1. Build the project:
   ```bash
   npm install
   npm run build
   ```
2. The `dist/` folder contains the built files
3. Copy the contents of `dist/` to your `gh-pages` branch or hosting provider

### After Deployment

Your site will be live at:
```
https://reaganlutwa.github.io/Shambani-marketplace/
```

## Admin Dashboard Access

Navigate to `/#/admin` to access the admin dashboard.

Default admin features:
- Review and approve farmer registrations
- Manage orders and payments
- View analytics and reports
- Configure platform settings (2.5% fee, payment methods)
- PayPal handle: @LutwamaReagan

## Pages

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/#/browse` | Browse Produce |
| `/#/product/:id` | Product Detail |
| `/#/farmer-register` | Farmer Registration |
| `/#/ussd` | USSD *144# Feature |
| `/#/cart` | Cart & Checkout |
| `/#/about` | About / Mission |
| `/#/admin` | Admin Dashboard |

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

Copyright 2026 ShambaNi. All rights reserved.
# ShambaNi Deployment Trigger
