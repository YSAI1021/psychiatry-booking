/**
 * Database types for Supabase
 * Defines the structure of psychiatrists, patients, and appointment requests
 */

export interface Psychiatrist {
  id: string
  name: string
  specialty: string
  location: string
  bio: string
  email: string
  availability?: string
  review_rating?: number
  created_at?: string
  updated_at?: string
}

export interface Patient {
  id: string
  name: string
  email: string
  created_at?: string
  updated_at?: string
}

export interface AppointmentRequest {
  id: string
  psychiatrist_id: string
  patient_name: string
  patient_email: string
  preferred_date?: string
  preferred_time?: string
  message?: string
  preferred_appointment_type?: string
  preferred_times?: string[]
  what_brings_you?: string
  hoping_to_work_on?: string[]
  other_work_on?: string
  spoken_before?: string
  anything_else?: string
  status: "pending" | "approved" | "declined" | "completed"
  created_at?: string
  updated_at?: string
}

export interface PsychiatristWithRequests extends Psychiatrist {
  requests?: AppointmentRequest[]
}


