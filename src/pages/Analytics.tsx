import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Laptop, Battery } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ReturnItem {
  created_at: string;
  brand_name: string;
}

interface LaptopReturn {
  created_at: string;
  brand: string;
  has_charger: boolean;
  location: string | null;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const Analytics = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [brandData, setBrandData] = useState<any[]>([]);
  const [laptopMonthlyData, setLaptopMonthlyData] = useState<any[]>([]);
  const [laptopBrandData, setLaptopBrandData] = useState<any[]>([]);
  const [chargerData, setChargerData] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch return items
      const { data: returns, error } = await supabase
        .from("return_items")
        .select("created_at, brand_name")
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (returns) {
        const monthCounts: Record<string, number> = {};
        returns.forEach((item: ReturnItem) => {
          const date = new Date(item.created_at);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
        });

        const monthly = Object.entries(monthCounts)
          .map(([month, count]) => ({ month, returns: count }))
          .slice(-6);

        setMonthlyData(monthly);

        const brandCounts: Record<string, number> = {};
        returns.forEach((item: ReturnItem) => {
          brandCounts[item.brand_name] = (brandCounts[item.brand_name] || 0) + 1;
        });

        const brands = Object.entries(brandCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setBrandData(brands);
      }

      // Fetch laptop returns
      const { data: laptops, error: laptopError } = await supabase
        .from("laptop_returns")
        .select("created_at, brand, has_charger, location")
        .order("created_at", { ascending: true });

      if (laptopError) throw laptopError;

      if (laptops) {
        // Monthly laptop data
        const monthCounts: Record<string, number> = {};
        laptops.forEach((item: LaptopReturn) => {
          const date = new Date(item.created_at);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
        });

        const monthly = Object.entries(monthCounts)
          .map(([month, count]) => ({ month, laptops: count }))
          .slice(-6);

        setLaptopMonthlyData(monthly);

        // Brand data for laptops
        const brandCounts: Record<string, number> = {};
        laptops.forEach((item: LaptopReturn) => {
          brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
        });

        const brands = Object.entries(brandCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setLaptopBrandData(brands);

        // Charger status data
        const withCharger = laptops.filter((item: LaptopReturn) => item.has_charger).length;
        const withoutCharger = laptops.filter((item: LaptopReturn) => !item.has_charger).length;
        setChargerData([
          { name: 'With Charger', value: withCharger },
          { name: 'Without Charger', value: withoutCharger },
        ]);

        // Location data
        const locationCounts: Record<string, number> = {};
        laptops.forEach((item: LaptopReturn) => {
          const loc = item.location || 'Unknown';
          locationCounts[loc] = (locationCounts[loc] || 0) + 1;
        });

        const locations = Object.entries(locationCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setLocationData(locations);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
      </div>

      <Tabs defaultValue="return-items" className="space-y-6">
        <TabsList>
          <TabsTrigger value="return-items">Return Items</TabsTrigger>
          <TabsTrigger value="laptop-returns">Laptop Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="return-items" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Return Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="returns" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Brands by Return Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={brandData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="laptop-returns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Laptop Return Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={laptopMonthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="laptops" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="h-5 w-5" />
                  Charger Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chargerData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chargerData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Laptop className="h-5 w-5" />
                  Top Laptop Brands
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={laptopBrandData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="hsl(var(--chart-3))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Laptops by Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={locationData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="hsl(var(--chart-4))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;