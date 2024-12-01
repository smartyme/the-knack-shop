# The Knack Shop

## Setup Instructions

1. Create a Supabase project at https://supabase.com
2. Get your project credentials:
   - Go to Project Settings > API
   - Copy the Project URL and anon/public key
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Replace the placeholder values with your actual Supabase credentials
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Database Setup

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase/seed.sql`
3. Run the SQL to create and seed the database

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Features

- Product catalog with categories
- Shopping cart functionality
- User authentication
- Order management
- Product reviews
- Responsive design