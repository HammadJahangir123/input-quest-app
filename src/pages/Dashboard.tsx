import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Download, Upload, Filter, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ReturnItemForm } from "@/components/ReturnItemForm";
import { ReturnItemsTable } from "@/components/ReturnItemsTable";
import { SearchBar } from "@/components/SearchBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setRefreshKey(prev => prev + 1);
    toast.success("Return item saved successfully!");
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.success("Data refreshed");
  };

  if (!session) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/10">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Application Bar */}
          <header className="sticky top-0 z-10 bg-background border-b">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-sm font-semibold">Return Item Management</h1>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </header>

          {/* Toolbar */}
          <div className="bg-background border-b">
            <div className="flex items-center gap-2 px-4 py-3">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <Separator orientation="vertical" className="h-8" />
              <Button
                variant={showForm ? "secondary" : "default"}
                size="sm"
                onClick={() => setShowForm(!showForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 space-y-4">
            {showForm && (
              <ReturnItemForm 
                onSuccess={handleFormSuccess}
                onCancel={() => setShowForm(false)}
              />
            )}

            <ReturnItemsTable searchQuery={searchQuery} key={refreshKey} />
          </main>

          {/* Status Bar */}
          <footer className="bg-background border-t px-4 py-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Ready</span>
              <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;