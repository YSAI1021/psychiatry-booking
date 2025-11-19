"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase, signOut } from "@/lib/supabase"
import { AppointmentRequest } from "@/types/database"

/**
 * Patient dashboard page
 * Displays appointment requests for the logged-in patient
 */
export default function PatientDashboard() {
  const router = useRouter()
  const [requests, setRequests] = useState<AppointmentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const checkAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        router.push("/patient-login")
        return
      }

      setUser(session.user)

      // Verify user is a patient
      const { data: patient } = await supabase
        .from("patients")
        .select("id")
        .eq("id", session.user.id)
        .single()

      if (!patient) {
        router.push("/patient-login")
        return
      }

      // Fetch patient's appointment requests
      const { data, error } = await supabase
        .from("appointment_requests")
        .select("*")
        .eq("patient_email", session.user.email)
        .order("created_at", { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Dashboard</h1>
          <p className="text-muted-foreground">
            View your appointment requests
          </p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You haven&apos;t submitted any appointment requests yet.
            </p>
            <div className="mt-4 text-center">
              <Button onClick={() => router.push("/")}>
                Browse Psychiatrists
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <CardTitle>Appointment Request</CardTitle>
                <CardDescription>
                  Status: <span className="capitalize">{request.status}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Requested On</p>
                  <p className="text-sm text-muted-foreground">
                    {request.created_at
                      ? new Date(request.created_at).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                {request.preferred_date && (
                  <div>
                    <p className="text-sm font-medium">Preferred Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.preferred_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {request.what_brings_you && (
                  <div>
                    <p className="text-sm font-medium">What brings you here</p>
                    <p className="text-sm text-muted-foreground">
                      {request.what_brings_you}
                    </p>
                  </div>
                )}
                {request.message && (
                  <div>
                    <p className="text-sm font-medium">Message</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {request.message}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

