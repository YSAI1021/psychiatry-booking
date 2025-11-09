import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

/**
 * API route for updating appointment request status
 * Handles PUT requests to update appointment status
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    // Validate required fields
    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields: id, status" },
        { status: 400 }
      )
    }

    // Validate status value
    const validStatuses = ["pending", "approved", "declined", "completed"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      )
    }

    // Update appointment request in Supabase
    const { data, error } = await supabase
      .from("appointment_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating appointment request:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, error: null }, { status: 200 })
  } catch (error: any) {
    console.error("Error in PUT /api/appointments/update:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}


