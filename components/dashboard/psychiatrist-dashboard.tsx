"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { supabase, signOut } from "@/lib/supabase"
import { AppointmentRequest } from "@/types/database"
import { useRouter } from "next/navigation"

interface PsychiatristDashboardProps {
  userId: string
}

/**
 * Psychiatrist dashboard component
 * Displays appointment requests for the logged-in psychiatrist
 */
export function PsychiatristDashboard({ userId }: PsychiatristDashboardProps) {
  const router = useRouter()
  const [requests, setRequests] = useState<AppointmentRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [userId])

  /**
   * Fetch appointment requests for this psychiatrist
   */
  const fetchRequests = async () => {
    try {
      // Get the current user's email from Supabase auth
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser?.email) {
        console.error("No user email found")
        setLoading(false)
        return
      }

      // Get the psychiatrist record for this user by matching email
      const { data: psychiatrist, error: psychError } = await supabase
        .from("psychiatrists")
        .select("id")
        .eq("email", authUser.email)
        .single()

      if (psychError) {
        console.error("Error fetching psychiatrist:", psychError)
        // If psychiatrist doesn't exist, show empty list
        setRequests([])
        setLoading(false)
        return
      }

      // Fetch requests for this psychiatrist
      if (psychiatrist) {
        const { data, error } = await supabase
          .from("appointment_requests")
          .select("*")
          .eq("psychiatrist_id", psychiatrist.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        setRequests(data || [])
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update appointment request status
   */
  const updateStatus = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/appointments/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: requestId,
          status: newStatus,
        }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      // Refresh requests after update
      fetchRequests()
    } catch (error: any) {
      console.error("Error updating status:", error)
      alert(`Failed to update status: ${error.message}`)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/psychiatrist-login")
    router.refresh()
  }

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const approvedRequests = requests.filter((r) => r.status === "approved")
  const declinedRequests = requests.filter((r) => r.status === "declined")
  const completedRequests = requests.filter((r) => r.status === "completed")

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading requests...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Psychiatrist Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your appointment requests
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-2xl">{requests.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl">{pendingRequests.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-2xl">{approvedRequests.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl">{completedRequests.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="declined">Declined</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <RequestsTable requests={requests} onStatusUpdate={updateStatus} />
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <RequestsTable requests={pendingRequests} onStatusUpdate={updateStatus} />
        </TabsContent>
        <TabsContent value="approved" className="space-y-4">
          <RequestsTable requests={approvedRequests} onStatusUpdate={updateStatus} />
        </TabsContent>
        <TabsContent value="declined" className="space-y-4">
          <RequestsTable requests={declinedRequests} onStatusUpdate={updateStatus} />
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <RequestsTable requests={completedRequests} onStatusUpdate={updateStatus} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * Requests table component
 * Displays appointment requests in a table format with status updates
 */
function RequestsTable({
  requests,
  onStatusUpdate,
}: {
  requests: AppointmentRequest[]
  onStatusUpdate: (id: string, status: string) => void
}) {
  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No requests found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{request.patient_name}</CardTitle>
              <Select
                value={request.status}
                onValueChange={(value) => onStatusUpdate(request.id, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{request.patient_email}</p>
            </div>
            {request.preferred_date && (
              <div>
                <p className="text-sm font-medium">Preferred Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(request.preferred_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {request.preferred_time && (
              <div>
                <p className="text-sm font-medium">Preferred Time</p>
                <p className="text-sm text-muted-foreground">{request.preferred_time}</p>
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
            <div>
              <p className="text-sm font-medium">Requested On</p>
              <p className="text-sm text-muted-foreground">
                {request.created_at
                  ? new Date(request.created_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

