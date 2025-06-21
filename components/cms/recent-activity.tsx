import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"

const activities = [
  { user: "Kovács Anna", action: "új bejegyzést publikált", time: "5 perce", color: "bg-green-100 text-green-800" },
  { user: "Nagy Péter", action: "felhasználót módosított", time: "12 perce", color: "bg-blue-100 text-blue-800" },
  { user: "Szabó Mária", action: "kommentet moderált", time: "23 perce", color: "bg-purple-100 text-purple-800" },
  { user: "System", action: "biztonsági mentés készült", time: "1 órája", color: "bg-gray-100 text-gray-800" },
]

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Legutóbbi aktivitás</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
                <Activity size={14} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
