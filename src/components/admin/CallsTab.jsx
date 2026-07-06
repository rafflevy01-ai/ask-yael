import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { localeLabel, outcomeLabel, outcomeVariant, timeAgo } from "./format";

function TranscriptView({ record }) {
  if (!record) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full min-h-[300px] items-center justify-center text-sm text-muted-foreground">
          Select a call to view its transcript.
        </CardContent>
      </Card>
    );
  }

  const isRtl = record.locale === "he";
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Call {record.id}</CardTitle>
        <CardDescription>
          {localeLabel(record.locale)} · {timeAgo(record.startedAt)}
          {" · "}
          <Badge variant={outcomeVariant(record.outcome)}>{outcomeLabel(record.outcome)}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3" dir={isRtl ? "rtl" : "ltr"}>
          {record.transcript.map((turn, i) => (
            <div
              key={i}
              className={turn.role === "yael" ? "flex justify-start" : "flex justify-end"}
            >
              <div
                className={
                  "max-w-[80%] rounded-2xl px-4 py-2 text-sm " +
                  (turn.role === "yael"
                    ? "bg-muted text-foreground"
                    : "bg-primary text-primary-foreground")
                }
              >
                <div className="mb-0.5 text-[10px] uppercase tracking-wide opacity-60">
                  {turn.role === "yael" ? "Yael" : "Caller"}
                </div>
                {turn.text}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CallsTab({ records }) {
  const [selectedId, setSelectedId] = useState(records[0] ? records[0].id : null);
  const selected = records.find((r) => r.id === selectedId) || null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Call log</CardTitle>
          <CardDescription>Recent calls answered by Yael</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Call</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>SMS</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  data-state={r.id === selectedId ? "selected" : undefined}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">{r.id}</TableCell>
                  <TableCell>{localeLabel(r.locale)}</TableCell>
                  <TableCell>
                    <Badge variant={outcomeVariant(r.outcome)}>{outcomeLabel(r.outcome)}</Badge>
                  </TableCell>
                  <TableCell>{r.smsSent}</TableCell>
                  <TableCell className="text-muted-foreground">{timeAgo(r.startedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <TranscriptView record={selected} />
      </div>
    </div>
  );
}
