# Google Authentication Setup Guide for Meal Tracker App

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local development)
5. Copy the Client ID and Client Secret

## Step 2: Configure Supabase Authentication

1. Go to your Supabase Dashboard
2. Navigate to "Authentication" > "Settings" > "External OAuth Providers"
3. Find "Google" and click "Enable"
4. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
5. Save the configuration

## Step 3: Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Step 4: Test Authentication

1. Start your development server
2. Try logging in with Google
3. Verify that users are created in the `auth.users` table
4. Check that the user ID is properly linked to your app's tables

## Troubleshooting

- **Redirect URI mismatch**: Ensure the redirect URI in Google Console matches your Supabase callback URL
- **CORS issues**: Make sure your domain is added to the authorized origins in Google Console
- **Authentication errors**: Check that the Google+ API is enabled in your Google Cloud project 