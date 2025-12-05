import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Settings, Users, Package2, TrendingUp, Activity, Laptop, Battery, BatteryWarning, MapPin } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalReturns: 0,
    thisMonth: 0,
    thisWeek: 0,
    activeStores: 0,
    topBrands: [] as { brand: string; count: number }[],
  });
  const [laptopStats, setLaptopStats] = useState({
    totalLaptops: 0,
    thisMonth: 0,
    thisWeek: 0,
    withCharger: 0,
    withoutCharger: 0,
    topBrands: [] as { brand: string; count: number }[],
    topLocations: [] as { location: string; count: number }[],
  });

  useEffect(() => {
    checkAuth();
    fetchStats();
    fetchLaptopStats();
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

  const fetchLaptopStats = async () => {
    try {
      const { count: totalLaptops } = await supabase
        .from("laptop_returns")
        .select("*", { count: "exact", head: true });

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count: thisMonth } = await supabase
        .from("laptop_returns")
        .select("*", { count: "exact", head: true })
        .gte("return_date", startOfMonth.toISOString());

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const { count: thisWeek } = await supabase
        .from("laptop_returns")
        .select("*", { count: "exact", head: true })
        .gte("return_date", startOfWeek.toISOString());

      const { data: laptops } = await supabase
        .from("laptop_returns")
        .select("brand, has_charger, location");

      const withCharger = laptops?.filter(l => l.has_charger).length || 0;
      const withoutCharger = laptops?.filter(l => !l.has_charger).length || 0;

      const brandCounts = laptops?.reduce((acc, item) => {
        acc[item.brand] = (acc[item.brand] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topBrands = Object.entries(brandCounts || {})
        .map(([brand, count]) => ({ brand, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const locationCounts = laptops?.reduce((acc, item) => {
        const loc = item.location || 'Unknown';
        acc[loc] = (acc[loc] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topLocations = Object.entries(locationCounts || {})
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setLaptopStats({
        totalLaptops: totalLaptops || 0,
        thisMonth: thisMonth || 0,
        thisWeek: thisWeek || 0,
        withCharger,
        withoutCharger,
        topBrands,
        topLocations,
      });
    } catch (error) {
      toast.error("Failed to load laptop statistics");
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
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="laptop-stats">Laptop Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
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
                              Total Laptops
                            </CardTitle>
                            <Laptop className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold tracking-tight">{laptopStats.totalLaptops}</div>
                          <p className="text-xs text-muted-foreground mt-1">All time</p>
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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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

                      <Card className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate("/laptop-returns")}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-chart-3/10">
                              <Laptop className="h-6 w-6 text-chart-3" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold">Laptop Returns</div>
                              <div className="text-xs text-muted-foreground">Manage laptops</div>
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
                            <div className="p-3 rounded-lg bg-chart-4/10">
                              <BarChart3 className="h-6 w-6 text-chart-4" />
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
                            <div className="p-3 rounded-lg bg-chart-5/10">
                              <Settings className="h-6 w-6 text-chart-5" />
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
                </TabsContent>

                <TabsContent value="laptop-stats" className="space-y-6">
                  {/* Laptop KPIs */}
                  <div>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Laptop Statistics
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card className="border-l-4 border-l-chart-1">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                              Total Laptops
                            </CardTitle>
                            <Laptop className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold tracking-tight">{laptopStats.totalLaptops}</div>
                          <p className="text-xs text-muted-foreground mt-1">All time</p>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-chart-2">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                              This Month
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold tracking-tight">{laptopStats.thisMonth}</div>
                          <p className="text-xs text-muted-foreground mt-1">Laptops</p>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                              With Charger
                            </CardTitle>
                            <Battery className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold tracking-tight">{laptopStats.withCharger}</div>
                          <p className="text-xs text-muted-foreground mt-1">Laptops</p>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                              Without Charger
                            </CardTitle>
                            <BatteryWarning className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold tracking-tight">{laptopStats.withoutCharger}</div>
                          <p className="text-xs text-muted-foreground mt-1">Laptops</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Top Laptop Brands and Locations */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Top Laptop Brands
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
                                    Brand
                                  </th>
                                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Count
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {laptopStats.topBrands.length > 0 ? (
                                  laptopStats.topBrands.map((brand, index) => (
                                    <tr key={brand.brand} className="border-b hover:bg-muted/30 transition-colors">
                                      <td className="px-6 py-4 text-sm font-medium">{index + 1}</td>
                                      <td className="px-6 py-4 text-sm font-semibold">{brand.brand}</td>
                                      <td className="px-6 py-4 text-sm text-right">{brand.count}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-sm text-muted-foreground">
                                      No laptop data available
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Top Locations
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
                                    Location
                                  </th>
                                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Count
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {laptopStats.topLocations.length > 0 ? (
                                  laptopStats.topLocations.map((loc, index) => (
                                    <tr key={loc.location} className="border-b hover:bg-muted/30 transition-colors">
                                      <td className="px-6 py-4 text-sm font-medium">{index + 1}</td>
                                      <td className="px-6 py-4 text-sm font-semibold">{loc.location}</td>
                                      <td className="px-6 py-4 text-sm text-right">{loc.count}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-sm text-muted-foreground">
                                      No location data available
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
                </TabsContent>
              </Tabs>
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