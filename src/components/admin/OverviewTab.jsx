import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { localeLabel, outcomeLabel, formatPercent, titleCase } from "./format";

const PIE_COLORS = ["#0D0D0D", "#6B6B6B", "#A3A3A3", "#C8C8C8", "#E0E0E0"];

function StatCard({ label, value, hint }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      {hint ? <CardContent className="pt-0 text-sm text-muted-foreground">{hint}</CardContent> : null}
    </Card>
  );
}

export default function OverviewTab({ summary }) {
  const outcomeData = Object.entries(summary.byOutcome).map(([outcome, value]) => ({
    name: outcomeLabel(outcome),
    value,
  }));
  const localeData = Object.entries(summary.byLocale).map(([locale, value]) => ({
    name: localeLabel(locale),
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total calls" value={summary.total} hint="Handled by Yael" />
        <StatCard
          label="Containment rate"
          value={formatPercent(summary.containmentRate)}
          hint="Resolved without a human"
        />
        <StatCard label="Appointments" value={summary.bookings + summary.reschedules} hint={`${summary.bookings} booked · ${summary.reschedules} moved`} />
        <StatCard label="SMS sent" value={summary.smsSent} hint={`${summary.emergencies} emergencies · ${summary.handoffs} handoffs`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Call outcomes</CardTitle>
            <CardDescription>How Yael resolved each call</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={outcomeData} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                  <Bar dataKey="value" fill="#0D0D0D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Language mix</CardTitle>
            <CardDescription>Detected caller language</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={localeData} dataKey="value" nameKey="name" outerRadius={90} label={(d) => `${d.name} (${d.value})`}>
                    {localeData.map((entry, i) => (
                      <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Intent breakdown</CardTitle>
          <CardDescription>What callers asked for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(summary.byIntent).map(([intent, value]) => (
              <div key={intent} className="rounded-lg border px-4 py-2 text-sm">
                <span className="font-medium">{titleCase(intent)}</span>
                <span className="ml-2 text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
