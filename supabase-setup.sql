-- Psychiatry Booking System - Database Setup Script
-- Run this script in your Supabase SQL Editor

-- Create psychiatrists table
CREATE TABLE IF NOT EXISTS psychiatrists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create appointment_requests table
CREATE TABLE IF NOT EXISTS appointment_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  psychiatrist_id UUID NOT NULL REFERENCES psychiatrists(id) ON DELETE CASCADE,
  patient_name VARCHAR(255) NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  preferred_date DATE,
  preferred_time TIME,
  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE psychiatrists ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running the script)
DROP POLICY IF EXISTS "Psychiatrists are viewable by everyone" ON psychiatrists;
DROP POLICY IF EXISTS "Anyone can manage psychiatrists" ON psychiatrists;
DROP POLICY IF EXISTS "Anyone can insert appointment requests" ON appointment_requests;
DROP POLICY IF EXISTS "Anyone can view appointment requests" ON appointment_requests;
DROP POLICY IF EXISTS "Anyone can update appointment requests" ON appointment_requests;

-- Create policies for public read access to psychiatrists
CREATE POLICY "Psychiatrists are viewable by everyone" ON psychiatrists
  FOR SELECT USING (true);

-- Allow managing psychiatrists (insert, update, delete)
-- NOTE: In production, you should use API routes with service role key for admin operations
-- This allows the admin dashboard to work, but security is handled in the application layer
CREATE POLICY "Anyone can manage psychiatrists" ON psychiatrists
  FOR ALL USING (true) WITH CHECK (true);

-- Create policies for inserting appointment requests (public)
CREATE POLICY "Anyone can insert appointment requests" ON appointment_requests
  FOR INSERT WITH CHECK (true);

-- Allow viewing appointment requests (application layer handles authorization)
-- In production, you may want to restrict this based on user roles
CREATE POLICY "Anyone can view appointment requests" ON appointment_requests
  FOR SELECT USING (true);

-- Allow updating appointment requests (application layer handles authorization)
-- The application ensures only psychiatrists can update their own requests
CREATE POLICY "Anyone can update appointment requests" ON appointment_requests
  FOR UPDATE USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_appointment_requests_psychiatrist_id ON appointment_requests(psychiatrist_id);
CREATE INDEX IF NOT EXISTS idx_appointment_requests_status ON appointment_requests(status);
CREATE INDEX IF NOT EXISTS idx_psychiatrists_email ON psychiatrists(email);

-- Insert sample psychiatrist (optional - remove if not needed)
-- Make sure to create a corresponding user in Supabase Auth first
-- INSERT INTO psychiatrists (name, specialty, location, bio, email)
-- VALUES (
--   'Dr. Jane Smith',
--   'General Psychiatry',
--   'New York, NY',
--   'Dr. Jane Smith is a board-certified psychiatrist with over 10 years of experience treating adults with depression, anxiety, and mood disorders.',
--   'jane.smith@example.com'
-- );

