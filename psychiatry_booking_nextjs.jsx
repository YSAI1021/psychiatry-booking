import React, { useEffect, useMemo, useState } from "react";

/**
 * Simple Psychiatry Booking Page (Next.js / React)
 * ------------------------------------------------
 * - Single page component (default export) that can be used as a Next.js page.
 * - Simulates a psychiatrist's calendar (Mon-Fri, 9:00 AM - 5:00 PM ET).
 * - Patients pick a weekday date, choose an available 30-minute slot, and submit
 *   a minimal booking form (name + email + optional note).
 * - Bookings persist in localStorage (simple "fake calendar").
 * - No external APIs — purposely minimal and self-contained.
 *
 * How to use
 * - Drop this file into a Next.js app (e.g., app/page.jsx or pages/index.jsx).
 * - Ensure Tailwind CSS is installed for styling. If you don't have Tailwind,
 *   the component will still work but styles will be basic.
 *
 * Design choices & Notes
 * - Times are shown in Eastern Time (ET). The psychiatrist is available
 *   Monday through Friday, 9:00 AM - 5:00 PM ET. Slots are 30 minutes.
 * - Bookings are stored in localStorage under `psychiatry_bookings_v1`.
 */

// --- Configuration ---
const TIMEZONE_LABEL = "ET"; // displayed label
const SLOT_MINUTES = 30; // 30-minute slots
const DAY_START_HOUR = 9; // 9:00 AM ET
const DAY_END_HOUR = 17; // 5:00 PM ET
const VISIBLE_DAYS = 21; // show next 21 calendar days (filtering out weekends)
const STORAGE_KEY = "psychiatry_bookings_v1";

// Utility: format a Date object as `YYYY-MM-DD` (local date representation)
function formatISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Utility: format time like `9:30 AM`
function formatTimeLabel(hours, minutes) {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

// Build all slots for a given date (returns array of {label, timeKey})
function buildSlotsForDate(dateStr) {
  // dateStr is YYYY-MM-DD representing the day in ET (conceptually)
  const [y, m, d] = dateStr.split("-").map(Number);
  const slots = [];
  for (let hour = DAY_START_HOUR; hour < DAY_END_HOUR; hour++) {
    for (let minute = 0; minute < 60; minute += SLOT_MINUTES) {
      // last slot that starts at 16:30 will end at 17:00
      const label = `${formatTimeLabel(hour, minute)} ${TIMEZONE_LABEL}`;
      const timeKey = `${dateStr}T${String(hour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`; // unique key (no timezone offset)
      slots.push({ label, timeKey, hour, minute });
    }
  }
  return slots;
}

export default function PsychiatryBookingPage() {
  // selected date (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(null);
  // selected slot key (timeKey)
  const [selectedSlot, setSelectedSlot] = useState(null);
  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  // bookings map: { timeKey => {name,email,note,createdAt} }
  const [bookings, setBookings] = useState({});
  const [message, setMessage] = useState(null);

  // load bookings from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setBookings(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load bookings", e);
    }
  }, []);

  // persist bookings whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  // compute list of next N weekdays (Mon-Fri)
  const upcomingWeekdays = useMemo(() => {
    const days = [];
    const now = new Date();
    let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    while (days.length < VISIBLE_DAYS) {
      const wd = cursor.getDay();
      // getDay: 0=Sun, 1=Mon, ..., 6=Sat
      if (wd >= 1 && wd <= 5) {
        days.push({
          label: cursor.toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          iso: formatISODate(cursor),
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }, []);

  // currently selected date's slots
  const slots = useMemo(() => {
    if (!selectedDate) return [];
    return buildSlotsForDate(selectedDate);
  }, [selectedDate]);

  // helper to check if a slot is booked
  function isBooked(timeKey) {
    return bookings && bookings[timeKey];
  }

  function handleChooseSlot(slot) {
    if (isBooked(slot.timeKey)) return;
    setSelectedSlot(slot.timeKey);
    setMessage(null);
  }

  function handleSubmitBooking(e) {
    e.preventDefault();
    if (!selectedSlot) {
      setMessage({ type: "error", text: "Please select a time slot first." });
      return;
    }
    if (!name.trim() || !email.trim()) {
      setMessage({ type: "error", text: "Please enter your name and email." });
      return;
    }
    // create booking
    const newBooking = {
      name: name.trim(),
      email: email.trim(),
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => ({ ...prev, [selectedSlot]: newBooking }));
    setMessage({ type: "success", text: `Booked ${selectedSlot} — confirmation saved.` });
    // clear selection and form (but keep bookings)
    setSelectedSlot(null);
    setName("");
    setEmail("");
    setNote("");
  }

  function handleCancelBooking(timeKey) {
    if (!confirm("Cancel this booking?")) return;
    setBookings((prev) => {
      const copy = { ...prev };
      delete copy[timeKey];
      return copy;
    });
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold">Virtual Psychiatry Booking</h1>
          <p className="text-gray-400 mt-2">
            Book a virtual appointment with Dr. Smith. Availability: <strong>
              {DAY_START_HOUR}:00 - {DAY_END_HOUR}:00 {TIMEZONE_LABEL}</strong> (Mon–Fri).
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Date selector */}
          <section className="md:col-span-1 bg-gray-800 rounded-lg p-4">
            <h2 className="font-medium mb-3">Choose a date</h2>
            <div className="flex flex-col gap-2 max-h-96 overflow-auto pr-2">
              {upcomingWeekdays.map((d) => (
                <button
                  key={d.iso}
                  onClick={() => {
                    setSelectedDate(d.iso);
                    setSelectedSlot(null);
                    setMessage(null);
                  }}
                  className={`text-left p-3 rounded-md w-full transition-colors duration-150 hover:bg-gray-700 ${
                    selectedDate === d.iso ? "bg-indigo-600" : "bg-gray-700"
                  }`}
                >
                  <div className="flex justify-between">
                    <span>{d.label}</span>
                    <span className="text-sm text-gray-300">{d.iso}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Middle column: Slots */}
          <section className="md:col-span-1 bg-gray-800 rounded-lg p-4">
            <h2 className="font-medium mb-3">Available slots</h2>
            {!selectedDate ? (
              <p className="text-gray-400">Select a date to see available times.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {slots.map((s) => {
                  const booked = isBooked(s.timeKey);
                  return (
                    <button
                      key={s.timeKey}
                      onClick={() => handleChooseSlot(s)}
                      disabled={booked}
                      className={`text-left p-3 rounded-md transition-colors duration-150 flex justify-between items-center ${
                        booked
                          ? "bg-red-700 cursor-not-allowed opacity-80"
                          : selectedSlot === s.timeKey
                          ? "bg-green-600"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      <div>
                        <div className="font-medium">{s.label}</div>
                      </div>
                      <div className="text-sm text-gray-300">
                        {booked ? "Booked" : "Available"}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Right column: Booking form & existing bookings */}
          <section className="md:col-span-1 bg-gray-800 rounded-lg p-4">
            <h2 className="font-medium mb-3">Your booking</h2>
            <div className="mb-3 text-sm text-gray-300">
              <p>
                Selected slot: <strong>{selectedSlot ?? "(none)"}</strong>
              </p>
              <p className="mt-1">Please enter your name and email to confirm.</p>
            </div>

            <form onSubmit={handleSubmitBooking} className="flex flex-col gap-2">
              <input
                className="p-2 rounded bg-gray-900 text-gray-100 border border-gray-700"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="p-2 rounded bg-gray-900 text-gray-100 border border-gray-700"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                className="p-2 rounded bg-gray-900 text-gray-100 border border-gray-700"
                placeholder="Reason or short note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <button
                type="submit"
                className="mt-2 bg-indigo-600 hover:bg-indigo-500 rounded p-2 font-medium"
              >
                Confirm booking
              </button>

              {message && (
                <div
                  className={`mt-2 p-2 rounded ${
                    message.type === "success" ? "bg-green-700" : "bg-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="mt-4">
                <h3 className="font-medium">Upcoming bookings (this browser)</h3>
                <div className="mt-2 text-sm">
                  {Object.keys(bookings).length === 0 ? (
                    <p className="text-gray-400">No bookings yet.</p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {Object.entries(bookings)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([timeKey, info]) => (
                          <li key={timeKey} className="flex justify-between items-start bg-gray-700 p-2 rounded">
                            <div>
                              <div className="font-medium">{timeKey} {TIMEZONE_LABEL}</div>
                              <div className="text-gray-300 text-sm">{info.name} — {info.email}</div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <button
                                className="text-sm text-yellow-300"
                                onClick={() => alert(JSON.stringify(info, null, 2))}
                              >
                                View
                              </button>
                              <button
                                className="text-sm text-red-400"
                                onClick={() => handleCancelBooking(timeKey)}
                              >
                                Cancel
                              </button>
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </form>
          </section>
        </main>

        <footer className="mt-8 text-gray-500 text-sm">
          <p>
            Note: This is a simple demo "fake calendar" for patients to book virtual
            appointments. No real calendar or video links are generated. Times are
            shown in <strong>{TIMEZONE_LABEL}</strong>.
          </p>
        </footer>
      </div>
    </div>
  );
}
