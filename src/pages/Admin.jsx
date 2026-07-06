import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  demoCallRecords,
  summarize,
  upcomingAppointments,
  dentalConfig,
} from "@/engine";
import { fetchCallRecords } from "@/lib/callSource";
import OverviewTab from "@/components/admin/OverviewTab";
import CallsTab from "@/components/admin/CallsTab";
import CalendarTab from "@/components/admin/CalendarTab";
import ConfigTab from "@/components/admin/ConfigTab";

// Customer-facing admin dashboard (Phase-1 MVP).
//
// It is fed by the conversation engine's aggregators (`summarize` /
// `upcomingAppointments`). The call records come from the live Cloudflare D1
// store via `/api/calls` (see functions/api/calls.js) and degrade gracefully to
// the engine's `demoCallRecords()` when the API is unavailable — so the same
// dashboard works in local `npm run dev` and in a full Cloudflare deployment
// without any component change.
export default function Admin() {
  const { data } = useQuery({
    queryKey: ["call-records"],
    queryFn: ({ signal }) => fetchCallRecords({ signal }),
    // Never leave the dashboard empty while loading: start from demo data.
    placeholderData: { records: demoCallRecords(), source: "demo" },
  });

  const records = data?.records ?? [];
  const source = data?.source ?? "demo";
  const summary = useMemo(() => summarize(records), [records]);
  const appointments = useMemo(() => upcomingAppointments(records), [records]);

  return (
    <main dir="ltr" className="min-h-screen bg-background px-4 pb-16 pt-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-medium text-muted-foreground">Ask Yael · Admin</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{dentalConfig.displayName} dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Live view of the calls Yael handled, the appointments she booked, and how your
            receptionist is configured.
            {source === "demo" && (
              <span className="ml-1 italic">Showing sample data until the first live call.</span>
            )}
          </p>
        </header>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab summary={summary} />
          </TabsContent>
          <TabsContent value="calls" className="mt-6">
            <CallsTab records={records} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-6">
            <CalendarTab appointments={appointments} />
          </TabsContent>
          <TabsContent value="config" className="mt-6">
            <ConfigTab config={dentalConfig} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
