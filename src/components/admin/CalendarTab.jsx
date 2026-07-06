import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localeLabel, titleCase } from "./format";

const WEEK = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// Group upcoming appointments by weekday for a simple week view.
function groupByDay(appointments) {
  const byDay = {};
  for (const day of WEEK) byDay[day] = [];
  for (const appt of appointments) {
    const key = (appt.day || "").toLowerCase();
    if (byDay[key]) byDay[key].push(appt);
  }
  return byDay;
}

export default function CalendarTab({ appointments }) {
  const byDay = groupByDay(appointments);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Upcoming appointments</CardTitle>
        <CardDescription>
          Booked and rescheduled by Yael · syncs to Google Calendar or a local calendar
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No appointments booked yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WEEK.filter((day) => day !== "saturday").map((day) => (
              <div key={day} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">{titleCase(day)}</span>
                  <span className="text-xs text-muted-foreground">{byDay[day].length}</span>
                </div>
                <div className="space-y-2">
                  {byDay[day].length === 0 ? (
                    <div className="text-xs text-muted-foreground">—</div>
                  ) : (
                    byDay[day].map((appt, i) => (
                      <div key={i} className="rounded-md bg-muted px-3 py-2 text-sm">
                        <div className="font-medium">{titleCase(appt.appointmentType) || "Appointment"}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline">{localeLabel(appt.locale)}</Badge>
                          <span>{appt.callId}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
