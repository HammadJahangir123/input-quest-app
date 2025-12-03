import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";

const returnItemSchema = z.object({
  return_date: z.string().trim().nonempty({ message: "Return date is required" }),
  brand_name: z.string().trim().nonempty({ message: "Brand name is required" }).max(255),
  store_code: z.string().trim().max(100).optional(),
  shop_location: z.string().trim().max(255).optional(),
  canon_printer_sn: z.string().trim().max(100).optional(),
  canon_printer_model: z.string().trim().max(100).optional(),
  receipt_printer_sn: z.string().trim().max(100).optional(),
  receipt_printer_model: z.string().trim().max(100).optional(),
  usb_hub: z.string().trim().max(100).optional(),
  keyboard: z.string().trim().max(100).optional(),
  mouse: z.string().trim().max(100).optional(),
  scanner: z.string().trim().max(100).optional(),
  other_1: z.string().trim().max(255).optional(),
  other_2: z.string().trim().max(255).optional(),
  receiver_signature: z.string().trim().max(255).optional(),
  remark: z.string().trim().max(500).optional(),
});

interface ReturnItemFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ReturnItemForm = ({ onSuccess, onCancel }: ReturnItemFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    return_date: new Date().toISOString().split('T')[0],
    brand_name: "",
    store_code: "",
    shop_location: "",
    canon_printer_sn: "",
    canon_printer_model: "",
    receipt_printer_sn: "",
    receipt_printer_model: "",
    usb_hub: "",
    keyboard: "",
    mouse: "",
    scanner: "",
    other_1: "",
    other_2: "",
    receiver_signature: "",
    remark: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validated = returnItemSchema.parse(formData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to add return items");
        return;
      }

      const { error } = await supabase.from("return_items").insert([
        {
          return_date: validated.return_date,
          brand_name: validated.brand_name,
          store_code: validated.store_code || null,
          shop_location: validated.shop_location || null,
          canon_printer_sn: validated.canon_printer_sn || null,
          canon_printer_model: validated.canon_printer_model || null,
          receipt_printer_sn: validated.receipt_printer_sn || null,
          receipt_printer_model: validated.receipt_printer_model || null,
          usb_hub: validated.usb_hub || null,
          keyboard: validated.keyboard || null,
          mouse: validated.mouse || null,
          scanner: validated.scanner || null,
          other_1: validated.other_1 || null,
          other_2: validated.other_2 || null,
          receiver_signature: validated.receiver_signature || null,
          remark: validated.remark || null,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      setFormData({
        return_date: new Date().toISOString().split('T')[0],
        brand_name: "",
        store_code: "",
        shop_location: "",
        canon_printer_sn: "",
        canon_printer_model: "",
        receipt_printer_sn: "",
        receipt_printer_model: "",
        usb_hub: "",
        keyboard: "",
        mouse: "",
        scanner: "",
        other_1: "",
        other_2: "",
        receiver_signature: "",
        remark: "",
      });
      
      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to save return item");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Create Return Item</CardTitle>
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
              <Label htmlFor="brand_name" className="text-xs font-medium">Brand Name *</Label>
              <Input
                id="brand_name"
                value={formData.brand_name}
                onChange={(e) => handleChange("brand_name", e.target.value)}
                required
                disabled={isLoading}
                className="h-9"
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
              <Label htmlFor="shop_location" className="text-xs font-medium">Shop Location</Label>
              <Input
                id="shop_location"
                value={formData.shop_location}
                onChange={(e) => handleChange("shop_location", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="canon_printer_sn" className="text-xs font-medium">Canon Printer S/N</Label>
              <Input
                id="canon_printer_sn"
                value={formData.canon_printer_sn}
                onChange={(e) => handleChange("canon_printer_sn", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="canon_printer_model" className="text-xs font-medium">Canon Printer Model</Label>
              <Input
                id="canon_printer_model"
                value={formData.canon_printer_model}
                onChange={(e) => handleChange("canon_printer_model", e.target.value)}
                disabled={isLoading}
                className="h-9"
                placeholder="e.g., PIXMA G3010"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="receipt_printer_sn" className="text-xs font-medium">Receipt Printer S/N</Label>
              <Input
                id="receipt_printer_sn"
                value={formData.receipt_printer_sn}
                onChange={(e) => handleChange("receipt_printer_sn", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="receipt_printer_model" className="text-xs font-medium">Receipt Printer Model</Label>
              <Input
                id="receipt_printer_model"
                value={formData.receipt_printer_model}
                onChange={(e) => handleChange("receipt_printer_model", e.target.value)}
                disabled={isLoading}
                className="h-9"
                placeholder="e.g., TM-T82III"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="usb_hub" className="text-xs font-medium">USB Hub</Label>
              <Input
                id="usb_hub"
                value={formData.usb_hub}
                onChange={(e) => handleChange("usb_hub", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="keyboard" className="text-xs font-medium">Keyboard</Label>
              <Input
                id="keyboard"
                value={formData.keyboard}
                onChange={(e) => handleChange("keyboard", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mouse" className="text-xs font-medium">Mouse</Label>
              <Input
                id="mouse"
                value={formData.mouse}
                onChange={(e) => handleChange("mouse", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="scanner" className="text-xs font-medium">Scanner</Label>
              <Input
                id="scanner"
                value={formData.scanner}
                onChange={(e) => handleChange("scanner", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="other_1" className="text-xs font-medium">Other</Label>
              <Input
                id="other_1"
                value={formData.other_1}
                onChange={(e) => handleChange("other_1", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="other_2" className="text-xs font-medium">Other</Label>
              <Input
                id="other_2"
                value={formData.other_2}
                onChange={(e) => handleChange("other_2", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="receiver_signature" className="text-xs font-medium">Receiver Signature/Name</Label>
              <Input
                id="receiver_signature"
                value={formData.receiver_signature}
                onChange={(e) => handleChange("receiver_signature", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5 md:col-span-3">
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