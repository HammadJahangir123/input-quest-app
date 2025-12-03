import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface LaptopReturn {
  id: string;
  return_date: string;
  brand: string;
  store_code: string | null;
  location: string | null;
  laptop_model: string;
  serial_number: string;
  has_charger: boolean;
  remark: string | null;
}

interface EditLaptopReturnFormProps {
  item: LaptopReturn | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditLaptopReturnForm = ({ item, open, onOpenChange, onSuccess }: EditLaptopReturnFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    return_date: "",
    brand: "",
    store_code: "",
    location: "",
    laptop_model: "",
    serial_number: "",
    has_charger: true,
    remark: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        return_date: item.return_date,
        brand: item.brand,
        store_code: item.store_code || "",
        location: item.location || "",
        laptop_model: item.laptop_model,
        serial_number: item.serial_number,
        has_charger: item.has_charger,
        remark: item.remark || "",
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    setIsLoading(true);

    try {
      const validated = laptopReturnSchema.parse(formData);

      const { error } = await supabase
        .from("laptop_returns")
        .update({
          return_date: validated.return_date,
          brand: validated.brand,
          store_code: validated.store_code || null,
          location: validated.location || null,
          laptop_model: validated.laptop_model,
          serial_number: validated.serial_number,
          has_charger: validated.has_charger,
          remark: validated.remark || null,
        })
        .eq("id", item.id);

      if (error) throw error;

      toast.success("Laptop return updated successfully");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to update laptop return");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Laptop Return</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit_return_date" className="text-xs font-medium">Return Date *</Label>
              <Input
                id="edit_return_date"
                type="date"
                value={formData.return_date}
                onChange={(e) => handleChange("return_date", e.target.value)}
                required
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_brand" className="text-xs font-medium">Brand *</Label>
              <Input
                id="edit_brand"
                value={formData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                required
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_store_code" className="text-xs font-medium">Store Code</Label>
              <Input
                id="edit_store_code"
                value={formData.store_code}
                onChange={(e) => handleChange("store_code", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_location" className="text-xs font-medium">Location</Label>
              <Input
                id="edit_location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_laptop_model" className="text-xs font-medium">Laptop Model *</Label>
              <Input
                id="edit_laptop_model"
                value={formData.laptop_model}
                onChange={(e) => handleChange("laptop_model", e.target.value)}
                required
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_serial_number" className="text-xs font-medium">Serial Number *</Label>
              <Input
                id="edit_serial_number"
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
                  id="edit_has_charger"
                  checked={formData.has_charger}
                  onCheckedChange={(checked) => handleChange("has_charger", checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="edit_has_charger" className="text-xs">
                  {formData.has_charger ? "With Charger" : "Without Charger"}
                </Label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_remark" className="text-xs font-medium">Remark</Label>
              <Input
                id="edit_remark"
                value={formData.remark}
                onChange={(e) => handleChange("remark", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
