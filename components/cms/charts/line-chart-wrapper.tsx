"use client"

import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts"
import type { AnalyticsChartData } from "@/lib/types"

interface LineChartWrapperProps {
  data: AnalyticsChartData[]
}

export default function LineChartWrapper({ data }: LineChartWrapperProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
          }}
        />
        <Line type="monotone" dataKey="látogatók" stroke="hsl(var(--primary))" strokeWidth={2} />
        {data.length > 0 && data[0].oldalmegtekintések !== undefined && (
          <Line type="monotone" dataKey="oldalmegtekintések" stroke="hsl(var(--chart-2))" strokeWidth={2} />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
