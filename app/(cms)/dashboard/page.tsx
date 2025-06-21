import { createClient } from "@/lib/supabase/server";
import type {
  DashboardStats,
  AnalyticsChartData,
  DeviceChartData,
} from "@/lib/types";
import StatCard from "@/components/cms/stat-card";
import RecentActivity from "@/components/cms/recent-activity";
import SystemHealth from "@/components/cms/system-health";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, Users2, MessageSquare } from "lucide-react";
import DashboardActionsWrapper from "./dashboard-actions-wrapper";
import LineChartWrapper from "@/components/cms/charts/line-chart-wrapper";
import PieChartWrapper from "@/components/cms/charts/pie-chart-wrapper";

// Ideiglenes adatok a grafikonokhoz, amíg nem adatbázisból jönnek
const analyticsChartDataSource: AnalyticsChartData[] = [
  { name: "Jan", látogatók: 400, oldalmegtekintések: 1200, visszatérők: 240 },
  { name: "Feb", látogatók: 300, oldalmegtekintések: 980, visszatérők: 221 },
  { name: "Márc", látogatók: 200, oldalmegtekintések: 720, visszatérők: 229 },
  { name: "Ápr", látogatók: 278, oldalmegtekintések: 890, visszatérők: 200 },
  { name: "Máj", látogatók: 189, oldalmegtekintések: 650, visszatérők: 218 },
  { name: "Jún", látogatók: 239, oldalmegtekintések: 820, visszatérők: 250 },
];

const deviceChartDataSource: DeviceChartData[] = [
  { name: "Desktop", value: 45, color: "#3B82F6" },
  { name: "Mobil", value: 35, color: "#10B981" },
  { name: "Tablet", value: 20, color: "#F59E0B" },
];

export default async function DashboardPage() {
  console.log("=== DASHBOARD DEBUG START ===");

  try {
    const supabase = await createClient();

    if (!supabase) {
      console.error("Supabase client not available");
      return <div>Supabase client hiba</div>;
    }

    // Posts lekérdezés
    console.log("Fetching posts...");
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("id, status, views");

    console.log("Posts result:", {
      count: postsData?.length || 0,
      error: postsError?.message || null,
      sample: postsData?.[0] || null,
    });

    // Profiles lekérdezés
    console.log("Fetching profiles...");
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, status");

    console.log("Profiles result:", {
      count: profilesData?.length || 0,
      error: profilesError?.message || null,
      sample: profilesData?.[0] || null,
    });

    // Comments lekérdezés - javított verzió
    console.log("Fetching pending comments...");
    const {
      data: commentsData,
      error: commentsError,
      count: commentsCount,
    } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: false })
      .eq("status", "pending");

    console.log("Comments result:", {
      dataCount: commentsData?.length || 0,
      returnedCount: commentsCount || 0,
      error: commentsError?.message || null,
      sample: commentsData?.[0] || null,
    });

    // Alternatív komment lekérdezés ha a count nem működik
    const { data: allCommentsData, error: allCommentsError } = await supabase
      .from("comments")
      .select("id, status");

    console.log("All comments result:", {
      total: allCommentsData?.length || 0,
      pending:
        allCommentsData?.filter((c) => c.status === "pending").length || 0,
      approved:
        allCommentsData?.filter((c) => c.status === "approved").length || 0,
      error: allCommentsError?.message || null,
    });

    if (postsError) console.error("Error fetching posts:", postsError.message);
    if (profilesError)
      console.error("Error fetching profiles:", profilesError.message);
    if (commentsError)
      console.error("Error fetching comments:", commentsError.message);

    // Statisztikák számolása
    const pendingCommentsCount =
      commentsCount ||
      commentsData?.length ||
      allCommentsData?.filter((c) => c.status === "pending").length ||
      0;

    const stats: DashboardStats = {
      totalPosts: postsData?.length || 0,
      publishedPosts:
        postsData?.filter((p) => p.status === "published").length || 0,
      draftPosts: postsData?.filter((p) => p.status === "draft").length || 0,
      totalUsers: profilesData?.length || 0,
      activeUsers:
        profilesData?.filter((u) => u.status === "active").length || 0,
      totalViews:
        postsData?.reduce((sum, post) => sum + (post.views || 0), 0) || 0,
      pendingComments: pendingCommentsCount,
    };

    console.log("Final stats:", stats);
    console.log("=== DASHBOARD DEBUG END ===");

    return (
      <div className="space-y-4 md:space-y-6">
        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          <StatCard
            title="Összes bejegyzés"
            value={stats.totalPosts}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Összes megtekintés"
            value={stats.totalViews.toLocaleString()}
            icon={Eye}
            color="green"
          />
          <StatCard
            title="Aktív felhasználók"
            value={stats.activeUsers}
            icon={Users2}
            color="purple"
          />
          <StatCard
            title="Függő kommentek"
            value={stats.pendingComments}
            icon={MessageSquare}
            color="orange"
          />
        </div>

        {/* Charts Section - Mobile-First Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          <Card className="w-full">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-lg md:text-xl">
                Látogatói statisztikák
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Chart wrapper with proper mobile dimensions */}
              <div className="w-full h-64 md:h-80">
                <LineChartWrapper data={analyticsChartDataSource} />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-lg md:text-xl">
                Eszköz megoszlás
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Chart wrapper with proper mobile dimensions */}
              <div className="w-full h-64 md:h-80">
                <PieChartWrapper data={deviceChartDataSource} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - Mobile Stack, Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Quick Actions - Full width on mobile */}
          <div className="lg:col-span-1">
            <DashboardActionsWrapper />
          </div>

          {/* Recent Activity - Stack on mobile */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>

          {/* System Health - Stack on mobile */}
          <div className="lg:col-span-1">
            <SystemHealth />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
          <h3 className="font-semibold text-red-800 text-sm md:text-base">
            Dashboard Error
          </h3>
          <p className="text-red-700 text-xs md:text-sm mt-1">
            {error instanceof Error ? error.message : "Ismeretlen hiba történt"}
          </p>
        </div>
      </div>
    );
  }
}
