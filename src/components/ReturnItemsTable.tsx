import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Download } from "lucide-react";
import { toast } from "sonner";
import { PrintReceiving } from "./PrintReceiving";
import { EditReturnItemForm } from "./EditReturnItemForm";
import { TableSkeleton } from "./ui/loading-skeleton";
import * as XLSX from "xlsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface FilterValues {
  brandName: string;
  storeCode: string;
  dateFrom: string;
  dateTo: string;
}

interface ReturnItemsTableProps {
  searchQuery: string;
  filters?: FilterValues;
}

export const ReturnItemsTable = ({ searchQuery, filters }: ReturnItemsTableProps) => {
  const [items, setItems] = useState<ReturnItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<ReturnItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, [searchQuery, filters]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("return_items")
        .select("*")
        .order("return_date", { ascending: false });

      if (searchQuery) {
        query = query.or(`brand_name.ilike.%${searchQuery}%,store_code.ilike.%${searchQuery}%,shop_location.ilike.%${searchQuery}%,receiver_signature.ilike.%${searchQuery}%,remark.ilike.%${searchQuery}%`);
      }

      // Apply filters
      if (filters?.brandName) {
        query = query.eq("brand_name", filters.brandName);
      }
      if (filters?.storeCode) {
        query = query.eq("store_code", filters.storeCode);
      }
      if (filters?.dateFrom) {
        query = query.gte("return_date", filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte("return_date", filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      toast.error("Failed to load return items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("return_items")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      setItems(items.filter((item) => item.id !== deleteId));
      toast.success("Return item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete return item");
    } finally {
      setDeleteId(null);
    }
  };

  const handleExportToExcel = () => {
    const exportData = items.map(item => ({
      "Return Date": new Date(item.return_date).toLocaleDateString(),
      "Brand": item.brand_name,
      "Store Code": item.store_code || "-",
      "Location": item.shop_location || "-",
      "Canon S/N": item.canon_printer_sn || "-",
      "Canon Model": item.canon_printer_model || "-",
      "Receipt S/N": item.receipt_printer_sn || "-",
      "Receipt Model": item.receipt_printer_model || "-",
      "USB Hub": item.usb_hub || "-",
      "Keyboard": item.keyboard || "-",
      "Mouse": item.mouse || "-",
      "Scanner": item.scanner || "-",
      "Other 1": item.other_1 || "-",
      "Other 2": item.other_2 || "-",
      "Receiver": item.receiver_signature || "-",
      "Remark": item.remark || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Return Items");
    XLSX.writeFile(wb, `return_items_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Exported to Excel successfully");
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            {searchQuery ? "No return items found matching your search" : "No return items yet. Add your first return item above."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Return Items Overview</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportToExcel}>
                <Download className="h-3.5 w-3.5 mr-2" />
                Export to Excel
              </Button>
              <span className="text-xs text-muted-foreground">{items.length} entries</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="h-9 text-xs font-semibold">Return Date</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Brand</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Store Code</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Location</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Canon S/N</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Canon Model</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Receipt S/N</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Receipt Model</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">USB Hub</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Keyboard</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Mouse</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Scanner</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Other 1</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Other 2</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Receiver</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Remark</TableHead>
                  <TableHead className="h-9 text-xs font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow 
                    key={item.id}
                    className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                  >
                    <TableCell className="whitespace-nowrap text-xs py-2">
                      {new Date(item.return_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-xs py-2 font-medium">{item.brand_name}</TableCell>
                    <TableCell className="text-xs py-2">{item.store_code || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.shop_location || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.canon_printer_sn || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.canon_printer_model || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.receipt_printer_sn || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.receipt_printer_model || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.usb_hub || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.keyboard || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.mouse || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.scanner || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.other_1 || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.other_2 || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.receiver_signature || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.remark || "-"}</TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex items-center justify-end gap-1">
                        <PrintReceiving item={item} />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => setEditItem(item)}
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => setDeleteId(item.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <EditReturnItemForm
        item={editItem}
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
        onSuccess={fetchItems}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this return item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};