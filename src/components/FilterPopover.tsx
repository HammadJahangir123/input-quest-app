import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface FilterValues {
  brandName: string;
  storeCode: string;
  dateFrom: string;
  dateTo: string;
}

interface FilterPopoverProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
}

export const FilterPopover = ({ filters, onFiltersChange }: FilterPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [storeCodes, setStoreCodes] = useState<string[]>([]);
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const fetchFilterOptions = async () => {
    // Fetch unique brands
    const { data: brandData } = await supabase
      .from("return_items")
      .select("brand_name");
    
    if (brandData) {
      const uniqueBrands = [...new Set(brandData.map(item => item.brand_name))].sort();
      setBrands(uniqueBrands);
    }

    // Fetch unique store codes
    const { data: storeData } = await supabase
      .from("return_items")
      .select("store_code")
      .not("store_code", "is", null);
    
    if (storeData) {
      const uniqueStoreCodes = [...new Set(storeData.map(item => item.store_code).filter(Boolean))].sort() as string[];
      setStoreCodes(uniqueStoreCodes);
    }
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const emptyFilters: FilterValues = {
      brandName: "",
      storeCode: "",
      dateFrom: "",
      dateTo: "",
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    setOpen(false);
  };

  const hasActiveFilters = filters.brandName || filters.storeCode || filters.dateFrom || filters.dateTo;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Filter Options</h4>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 px-2 text-xs">
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Brand</Label>
              <Select
                value={localFilters.brandName}
                onValueChange={(value) => setLocalFilters({ ...localFilters, brandName: value === "all" ? "" : value })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="All brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Store Code</Label>
              <Select
                value={localFilters.storeCode}
                onValueChange={(value) => setLocalFilters({ ...localFilters, storeCode: value === "all" ? "" : value })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="All stores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All stores</SelectItem>
                  {storeCodes.map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Date From</Label>
              <Input
                type="date"
                value={localFilters.dateFrom}
                onChange={(e) => setLocalFilters({ ...localFilters, dateFrom: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Date To</Label>
              <Input
                type="date"
                value={localFilters.dateTo}
                onChange={(e) => setLocalFilters({ ...localFilters, dateTo: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="flex-1" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
