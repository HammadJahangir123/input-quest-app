import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Application Settings
          </CardTitle>
          <CardDescription>
            Configure your application preferences and settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Settings functionality coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
