import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

interface ReturnItem {
  id: string;
  return_date: string;
  brand_name: string;
  store_code: string | null;
  shop_location: string | null;
  canon_printer_sn: string | null;
  canon_printer_model: string | null;
  receipt_printer_sn: string | null;
  receipt_printer_model: string | null;
  usb_hub: string | null;
  keyboard: string | null;
  mouse: string | null;
  scanner: string | null;
  other_1: string | null;
  other_2: string | null;
  receiver_signature: string | null;
  remark: string | null;
}

interface EditReturnItemFormProps {
  item: ReturnItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditReturnItemForm = ({ item, open, onOpenChange, onSuccess }: EditReturnItemFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    return_date: "",
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

  useEffect(() => {
    if (item) {
      setFormData({
        return_date: item.return_date,
        brand_name: item.brand_name,
        store_code: item.store_code || "",
        shop_location: item.shop_location || "",
        canon_printer_sn: item.canon_printer_sn || "",
        canon_printer_model: item.canon_printer_model || "",
        receipt_printer_sn: item.receipt_printer_sn || "",
        receipt_printer_model: item.receipt_printer_model || "",
        usb_hub: item.usb_hub || "",
        keyboard: item.keyboard || "",
        mouse: item.mouse || "",
        scanner: item.scanner || "",
        other_1: item.other_1 || "",
        other_2: item.other_2 || "",
        receiver_signature: item.receiver_signature || "",
        remark: item.remark || "",
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    setIsLoading(true);

    try {
      const validated = returnItemSchema.parse(formData);

      const { error } = await supabase
        .from("return_items")
        .update({
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
        })
        .eq("id", item.id);

      if (error) throw error;

      toast.success("Return item updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to update return item");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Return Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
              <Label htmlFor="edit_brand_name" className="text-xs font-medium">Brand Name *</Label>
              <Input
                id="edit_brand_name"
                value={formData.brand_name}
                onChange={(e) => handleChange("brand_name", e.target.value)}
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
              <Label htmlFor="edit_shop_location" className="text-xs font-medium">Shop Location</Label>
              <Input
                id="edit_shop_location"
                value={formData.shop_location}
                onChange={(e) => handleChange("shop_location", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_canon_printer_sn" className="text-xs font-medium">Canon Printer S/N</Label>
              <Input
                id="edit_canon_printer_sn"
                value={formData.canon_printer_sn}
                onChange={(e) => handleChange("canon_printer_sn", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_canon_printer_model" className="text-xs font-medium">Canon Printer Model</Label>
              <Input
                id="edit_canon_printer_model"
                value={formData.canon_printer_model}
                onChange={(e) => handleChange("canon_printer_model", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_receipt_printer_sn" className="text-xs font-medium">Receipt Printer S/N</Label>
              <Input
                id="edit_receipt_printer_sn"
                value={formData.receipt_printer_sn}
                onChange={(e) => handleChange("receipt_printer_sn", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_receipt_printer_model" className="text-xs font-medium">Receipt Printer Model</Label>
              <Input
                id="edit_receipt_printer_model"
                value={formData.receipt_printer_model}
                onChange={(e) => handleChange("receipt_printer_model", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_usb_hub" className="text-xs font-medium">USB Hub</Label>
              <Input
                id="edit_usb_hub"
                value={formData.usb_hub}
                onChange={(e) => handleChange("usb_hub", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_keyboard" className="text-xs font-medium">Keyboard</Label>
              <Input
                id="edit_keyboard"
                value={formData.keyboard}
                onChange={(e) => handleChange("keyboard", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_mouse" className="text-xs font-medium">Mouse</Label>
              <Input
                id="edit_mouse"
                value={formData.mouse}
                onChange={(e) => handleChange("mouse", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_scanner" className="text-xs font-medium">Scanner</Label>
              <Input
                id="edit_scanner"
                value={formData.scanner}
                onChange={(e) => handleChange("scanner", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_other_1" className="text-xs font-medium">Other</Label>
              <Input
                id="edit_other_1"
                value={formData.other_1}
                onChange={(e) => handleChange("other_1", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_other_2" className="text-xs font-medium">Other</Label>
              <Input
                id="edit_other_2"
                value={formData.other_2}
                onChange={(e) => handleChange("other_2", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_receiver_signature" className="text-xs font-medium">Receiver Signature/Name</Label>
              <Input
                id="edit_receiver_signature"
                value={formData.receiver_signature}
                onChange={(e) => handleChange("receiver_signature", e.target.value)}
                disabled={isLoading}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
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
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
