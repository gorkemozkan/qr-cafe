# QR Cafe

Manageable, multi-use QR Menu SaaS platform for cafes & restaurants.


## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Cloudflare Turnstile account (optional, for CAPTCHA)

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd qr-cafe
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration. See [Environment Variables Documentation](./docs/environment-variables.md) for detailed setup instructions.

### 4. Set up Supabase
1. Create a new Supabase project
2. Run the migrations from the `supabase/migrations` directory
3. Configure your Supabase credentials in `.env.local`

### 5. Start the development server
```bash
npm run dev
```
