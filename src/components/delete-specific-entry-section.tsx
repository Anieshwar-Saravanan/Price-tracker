// src/components/delete-specific-entry-section.tsx
'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';


interface DeleteSpecificEntrySectionProps {
  onDelete: (productName: string, storeName: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean; // Optionally disable the whole section
}

export function DeleteSpecificEntrySection({ onDelete, isLoading, disabled = false }: DeleteSpecificEntrySectionProps) {
  const [productName, setProductName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleProductNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
     if (error) setError(null); // Clear error on input change
  };

  const handleStoreNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStoreName(e.target.value);
     if (error) setError(null); // Clear error on input change
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    if (!productName.trim() || !storeName.trim()) {
      setError("Please enter both product name and store name.");
      return;
    }
    await onDelete(productName.trim(), storeName.trim());
    // Clear input on successful initiation (parent handles feedback)
    // setProductName(''); // Keep inputs for clarity unless parent state clears
    // setStoreName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Specific Price Entry</CardTitle>
        <CardDescription>
          Remove a single price entry by specifying both the product name and the store name. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
           {error && (
             <Alert variant="destructive">
               <AlertCircle className="h-4 w-4" />
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
           )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product-delete-name" className="block text-sm font-medium text-foreground mb-1">
                  Product Name
                </Label>
                <Input
                  id="product-delete-name"
                  type="text"
                  placeholder="e.g., Wireless Mouse"
                  value={productName}
                  onChange={handleProductNameChange}
                  className="w-full"
                  aria-label="Product Name to Delete"
                  disabled={isLoading || disabled}
                  required
                />
              </div>
              <div>
                <Label htmlFor="store-delete-name" className="block text-sm font-medium text-foreground mb-1">
                  Store Name
                </Label>
                <Input
                  id="store-delete-name"
                  type="text"
                  placeholder="e.g., Amazon"
                  value={storeName}
                  onChange={handleStoreNameChange}
                  className="w-full"
                  aria-label="Store Name to Delete"
                  disabled={isLoading || disabled}
                  required
                />
              </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="destructive"
              disabled={isLoading || disabled || !productName.trim() || !storeName.trim()}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                 <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Entry
                 </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
