"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AppointmentRequestFormData {
  patient_name: string
  patient_email: string
  preferred_date: string
  preferred_time: string
  message: string
}

interface AppointmentRequestFormProps {
  psychiatristId: string
  onSuccess: () => void
}

/**
 * Appointment request form component
 * Handles form submission and validation for appointment requests
 */
export function AppointmentRequestForm({
  psychiatristId,
  onSuccess,
}: AppointmentRequestFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentRequestFormData>()

  /**
   * Submit appointment request to Supabase
   */
  const onSubmit = async (data: AppointmentRequestFormData) => {
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          psychiatrist_id: psychiatristId,
          ...data,
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to submit appointment request")
      }

      setSuccess(true)
      reset()
      onSuccess()

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err: any) {
      setError(err.message || "Failed to submit appointment request")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="border-green-500 bg-green-50 dark:bg-green-950">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-green-700 dark:text-green-300 font-semibold">
              Appointment request submitted successfully!
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              The psychiatrist will review your request and get back to you soon.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Appointment</CardTitle>
        <CardDescription>
          Fill out the form below to request an appointment with this psychiatrist
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient_name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="patient_name"
              {...register("patient_name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              placeholder="Your full name"
            />
            {errors.patient_name && (
              <p className="text-sm text-destructive">{errors.patient_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient_email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="patient_email"
              type="email"
              {...register("patient_email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="your.email@example.com"
            />
            {errors.patient_email && (
              <p className="text-sm text-destructive">{errors.patient_email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_date">Preferred Date</Label>
            <Input
              id="preferred_date"
              type="date"
              {...register("preferred_date")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_time">Preferred Time</Label>
            <Input
              id="preferred_time"
              type="time"
              {...register("preferred_time")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              {...register("message")}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Any additional information or preferences..."
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

