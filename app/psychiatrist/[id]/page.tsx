"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Psychiatrist } from "@/types/database"
import { AppointmentRequestForm } from "@/components/appointment-request-form"

/**
 * Psychiatrist profile page
 * Displays detailed information about a psychiatrist and appointment request form
 */
export default function PsychiatristProfile() {
  const params = useParams()
  const router = useRouter()
  const [psychiatrist, setPsychiatrist] = useState<Psychiatrist | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * Fetch psychiatrist details from Supabase
   */
  const fetchPsychiatrist = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("psychiatrists")
        .select("*")
        .eq("id", id)
        .single()

      if (error) throw error
      setPsychiatrist(data)
    } catch (error) {
      console.error("Error fetching psychiatrist:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (params.id) {
      fetchPsychiatrist(params.id as string)
    }
  }, [params.id, fetchPsychiatrist])

  const handleAppointmentSuccess = () => {
    // Form handles success message internally
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading psychiatrist profile...</p>
      </div>
    )
  }

  if (!psychiatrist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Psychiatrist not found</p>
        <Button onClick={() => router.push("/")}>Back to Directory</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        ← Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{psychiatrist.name}</CardTitle>
          <CardDescription className="text-lg">{psychiatrist.specialty}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Location</h3>
            <p className="text-muted-foreground">{psychiatrist.location}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-muted-foreground whitespace-pre-line">{psychiatrist.bio}</p>
          </div>
        </CardContent>
      </Card>

      <AppointmentRequestForm
        psychiatristId={psychiatrist.id}
        onSuccess={handleAppointmentSuccess}
      />
    </div>
  )
}


