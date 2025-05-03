// src/components/price-table.tsx
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Store, Edit, Trash2 } from 'lucide-react'; // Added Edit and Trash2 icons
import { cn } from '@/lib/utils';

interface PriceEntry {
  id: string; // Unique ID for the entry
  productName: string;
  store: string;
  price: number;
}

interface LowestPriceInfo {
  store: string;
  price: number;
}

interface PriceTableProps {
  data: PriceEntry[];
  lowestPriceInfo: LowestPriceInfo | null;
  onEdit: (product: PriceEntry) => void; // Handler for editing
  onDeleteEntry: (entryId: string) => void; // Handler for deleting a single entry by its ID (renamed)
  isLoading?: boolean; // To disable buttons during operations
}

// Helper to get a generic store icon or placeholder
const getStoreIcon = (storeName: string) => {
  // In a real app, you might have a mapping or logic to return specific icons
  return <Store className="inline-block h-5 w-5 mr-2 text-muted-foreground" aria-label={`${storeName} icon`} />;
};

export function PriceTable({ data, lowestPriceInfo, onEdit, onDeleteEntry, isLoading = false }: PriceTableProps) {

  // No need for the fade-in effect managed by useEffect here anymore if parent handles transitions

  if (!data || data.length === 0) {
    return null; // Don't render table if no data
  }

  // Sort data by price ascending to visually group lower prices
  const sortedData = [...data].sort((a, b) => a.price - b.price);

  return (
    <div className="rounded-md border overflow-hidden shadow-sm transition-all duration-300 ease-in-out">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] sm:w-[200px]">Store</TableHead>
            <TableHead>Product</TableHead> {/* Added Product Name column */}
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right w-[120px]">Actions</TableHead> {/* Actions column */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((entry) => {
            // Determine if this entry is the lowest based on *both* store and price matching the lowest info
             const isLowest = lowestPriceInfo &&
                           entry.store === lowestPriceInfo.store &&
                           entry.price === lowestPriceInfo.price;

            return (
              <TableRow
                key={entry.id} // Use unique ID as key
                className={cn(
                  "transition-colors duration-150",
                  isLowest ? "lowest-price-highlight" : "hover:bg-muted/50"
                )}
              >
                <TableCell className="font-medium flex items-center">
                  {getStoreIcon(entry.store)}
                  {entry.store}
                </TableCell>
                <TableCell>{entry.productName}</TableCell> {/* Display Product Name */}
                <TableCell className={cn("text-right", isLowest ? "font-bold" : "")}>
                  {isLowest ? (
                     <span className="lowest-price-accent">
                       ${entry.price.toFixed(2)}
                     </span>
                  ) : (
                     `$${entry.price.toFixed(2)}`
                  )}
                </TableCell>
                 <TableCell className="text-right space-x-1"> {/* Reduced space */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => onEdit(entry)}
                        disabled={isLoading}
                        aria-label={`Edit price for ${entry.productName} at ${entry.store}`}
                        title="Edit Entry"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDeleteEntry(entry.id)} // Pass entry.id to onDeleteEntry
                        disabled={isLoading}
                        aria-label={`Delete price entry for ${entry.productName} at ${entry.store}`}
                        title="Delete Entry"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
