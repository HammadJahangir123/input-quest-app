import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Package, Shield, Search, FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/overview");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-5xl font-bold text-foreground">
            Shop Return Item Tracker
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Efficiently manage and track all your store return items in one secure location
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="p-6 rounded-lg bg-card border text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Track Returns</h3>
            <p className="text-sm text-muted-foreground">
              Log all return items with detailed information including serial numbers and dates
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Quick Search</h3>
            <p className="text-sm text-muted-foreground">
              Find return items instantly by brand, location, store code, or receiver name
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Secure Access</h3>
            <p className="text-sm text-muted-foreground">
              Your data is protected with authentication and secure cloud storage
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Detailed Records</h3>
            <p className="text-sm text-muted-foreground">
              Store comprehensive information about each return including equipment details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
