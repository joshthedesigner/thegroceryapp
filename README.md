# Meal Tracker Web Application

A comprehensive web application for tracking ingredients, meals, and reducing food waste. Built with React, Supabase, and ANT Design.

## Features

- **Google Authentication** - Secure login with Google OAuth
- **Ingredient Management** - Track purchases, quantities, and costs
- **Meal Logging** - Log meals with ingredient usage and automatic cost calculation
- **Dashboard Analytics** - Visualize spending, usage patterns, and waste reduction
- **Real-time Updates** - Live data synchronization across devices
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 18 + Vite
- **UI Framework**: ANT Design
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Authentication**: Google OAuth via Supabase Auth
- **Deployment**: Vercel
- **Styling**: CSS + ANT Design components

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account
- Google Cloud Console account (for OAuth)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd meal-tracker-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema from `supabase-schema.sql` in your Supabase SQL editor
3. Get your project URL and anon key from Settings > API

### 4. Configure Google OAuth

1. Follow the instructions in `google-auth-setup.md`
2. Enable Google OAuth in your Supabase project
3. Add the redirect URIs to your Google OAuth configuration

### 5. Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 6. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API and external service integrations
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── styles/             # CSS styles
└── config/             # Configuration files
```

## Database Schema

The application uses three main tables:

- **ingredients** - Stores ingredient purchases and inventory
- **meals** - Stores meal logs and total costs
- **meal_ingredients** - Links meals to ingredients with quantities used

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style

- Use functional components with hooks
- Follow ANT Design patterns and components
- Use TypeScript for better type safety (optional)

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Environment Variables for Production

Make sure to add these in your Vercel project settings:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue in the GitHub repository. 