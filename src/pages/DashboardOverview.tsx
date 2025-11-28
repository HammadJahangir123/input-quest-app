import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Settings, Users, Package2, TrendingUp, Activity } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalReturns: 0,
    thisMonth: 0,
    thisWeek: 0,
    activeStores: 0,
    topBrands: [] as { brand: string; count: number }[],
  });

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchStats = async () => {
    try {
      const { count: totalReturns } = await supabase
        .from("return_items")
        .select("*", { count: "exact", head: true });

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count: thisMonth } = await supabase
        .from("return_items")
        .select("*", { count: "exact", head: true })
        .gte("return_date", startOfMonth.toISOString());

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const { count: thisWeek } = await supabase
        .from("return_items")
        .select("*", { count: "exact", head: true })
        .gte("return_date", startOfWeek.toISOString());

      const { data: stores } = await supabase
        .from("return_items")
        .select("store_code")
        .not("store_code", "is", null);

      const uniqueStores = new Set(stores?.map(s => s.store_code)).size;

      const { data: brands } = await supabase
        .from("return_items")
        .select("brand_name");

      const brandCounts = brands?.reduce((acc, item) => {
        acc[item.brand_name] = (acc[item.brand_name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topBrands = Object.entries(brandCounts || {})
        .map(([brand, count]) => ({ brand, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalReturns: totalReturns || 0,
        thisMonth: thisMonth || 0,
        thisWeek: thisWeek || 0,
        activeStores: uniqueStores,
        topBrands,
      });
    } catch (error) {
      toast.error("Failed to load statistics");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/10">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 bg-background border-b">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-sm font-semibold">Dashboard Overview</h1>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {/* Key Performance Indicators */}
              <div>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Key Performance Indicators
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="border-l-4 border-l-primary">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                          Total Returns
                        </CardTitle>
                        <Package2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold tracking-tight">{stats.totalReturns}</div>
                      <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-chart-2">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                          Current Month
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold tracking-tight">{stats.thisMonth}</div>
                      <p className="text-xs text-muted-foreground mt-1">Returns</p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-chart-3">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                          Current Week
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold tracking-tight">{stats.thisWeek}</div>
                      <p className="text-xs text-muted-foreground mt-1">Returns</p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-chart-4">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                          Active Stores
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold tracking-tight">{stats.activeStores}</div>
                      <p className="text-xs text-muted-foreground mt-1">Locations</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Quick Actions
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate("/dashboard")}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Package2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Return Items</div>
                          <div className="text-xs text-muted-foreground">Manage returns</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate("/reports")}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-chart-2/10">
                          <FileText className="h-6 w-6 text-chart-2" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Reports</div>
                          <div className="text-xs text-muted-foreground">View reports</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate("/analytics")}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-chart-3/10">
                          <BarChart3 className="h-6 w-6 text-chart-3" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Analytics</div>
                          <div className="text-xs text-muted-foreground">View analytics</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate("/settings")}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-chart-4/10">
                          <Settings className="h-6 w-6 text-chart-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Settings</div>
                          <div className="text-xs text-muted-foreground">Configure system</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Top Brands Analysis */}
              <div>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Top Brands by Return Volume
                </h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Rank
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Brand Name
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Return Count
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Percentage
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.topBrands.length > 0 ? (
                            stats.topBrands.map((brand, index) => (
                              <tr key={brand.brand} className="border-b hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold">
                                  {brand.brand}
                                </td>
                                <td className="px-6 py-4 text-sm text-right">
                                  {brand.count}
                                </td>
                                <td className="px-6 py-4 text-sm text-right text-muted-foreground">
                                  {stats.totalReturns > 0 ? ((brand.count / stats.totalReturns) * 100).toFixed(1) : 0}%
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-sm text-muted-foreground">
                                No return data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>

          <footer className="bg-background border-t px-4 py-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>System Status: Operational</span>
              <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardOverview;
