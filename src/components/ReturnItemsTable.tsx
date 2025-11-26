import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
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
  receipt_printer_sn: string | null;
  usb_hub: string | null;
  keyboard: string | null;
  mouse: string | null;
  other_1: string | null;
  other_2: string | null;
  receiver_signature: string | null;
}

interface ReturnItemsTableProps {
  searchQuery: string;
}

export const ReturnItemsTable = ({ searchQuery }: ReturnItemsTableProps) => {
  const [items, setItems] = useState<ReturnItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, [searchQuery]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("return_items")
        .select("*")
        .order("return_date", { ascending: false });

      if (searchQuery) {
        query = query.or(`brand_name.ilike.%${searchQuery}%,store_code.ilike.%${searchQuery}%,shop_location.ilike.%${searchQuery}%,receiver_signature.ilike.%${searchQuery}%`);
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Loading return items...</p>
        </CardContent>
      </Card>
    );
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
        <CardHeader>
          <CardTitle>Return Items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Brand Name</TableHead>
                  <TableHead>Store Code</TableHead>
                  <TableHead>Shop Location</TableHead>
                  <TableHead>Canon Printer S/N</TableHead>
                  <TableHead>Receipt Printer S/N</TableHead>
                  <TableHead>USB Hub</TableHead>
                  <TableHead>Keyboard</TableHead>
                  <TableHead>Mouse</TableHead>
                  <TableHead>Other</TableHead>
                  <TableHead>Other</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(item.return_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{item.brand_name}</TableCell>
                    <TableCell>{item.store_code || "-"}</TableCell>
                    <TableCell>{item.shop_location || "-"}</TableCell>
                    <TableCell>{item.canon_printer_sn || "-"}</TableCell>
                    <TableCell>{item.receipt_printer_sn || "-"}</TableCell>
                    <TableCell>{item.usb_hub || "-"}</TableCell>
                    <TableCell>{item.keyboard || "-"}</TableCell>
                    <TableCell>{item.mouse || "-"}</TableCell>
                    <TableCell>{item.other_1 || "-"}</TableCell>
                    <TableCell>{item.other_2 || "-"}</TableCell>
                    <TableCell>{item.receiver_signature || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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