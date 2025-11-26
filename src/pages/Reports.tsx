import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, Calendar, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportStats {
  totalReturns: number;
  thisMonth: number;
  thisWeek: number;
  byBrand: { brand_name: string; count: number }[];
}

const Reports = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const { data: allReturns, error } = await supabase
        .from("return_items")
        .select("*");

      if (error) throw error;

      if (allReturns) {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

        const thisMonth = allReturns.filter(
          (item) => new Date(item.created_at) >= firstDayOfMonth
        ).length;

        const thisWeek = allReturns.filter(
          (item) => new Date(item.created_at) >= firstDayOfWeek
        ).length;

        const brandCounts = allReturns.reduce((acc, item) => {
          acc[item.brand_name] = (acc[item.brand_name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const byBrand = Object.entries(brandCounts)
          .map(([brand_name, count]) => ({ brand_name, count }))
          .sort((a, b) => b.count - a.count);

        setStats({
          totalReturns: allReturns.length,
          thisMonth,
          thisWeek,
          byBrand,
        });
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Return Items Report</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Returns
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReturns || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.thisMonth || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.thisWeek || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Brands
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.byBrand.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Returns by Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.byBrand.map((brand) => (
              <div key={brand.brand_name} className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">{brand.brand_name}</span>
                <span className="text-muted-foreground">{brand.count} returns</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
