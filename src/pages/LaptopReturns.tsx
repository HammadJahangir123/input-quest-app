import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, LogOut, Laptop } from "lucide-react";
import { toast } from "sonner";
import { SearchBar } from "@/components/SearchBar";
import { LaptopReturnForm } from "@/components/LaptopReturnForm";
import { LaptopReturnsTable } from "@/components/LaptopReturnsTable";

const LaptopReturns = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setRefreshKey(prev => prev + 1);
    toast.success("Laptop return saved successfully");
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
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-12 border-b bg-card flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <Laptop className="h-4 w-4 text-primary" />
                <h1 className="text-sm font-semibold">Laptop Returns</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {session.user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Toolbar */}
          <div className="h-10 border-b bg-muted/30 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="default"
                className="h-7 text-xs"
                onClick={() => setShowForm(!showForm)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                New Laptop Return
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Refresh
              </Button>
            </div>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Content */}
          <main className="flex-1 p-4 space-y-4 overflow-auto">
            {showForm && (
              <LaptopReturnForm
                onSuccess={handleFormSuccess}
                onCancel={() => setShowForm(false)}
              />
            )}
            <LaptopReturnsTable searchQuery={searchQuery} refreshKey={refreshKey} />
          </main>

          {/* Footer */}
          <footer className="h-8 border-t bg-muted/30 flex items-center justify-between px-4 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Return Tracker</span>
            <span>Powered by Hammad Jahangir</span>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LaptopReturns;
