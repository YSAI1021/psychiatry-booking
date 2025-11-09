"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Psychiatrist } from "@/types/database"
import { Button } from "@/components/ui/button"

/**
 * Home page - Public psychiatrist directory
 * Displays a list of all psychiatrists available for booking
 */
export default function Home() {
  const [psychiatrists, setPsychiatrists] = useState<Psychiatrist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPsychiatrists()
  }, [])

  /**
   * Fetch all psychiatrists from Supabase
   */
  const fetchPsychiatrists = async () => {
    try {
      const { data, error } = await supabase
        .from("psychiatrists")
        .select("*")
        .order("name")

      if (error) throw error
      setPsychiatrists(data || [])
    } catch (error) {
      console.error("Error fetching psychiatrists:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading psychiatrists...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Psychiatrist Directory</h1>
        <p className="text-muted-foreground text-lg">
          Browse our network of qualified psychiatrists and request an appointment
        </p>
      </div>

      {psychiatrists.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No psychiatrists available at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {psychiatrists.map((psychiatrist) => (
            <Card key={psychiatrist.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{psychiatrist.name}</CardTitle>
                <CardDescription>{psychiatrist.specialty}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{psychiatrist.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="text-sm line-clamp-3">{psychiatrist.bio}</p>
                </div>
                <Link href={`/psychiatrist/${psychiatrist.id}`}>
                  <Button className="w-full">View Profile & Request Appointment</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


