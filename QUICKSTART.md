# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

## 3. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the SQL script

## 4. Create a Psychiatrist User

1. Go to Authentication > Users in Supabase dashboard
2. Click "Add user"
3. Create a user with email and password (e.g., `jane.smith@example.com`)
4. Note the email for the next step

## 5. Add a Test Psychiatrist

Option 1: Via Admin Dashboard (after logging in)
- Login as admin at `/admin-login`
- Go to dashboard
- Click "Add Psychiatrist"
- Fill in the form (make sure email matches the user you created)

Option 2: Via SQL Editor
```sql
INSERT INTO psychiatrists (name, specialty, location, bio, email)
VALUES (
  'Dr. Jane Smith',
  'General Psychiatry',
  'New York, NY',
  'Dr. Jane Smith is a board-certified psychiatrist with over 10 years of experience.',
  'jane.smith@example.com'
);
```

## 6. Run the Development Server

```bash
npm run dev
```

## 7. Access the Application

- Open [http://localhost:3000](http://localhost:3000)
- Browse psychiatrists
- Test appointment requests
- Login as psychiatrist or admin to access dashboards

## Testing the Application

### As a Patient (Public)
1. Visit the home page
2. Click on a psychiatrist
3. Fill out the appointment request form
4. Submit and see confirmation

### As a Psychiatrist
1. Go to `/psychiatrist-login`
2. Login with the email/password you created in Supabase
3. View your appointment requests in the dashboard
4. Update request statuses

### As an Admin
1. Go to `/admin-login`
2. Login with admin credentials from `.env.local`
3. Manage psychiatrists (add, edit, delete)
4. View all appointment requests

## Troubleshooting

### Can't see psychiatrists?
- Check that the `psychiatrists` table has data
- Verify RLS policies are set up correctly
- Check browser console for errors

### Can't login as psychiatrist?
- Verify the user exists in Supabase Auth
- Check that the email in `psychiatrists` table matches the auth user email
- Verify password is correct

### Admin login not working?
- Check `.env.local` has correct `NEXT_PUBLIC_ADMIN_EMAIL` and `NEXT_PUBLIC_ADMIN_PASSWORD`
- Clear browser localStorage and try again
- Verify the environment variables are loaded (check Next.js console)

### Appointment requests not showing?
- Check that `psychiatrist_id` in `appointment_requests` matches a `psychiatrist.id`
- Verify RLS policies allow viewing requests
- Check browser console for errors

## Next Steps

- Customize the styling and branding
- Add more features (notifications, email alerts, etc.)
- Set up production deployment
- Configure proper security for production (use API routes with service role key)


