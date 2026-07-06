import React, { useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  demoCallRecords,
  summarize,
  upcomingAppointments,
  dentalConfig,
} from "@/engine";
import OverviewTab from "@/components/admin/OverviewTab";
import CallsTab from "@/components/admin/CallsTab";
import CalendarTab from "@/components/admin/CalendarTab";
import ConfigTab from "@/components/admin/ConfigTab";

// Customer-facing admin dashboard (Phase-1 MVP).
//
// It is fed entirely by the conversation engine: `demoCallRecords()` folds
// scripted calls through the pure core, and the same `summarize` /
// `upcomingAppointments` aggregators the engine ships power the charts, call log
// and calendar. A live deployment swaps the demo source for the real call store
// the telephony worker writes — the dashboard components stay unchanged.
export default function Admin() {
  const records = useMemo(() => demoCallRecords(), []);
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
