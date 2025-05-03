// src/components/price-table.tsx
'use client';

import * as React from 'react';
import { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Store } from 'lucide-react'; // Example icon
import { cn } from '@/lib/utils';

interface PriceEntry {
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
}

// Helper to get a generic store icon or placeholder
const getStoreIcon = (storeName: string) => {
  // In a real app, you might have a mapping or logic to return specific icons
  // For now, use a generic icon
  return <Store className="inline-block h-5 w-5 mr-2 text-muted-foreground" aria-label={`${storeName} icon`} />;
};

export function PriceTable({ data, lowestPriceInfo }: PriceTableProps) {

  useEffect(() => {
    // Add fade-in animation keyframes if not already present
    // Check if style already exists to avoid duplicates on re-renders/HMR
    if (!document.getElementById('fade-in-animation-style')) {
        const style = document.createElement('style');
        style.id = 'fade-in-animation-style';
        style.innerHTML = `
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `;
        document.head.appendChild(style);
      }
  }, []); // Empty dependency array ensures this runs only once on mount

  if (!data || data.length === 0) {
    return null; // Don't render table if no data
  }

  // Sort data by price ascending to visually group lower prices
  const sortedData = [...data].sort((a, b) => a.price - b.price);

  return (
    <div className="rounded-md border overflow-hidden shadow-sm transition-all duration-300 ease-in-out animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Store</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((entry, index) => {
            const isLowest = lowestPriceInfo && entry.store === lowestPriceInfo.store && entry.price === lowestPriceInfo.price;
            return (
              <TableRow
                key={`${entry.store}-${index}`}
                className={cn(
                  "transition-colors duration-150",
                  isLowest ? "lowest-price-highlight" : "hover:bg-muted/50"
                )}
              >
                <TableCell className="font-medium flex items-center">
                  {getStoreIcon(entry.store)}
                  {entry.store}
                </TableCell>
                <TableCell className={cn("text-right", isLowest ? "font-bold" : "")}>
                  {isLowest ? (
                     <span className="lowest-price-accent">
                       ${entry.price.toFixed(2)}
                     </span>
                  ) : (
                     `$${entry.price.toFixed(2)}`
                  )}

                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
