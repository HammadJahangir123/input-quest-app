import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Download, Check, X } from "lucide-react";
import { toast } from "sonner";
import { EditLaptopReturnForm } from "./EditLaptopReturnForm";
import { PrintLaptopReceiving } from "./PrintLaptopReceiving";
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
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface LaptopReturnsTableProps {
  searchQuery: string;
  refreshKey?: number;
}

export const LaptopReturnsTable = ({ searchQuery, refreshKey }: LaptopReturnsTableProps) => {
  const [items, setItems] = useState<LaptopReturn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<LaptopReturn | null>(null);

  useEffect(() => {
    fetchItems();
  }, [searchQuery, refreshKey]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("laptop_returns")
        .select("*")
        .order("return_date", { ascending: false });

      if (searchQuery) {
        query = query.or(`brand.ilike.%${searchQuery}%,store_code.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,laptop_model.ilike.%${searchQuery}%,serial_number.ilike.%${searchQuery}%,remark.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      toast.error("Failed to load laptop returns");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("laptop_returns")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      setItems(items.filter((item) => item.id !== deleteId));
      toast.success("Laptop return deleted successfully");
    } catch (error) {
      toast.error("Failed to delete laptop return");
    } finally {
      setDeleteId(null);
    }
  };

  const handleExportToExcel = () => {
    const exportData = items.map(item => ({
      "Return Date": new Date(item.return_date).toLocaleDateString(),
      "Brand": item.brand,
      "Store Code": item.store_code || "-",
      "Location": item.location || "-",
      "Laptop Model": item.laptop_model,
      "Serial Number": item.serial_number,
      "Charger": item.has_charger ? "Yes" : "No",
      "Remark": item.remark || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laptop Returns");
    XLSX.writeFile(wb, `laptop_returns_${new Date().toISOString().split('T')[0]}.xlsx`);
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
            {searchQuery ? "No laptop returns found matching your search" : "No laptop returns yet. Add your first laptop return above."}
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
            <CardTitle className="text-base font-semibold">Laptop Returns Overview</CardTitle>
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
                  <TableHead className="h-9 text-xs font-semibold">Laptop Model</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Serial Number</TableHead>
                  <TableHead className="h-9 text-xs font-semibold">Charger</TableHead>
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
                    <TableCell className="text-xs py-2 font-medium">{item.brand}</TableCell>
                    <TableCell className="text-xs py-2">{item.store_code || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.location || "-"}</TableCell>
                    <TableCell className="text-xs py-2">{item.laptop_model}</TableCell>
                    <TableCell className="text-xs py-2">{item.serial_number}</TableCell>
                    <TableCell className="text-xs py-2">
                      {item.has_charger ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <Check className="h-3.5 w-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <X className="h-3.5 w-3.5" /> No
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs py-2">{item.remark || "-"}</TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex items-center justify-end gap-1">
                        <PrintLaptopReceiving item={item} />
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

      <EditLaptopReturnForm
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
              This action cannot be undone. This will permanently delete this laptop return.
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
