import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";

const laptopReturnSchema = z.object({
  return_date: z.string().trim().nonempty({ message: "Return date is required" }),
  brand: z.string().trim().nonempty({ message: "Brand is required" }).max(255),
  store_code: z.string().trim().max(100).optional(),
  location: z.string().trim().max(255).optional(),
  laptop_model: z.string().trim().nonempty({ message: "Laptop model is required" }).max(255),
  serial_number: z.string().trim().nonempty({ message: "Serial number is required" }).max(100),
  has_charger: z.boolean(),
  remark: z.string().trim().max(500).optional(),
});

interface LaptopReturnFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const LaptopReturnForm = ({ onSuccess, onCancel }: LaptopReturnFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    return_date: new Date().toISOString().split('T')[0],
    brand: "",
    store_code: "",
    location: "",
    laptop_model: "",
    serial_number: "",
    has_charger: true,
    remark: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validated = laptopReturnSchema.parse(formData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to add laptop returns");
        return;
      }

      const { error } = await supabase.from("laptop_returns").insert([
        {
          return_date: validated.return_date,
          brand: validated.brand,
          store_code: validated.store_code || null,
          location: validated.location || null,
          laptop_model: validated.laptop_model,
          serial_number: validated.serial_number,
          has_charger: validated.has_charger,
          remark: validated.remark || null,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      setFormData({
        return_date: new Date().toISOString().split('T')[0],
        brand: "",
        store_code: "",
        location: "",
        laptop_model: "",
        serial_number: "",
        has_charger: true,
        remark: "",
      });
      
      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to save laptop return");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Create Laptop Return</CardTitle>
          <span className="text-xs text-muted-foreground">* Required fields</span>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="return_date" className="text-xs font-medium">Return Date *</Label>
              <Input
                id="return_date"
                type="date"
                value={formData.return_date}
                onChange={(e) => handleChange("return_date", e.target.value)}
                required
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brand" className="text-xs font-medium">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                required
                disabled={isLoading}
                className="h-9"
                placeholder="e.g., Dell, HP, Lenovo"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="store_code" className="text-xs font-medium">Store Code</Label>
              <Input
                id="store_code"
                value={formData.store_code}
                onChange={(e) => handleChange("store_code", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-medium">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="laptop_model" className="text-xs font-medium">Laptop Model *</Label>
              <Input
                id="laptop_model"
                value={formData.laptop_model}
                onChange={(e) => handleChange("laptop_model", e.target.value)}
                required
                disabled={isLoading}
                className="h-9"
                placeholder="e.g., Latitude 5520"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="serial_number" className="text-xs font-medium">Serial Number *</Label>
              <Input
                id="serial_number"
                value={formData.serial_number}
                onChange={(e) => handleChange("serial_number", e.target.value)}
                required
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Charger Status</Label>
              <div className="flex items-center space-x-2 h-9">
                <Switch
                  id="has_charger"
                  checked={formData.has_charger}
                  onCheckedChange={(checked) => handleChange("has_charger", checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="has_charger" className="text-xs">
                  {formData.has_charger ? "With Charger" : "Without Charger"}
                </Label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="remark" className="text-xs font-medium">Remark</Label>
              <Input
                id="remark"
                value={formData.remark}
                onChange={(e) => handleChange("remark", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t">
            <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
