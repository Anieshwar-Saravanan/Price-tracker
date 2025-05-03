// src/components/delete-product-section.tsx
'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';


interface DeleteProductSectionProps {
  onDelete: (productName: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean; // Optionally disable the whole section
}

export function DeleteProductSection({ onDelete, isLoading, disabled = false }: DeleteProductSectionProps) {
  const [productNameToDelete, setProductNameToDelete] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProductNameToDelete(e.target.value);
     if (error) setError(null); // Clear error on input change
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    if (!productNameToDelete.trim()) {
      setError("Please enter a product name to delete.");
      return;
    }
    await onDelete(productNameToDelete.trim());
    // Clear input on successful initiation (parent handles feedback)
    // setProductNameToDelete(''); // Keep input value for clarity unless parent clears state
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Product</CardTitle>
        <CardDescription>
          Remove all price entries associated with a specific product name. This action cannot be undone.
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
          <div>
            <Label htmlFor="product-delete-name" className="block text-sm font-medium text-foreground mb-1">
              Product Name to Delete
            </Label>
            <Input
              id="product-delete-name"
              type="text"
              placeholder="e.g., Old Product"
              value={productNameToDelete}
              onChange={handleInputChange}
              className="w-full"
              aria-label="Product Name to Delete Input"
              disabled={isLoading || disabled}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="destructive"
              disabled={isLoading || disabled || !productNameToDelete.trim()}
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
                    Delete All Entries
                 </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
