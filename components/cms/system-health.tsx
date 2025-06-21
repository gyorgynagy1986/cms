import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const healthItems = [
  { name: "Szerver", status: "online", value: "99.9%", color: "bg-green-500" },
  { name: "Adatbázis", status: "online", value: "2.3s", color: "bg-green-500" },
  { name: "Cache", status: "online", value: "89%", color: "bg-yellow-500" },
  { name: "Backup", status: "online", value: "12h", color: "bg-green-500" },
]

export default function SystemHealth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendszer állapot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                <span className="text-sm font-medium text-gray-900">{item.name}</span>
              </div>
              <span className="text-sm text-gray-500">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
