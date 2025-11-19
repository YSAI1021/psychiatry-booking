import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

/**
 * Fetch appointment requests for a psychiatrist
 */
export async function GET(request: NextRequest) {
  try {
    const psychiatristId = request.nextUrl.searchParams.get("psychiatristId")

    if (!psychiatristId) {
      return NextResponse.json(
        { error: "psychiatristId query parameter is required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("appointment_requests")
      .select("*")
      .eq("psychiatrist_id", psychiatristId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ data, error: null }, { status: 200 })
  } catch (error: any) {
    console.error("Error in GET /api/appointments:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * API route for appointment requests
 * Handles POST requests to create new appointment requests
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      psychiatrist_id,
      patient_name,
      patient_email,
      preferred_appointment_type,
      preferred_times,
      what_brings_you,
      hoping_to_work_on,
      other_work_on,
      spoken_before,
      anything_else,
      // Legacy fields for backward compatibility
      preferred_date,
      preferred_time,
      message,
    } = body

    // Validate required fields
    if (!psychiatrist_id || !patient_name || !patient_email) {
      return NextResponse.json(
        { error: "Missing required fields: psychiatrist_id, patient_name, patient_email" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailRegex.test(patient_email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Insert appointment request into Supabase
    const { data, error } = await supabase
      .from("appointment_requests")
      .insert([
        {
          psychiatrist_id,
          patient_name,
          patient_email,
          preferred_appointment_type: preferred_appointment_type || null,
          preferred_times: preferred_times || null,
          what_brings_you: what_brings_you || null,
          hoping_to_work_on: hoping_to_work_on || null,
          other_work_on: other_work_on || null,
          spoken_before: spoken_before || null,
          anything_else: anything_else || null,
          // Legacy fields for backward compatibility
          preferred_date: preferred_date || null,
          preferred_time: preferred_time || null,
          message: message || null,
          status: "pending",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating appointment request:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, error: null }, { status: 201 })
  } catch (error: any) {
    console.error("Error in POST /api/appointments:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}


