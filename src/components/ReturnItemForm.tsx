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
  receipt_printer_sn: z.string().trim().max(100).optional(),
  usb_hub: z.string().trim().max(100).optional(),
  keyboard: z.string().trim().max(100).optional(),
  mouse: z.string().trim().max(100).optional(),
  other_1: z.string().trim().max(255).optional(),
  other_2: z.string().trim().max(255).optional(),
  receiver_signature: z.string().trim().max(255).optional(),
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
    receipt_printer_sn: "",
    usb_hub: "",
    keyboard: "",
    mouse: "",
    other_1: "",
    other_2: "",
    receiver_signature: "",
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
          receipt_printer_sn: validated.receipt_printer_sn || null,
          usb_hub: validated.usb_hub || null,
          keyboard: validated.keyboard || null,
          mouse: validated.mouse || null,
          other_1: validated.other_1 || null,
          other_2: validated.other_2 || null,
          receiver_signature: validated.receiver_signature || null,
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
        receipt_printer_sn: "",
        usb_hub: "",
        keyboard: "",
        mouse: "",
        other_1: "",
        other_2: "",
        receiver_signature: "",
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
    <Card>
      <CardHeader>
        <CardTitle>Add Return Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="return_date">Return Date *</Label>
              <Input
                id="return_date"
                type="date"
                value={formData.return_date}
                onChange={(e) => handleChange("return_date", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand_name">Brand Name *</Label>
              <Input
                id="brand_name"
                value={formData.brand_name}
                onChange={(e) => handleChange("brand_name", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store_code">Store Code</Label>
              <Input
                id="store_code"
                value={formData.store_code}
                onChange={(e) => handleChange("store_code", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shop_location">Shop Location</Label>
              <Input
                id="shop_location"
                value={formData.shop_location}
                onChange={(e) => handleChange("shop_location", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="canon_printer_sn">Canon Printer S/N</Label>
              <Input
                id="canon_printer_sn"
                value={formData.canon_printer_sn}
                onChange={(e) => handleChange("canon_printer_sn", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt_printer_sn">Receipt Printer S/N</Label>
              <Input
                id="receipt_printer_sn"
                value={formData.receipt_printer_sn}
                onChange={(e) => handleChange("receipt_printer_sn", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usb_hub">USB Hub</Label>
              <Input
                id="usb_hub"
                value={formData.usb_hub}
                onChange={(e) => handleChange("usb_hub", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyboard">Keyboard</Label>
              <Input
                id="keyboard"
                value={formData.keyboard}
                onChange={(e) => handleChange("keyboard", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mouse">Mouse</Label>
              <Input
                id="mouse"
                value={formData.mouse}
                onChange={(e) => handleChange("mouse", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="other_1">Other</Label>
              <Input
                id="other_1"
                value={formData.other_1}
                onChange={(e) => handleChange("other_1", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="other_2">Other</Label>
              <Input
                id="other_2"
                value={formData.other_2}
                onChange={(e) => handleChange("other_2", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiver_signature">Receiver Signature/Name</Label>
              <Input
                id="receiver_signature"
                value={formData.receiver_signature}
                onChange={(e) => handleChange("receiver_signature", e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Return Item"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};