import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: "positive" | "negative"
  icon: LucideIcon
  color?: "blue" | "green" | "purple" | "orange" | "red" | "indigo"
}

export default function StatCard({ title, value, change, changeType, icon: Icon, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    indigo: "bg-indigo-100 text-indigo-600",
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={cn("p-3 rounded-full", colorClasses[color])}>
          <Icon size={24} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="mt-1 flex items-center text-xs text-muted-foreground">
            <TrendingUp className={cn("mr-1 h-4 w-4", changeType === "positive" ? "text-green-500" : "text-red-500")} />
            <span className={cn(changeType === "positive" ? "text-green-500" : "text-red-500")}>
              {changeType === "positive" ? "+" : ""}
              {change}%
            </span>
            <span className="ml-1">az elmúlt hónap</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
