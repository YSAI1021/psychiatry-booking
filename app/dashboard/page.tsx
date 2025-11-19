"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { isAdmin } from "@/lib/auth"
import { PsychiatristDashboard } from "@/components/dashboard/psychiatrist-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { Card, CardContent } from "@/components/ui/card"

/**
 * Dashboard page
 * Conditionally renders based on user role (psychiatrist or admin)
 */
export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [admin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  /**
   * Check authentication status for both Supabase user and admin
   */
  const checkAuth = useCallback(async () => {
    try {
      // Check for Supabase user
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      // Check for admin session
      setAdmin(isAdmin())

      // If neither authenticated, redirect to home
      if (!session?.user && !isAdmin()) {
        router.push("/")
        return
      }
    } catch (error) {
      console.error("Error checking auth:", error)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  // Render admin dashboard if admin is logged in
  if (admin) {
    return <AdminDashboard />
  }

  // Render psychiatrist dashboard if user is logged in
  if (user) {
    return <PsychiatristDashboard userId={user.id} />
  }

  // Default: redirect to home
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">Unauthorized. Redirecting...</p>
      </CardContent>
    </Card>
  )
}


