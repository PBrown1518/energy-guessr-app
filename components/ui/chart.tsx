"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Simple chart container
function ChartContainer({
  id,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode
}) {
  return (
    <div id={id} className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

// Simple tooltip component
const ChartTooltip = RechartsPrimitive.Tooltip

// Simple tooltip content
interface TooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    dataKey: string
  }>
}

function ChartTooltipContent(props: TooltipProps) {
  const { active, payload } = props

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="bg-white p-2 border rounded shadow">
      {payload.map((item, index: number) => (
        <div key={index}>
          <p className="font-semibold">{`${item.name}: ${item.value}`}</p>
        </div>
      ))}
    </div>
  )
}

// Simple legend component
const ChartLegend = RechartsPrimitive.Legend

// Export the components
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
}
