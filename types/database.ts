/**
 * Database types for Supabase
 * Defines the structure of psychiatrists and appointment requests
 */

export interface Psychiatrist {
  id: string
  name: string
  specialty: string
  location: string
  bio: string
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
  status: "pending" | "approved" | "declined" | "completed"
  created_at?: string
  updated_at?: string
}

export interface PsychiatristWithRequests extends Psychiatrist {
  requests?: AppointmentRequest[]
}


