import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

/**
 * Update an appointment request
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Appointment id is required" }, { status: 400 })
    }

    const body = await request.json()
    const {
      patient_name,
      patient_email,
      preferred_appointment_type,
      preferred_times,
      what_brings_you,
      hoping_to_work_on,
      other_work_on,
      spoken_before,
      anything_else,
    } = body

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (patient_name !== undefined) updates.patient_name = patient_name
    if (patient_email !== undefined) updates.patient_email = patient_email
    if (preferred_appointment_type !== undefined) updates.preferred_appointment_type = preferred_appointment_type
    if (preferred_times !== undefined) updates.preferred_times = preferred_times
    if (what_brings_you !== undefined) updates.what_brings_you = what_brings_you
    if (hoping_to_work_on !== undefined) updates.hoping_to_work_on = hoping_to_work_on
    if (other_work_on !== undefined) updates.other_work_on = other_work_on
    if (spoken_before !== undefined) updates.spoken_before = spoken_before
    if (anything_else !== undefined) updates.anything_else = anything_else

    const { data, error } = await supabase
      .from("appointment_requests")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single()

    if (error) {
      console.error("Error updating appointment:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, error: null }, { status: 200 })
  } catch (error: any) {
    console.error("Error in PUT /api/appointments/[id]:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

/**
 * Cancel (delete) an appointment request
 */
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Appointment id is required" }, { status: 400 })
    }

    const { error } = await supabase.from("appointment_requests").delete().eq("id", id)

    if (error) {
      console.error("Error deleting appointment:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("Error in DELETE /api/appointments/[id]:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}


