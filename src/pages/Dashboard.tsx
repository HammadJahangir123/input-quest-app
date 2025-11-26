import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";
import { toast } from "sonner";
import { ReturnItemForm } from "@/components/ReturnItemForm";
import { ReturnItemsTable } from "@/components/ReturnItemsTable";
import { SearchBar } from "@/components/SearchBar";

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

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Shop Return Item Tracker</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? "Hide Form" : "Add Return Item"}
          </Button>
        </div>

        {showForm && (
          <ReturnItemForm 
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        )}

        <ReturnItemsTable searchQuery={searchQuery} key={refreshKey} />
      </main>
    </div>
  );
};

export default Dashboard;