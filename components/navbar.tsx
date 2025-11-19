"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { supabase } from "@/lib/supabase"
import { isAdmin, clearAdminSession } from "@/lib/auth"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

/**
 * Navigation bar component
 * Displays links to different pages and handles authentication state
 */
export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [admin, setAdmin] = useState(false)
  const [isPatient, setIsPatient] = useState(false)

  const checkPatientStatus = useCallback(async (userId: string | undefined) => {
    if (userId) {
      const { data: patient } = await supabase
        .from("patients")
        .select("id")
        .eq("id", userId)
        .single()
      setIsPatient(!!patient)
    } else {
      setIsPatient(false)
    }
  }, [])

  useEffect(() => {
    // Check for Supabase user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      await checkPatientStatus(session?.user?.id)
    })

    // Check for admin session
    setAdmin(isAdmin())

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      await checkPatientStatus(session?.user?.id)
    })

    return () => subscription.unsubscribe()
  }, [checkPatientStatus])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    clearAdminSession()
    setUser(null)
    setAdmin(false)
    router.push("/")
  }

  const isActive = (path: string) => pathname === path
  const isDashboardRoute = pathname?.startsWith("/dashboard") || pathname === "/patient-dashboard"
  const shouldShowNavSignOut = (user || admin) && !isDashboardRoute

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold">
            PsyConnect
          </Link>
          <div className="flex space-x-4">
            <Link href="/">
              <Button variant={isActive("/") ? "default" : "ghost"}>
                Home
              </Button>
            </Link>
            {!user && !admin && (
              <>
                <Link href="/patient-login">
                  <Button variant={isActive("/patient-login") ? "default" : "ghost"}>
                    Patient Login
                  </Button>
                </Link>
                <Link href="/psychiatrist-login">
                  <Button variant={isActive("/psychiatrist-login") ? "default" : "ghost"}>
                    Psychiatrist Login
                  </Button>
                </Link>
                <Link href="/admin-login">
                  <Button variant={isActive("/admin-login") ? "default" : "ghost"}>
                    Admin Login
                  </Button>
                </Link>
              </>
            )}
            {isPatient && (
              <Link href="/patient-dashboard">
                <Button variant={isActive("/patient-dashboard") ? "default" : "ghost"}>
                  My Dashboard
                </Button>
              </Link>
            )}
            {(user && !isPatient) && (
              <Link href="/dashboard">
                <Button variant={isActive("/dashboard") ? "default" : "ghost"}>
                  Dashboard
                </Button>
              </Link>
            )}
            {admin && (
              <Link href="/dashboard">
                <Button variant={isActive("/dashboard") ? "default" : "ghost"}>
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/patient-signup">
            <Button variant="outline">
              Patient Sign Up
            </Button>
          </Link>
          {shouldShowNavSignOut && (
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}


