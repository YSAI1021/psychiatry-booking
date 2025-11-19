"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AppointmentRequestFormData {
  name: string
  email: string
  preferred_appointment_type: string
  preferred_times: string[]
  what_brings_you: string
  hoping_to_work_on: string[]
  other_work_on: string
  spoken_before: string
  anything_else: string
}

interface AppointmentRequestFormProps {
  psychiatristId: string
  onSuccess: () => void
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
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
    watch,
    setValue,
  } = useForm<AppointmentRequestFormData>({
    defaultValues: {
      preferred_times: [],
      hoping_to_work_on: [],
    },
  })

  const preferredTimes = watch("preferred_times") || []
  const hopingToWorkOn = watch("hoping_to_work_on") || []

  const toggleArrayValue = (array: string[], value: string) => {
    if (array.includes(value)) {
      return array.filter((item) => item !== value)
    }
    return [...array, value]
  }

  const onSubmit = async (data: AppointmentRequestFormData) => {
    setSubmitting(true)
    setError(null)

    // Validate preferred times
    if (!data.preferred_times || data.preferred_times.length === 0) {
      setError("Please select at least one preferred appointment time")
      setSubmitting(false)
      return
    }

    // Validate hoping to work on
    if (!data.hoping_to_work_on || data.hoping_to_work_on.length === 0) {
      setError("Please select at least one option for what you&apos;re hoping to work on")
      setSubmitting(false)
      return
    }

    // Validate required fields
    if (!data.preferred_appointment_type) {
      setError("Please select a preferred appointment type")
      setSubmitting(false)
      return
    }

    if (!data.spoken_before) {
      setError("Please answer whether you&apos;ve spoken with a therapist before")
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          psychiatrist_id: psychiatristId,
          patient_name: data.name,
          patient_email: data.email,
          preferred_appointment_type: data.preferred_appointment_type,
          preferred_times: data.preferred_times,
          what_brings_you: data.what_brings_you,
          hoping_to_work_on: data.hoping_to_work_on,
          other_work_on: data.other_work_on || null,
          spoken_before: data.spoken_before,
          anything_else: data.anything_else || null,
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to submit appointment request")
      }

      setSuccess(true)
      reset()
      onSuccess()

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
          Fill out the form below to request an appointment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_appointment_type">
              Preferred Appointment Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch("preferred_appointment_type") || ""}
              onValueChange={(value) => setValue("preferred_appointment_type", value, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-person">In-person</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="either">Either</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Preferred Appointment Times (Select all that apply){" "}
              <span className="text-destructive">*</span>
            </Label>
            <div className="space-y-2">
              {[
                "Weekday mornings",
                "Weekday afternoons",
                "Weekday evenings",
                "Weekend mornings",
                "Weekend afternoons",
              ].map((time) => (
                <label key={time} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferredTimes.includes(time)}
                    onChange={() =>
                      setValue(
                        "preferred_times",
                        toggleArrayValue(preferredTimes, time),
                        { shouldValidate: true }
                      )
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{time}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="what_brings_you">
              What brings you here today? <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="what_brings_you"
              {...register("what_brings_you", {
                required: "This field is required",
              })}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Please share what brings you here today..."
            />
            {errors.what_brings_you && (
              <p className="text-sm text-destructive">
                {errors.what_brings_you.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              What are you hoping to work on or achieve? (Select all that apply){" "}
              <span className="text-destructive">*</span>
            </Label>
            <div className="space-y-2">
              {[
                "Short-term support (specific situation)",
                "Long-term support",
                "Understanding patterns or challenges",
                "Discussing coping strategies",
                "Not sure yet",
              ].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={hopingToWorkOn.includes(option)}
                    onChange={() =>
                      setValue(
                        "hoping_to_work_on",
                        toggleArrayValue(hopingToWorkOn, option)
                      )
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
              <div className="flex items-center space-x-2 pl-6">
                <input
                  type="checkbox"
                  checked={hopingToWorkOn.some((item) => item.startsWith("Other:"))}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setValue("hoping_to_work_on", [...hopingToWorkOn, "Other:"])
                    } else {
                      setValue(
                        "hoping_to_work_on",
                        hopingToWorkOn.filter((item) => !item.startsWith("Other:"))
                      )
                      setValue("other_work_on", "")
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Other:</span>
                {hopingToWorkOn.some((item) => item.startsWith("Other:")) && (
                  <Input
                    {...register("other_work_on")}
                    placeholder="Please specify"
                    className="max-w-xs"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="spoken_before">
              Have you spoken with a therapist, counselor, or psychiatrist before?{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch("spoken_before") || ""}
              onValueChange={(value) => setValue("spoken_before", value, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="anything_else">Anything else?</Label>
            <textarea
              id="anything_else"
              {...register("anything_else")}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Any additional information..."
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
