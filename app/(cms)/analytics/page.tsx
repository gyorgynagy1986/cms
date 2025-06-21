"use client"

import StatCard from "@/components/cms/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts"
import { Users, Eye, Clock, TrendingUp } from "lucide-react"
import type { AnalyticsChartData, TrafficSource } from "@/lib/types"
import { useState, useEffect } from "react"

// Define mock data directly in the component
const analyticsData: AnalyticsChartData[] = [
  { name: "Jan", látogatók: 400, visszatérők: 240 },
  { name: "Feb", látogatók: 300, visszatérők: 221 },
  { name: "Márc", látogatók: 200, visszatérők: 229 },
  { name: "Ápr", látogatók: 278, visszatérők: 200 },
  { name: "Máj", látogatók: 189, visszatérők: 218 },
  { name: "Jún", látogatók: 239, visszatérők: 250 },
  { name: "Júl", látogatók: 349, visszatérők: 230 },
  { name: "Aug", látogatók: 402, visszatérők: 260 },
  { name: "Szep", látogatók: 310, visszatérők: 210 },
  { name: "Okt", látogatók: 290, visszatérők: 190 },
  { name: "Nov", látogatók: 380, visszatérők: 240 },
  { name: "Dec", látogatók: 410, visszatérők: 270 },
]

const trafficSources: TrafficSource[] = [
  { name: "Közvetlen", sessions: 10580, percentage: 42.6 },
  { name: "Organikus keresés", sessions: 8230, percentage: 33.1 },
  { name: "Hivatkozások", sessions: 3520, percentage: 14.2 },
  { name: "Közösségi média", sessions: 1870, percentage: 7.5 },
  { name: "Egyéb", sessions: 647, percentage: 2.6 },
]

export default function AnalyticsPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Cards - Mobile Optimized Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        <StatCard 
          title="Egyedi látogatók" 
          value="24,847" 
          change={12} 
          changeType="positive" 
          icon={Users} 
          color="blue" 
        />
        <StatCard 
          title="Oldalmegtekintések" 
          value="89,432" 
          change={8} 
          changeType="positive" 
          icon={Eye} 
          color="green" 
        />
        <StatCard
          title={isMobile ? "Átlag tartózkodás" : "Átlagos tartózkodási idő"}
          value="4:23"
          change={15}
          changeType="positive"
          icon={Clock}
          color="purple"
        />
        <StatCard
          title={isMobile ? "Visszafordulás" : "Visszafordulási arány"}
          value="32.4%"
          change={-5}
          changeType="negative"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Charts Section - Mobile-First Responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Traffic Chart */}
        <Card className="w-full">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-lg md:text-xl">
              {isMobile ? "Látogatók" : "Látogatói forgalom"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="w-full h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLátogatók" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorVisszatérők" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={isMobile ? 10 : 12}
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={isMobile ? 10 : 12}
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    width={isMobile ? 30 : 40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: isMobile ? "12px" : "14px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="látogatók"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorLátogatók)"
                    strokeWidth={isMobile ? 1.5 : 2}
                  />
                  <Area
                    type="monotone"
                    dataKey="visszatérők"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorVisszatérők)"
                    strokeWidth={isMobile ? 1.5 : 2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Mobile Legend */}
            {isMobile && (
              <div className="flex justify-center space-x-4 mt-3 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                  <span>Látogatók</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "hsl(var(--chart-2))" }}></div>
                  <span>Visszatérők</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Traffic Sources */}
        <Card className="w-full">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-lg md:text-xl">
              {isMobile ? "Forgalom források" : "Forgalom források"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 md:space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="space-y-2">
                  {/* Source Info */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base font-medium text-foreground truncate flex-1 mr-2">
                      {source.name}
                    </span>
                    <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
                      <span className="text-xs md:text-sm text-muted-foreground">
                        {isMobile 
                          ? source.sessions > 1000 
                            ? `${Math.round(source.sessions / 1000)}k`
                            : source.sessions.toString()
                          : source.sessions.toLocaleString()
                        }
                      </span>
                      <span className="text-sm md:text-base font-medium text-foreground min-w-[3rem] text-right">
                        {source.percentage}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total Sessions Mobile */}
            {isMobile && (
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Összes munkamenet:</span>
                  <span className="font-bold">
                    {trafficSources.reduce((sum, source) => sum + source.sessions, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}