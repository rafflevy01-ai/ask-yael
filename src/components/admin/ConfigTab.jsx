import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { titleCase } from "./format";

// Read-only view of the active vertical config pack (dental). This is the
// "config editor" MVP: it surfaces exactly the data that parameterises the
// engine — appointment catalogue, resource, and knowledge base — so a customer
// can see what Yael knows about their clinic.
export default function ConfigTab({ config }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profession pack</CardTitle>
          <CardDescription>The vertical configuration driving Yael</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-sm">
          <div className="rounded-lg border px-4 py-2">
            <span className="text-muted-foreground">Vertical</span>
            <div className="font-medium">{config.displayName}</div>
          </div>
          <div className="rounded-lg border px-4 py-2">
            <span className="text-muted-foreground">Resource</span>
            <div className="font-medium">{config.resource.label}</div>
          </div>
          <div className="rounded-lg border px-4 py-2">
            <span className="text-muted-foreground">Appointment types</span>
            <div className="font-medium">{config.appointmentTypes.length}</div>
          </div>
          <div className="rounded-lg border px-4 py-2">
            <span className="text-muted-foreground">FAQ entries</span>
            <div className="font-medium">{config.knowledgeBase.length}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appointment catalogue</CardTitle>
          <CardDescription>Types, durations and urgency flags</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {config.appointmentTypes.map((type) => (
              <div key={type.code} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{type.label}</span>
                  {type.urgent ? <Badge variant="destructive">Urgent</Badge> : null}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{type.minutes} min</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Knowledge base</CardTitle>
          <CardDescription>What Yael can answer, in every language</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {config.knowledgeBase.map((entry) => (
            <div key={entry.id} className="rounded-lg border p-3">
              <div className="mb-1 text-sm font-medium">{titleCase(entry.id.replace(/_/g, " "))}</div>
              <div className="text-sm text-muted-foreground">{entry.answer.en}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
