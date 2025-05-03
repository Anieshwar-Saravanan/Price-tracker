// src/components/add-product-form.tsx
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

// Define the Zod schema for form validation
const formSchema = z.object({
  productName: z.string().min(1, { message: "Product name is required." }).max(100).trim(),
  store: z.string().min(1, { message: "Store name is required." }).max(50).trim(),
  price: z.coerce // Use coerce to handle string input from number field
    .number({ invalid_type_error: "Price must be a number." })
    .positive({ message: "Price must be positive." })
    .finite(),
});

// Define the type for the form data based on the schema
type FormData = z.infer<typeof formSchema>;

interface AddProductFormProps {
  onSubmit: (data: FormData) => Promise<void>; // Accepts FormData, returns Promise
  isLoading: boolean;
  onCancel: () => void; // Function to handle cancellation
}

export function AddProductForm({ onSubmit, isLoading, onCancel }: AddProductFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      store: "",
      price: 0, // Initialize price, coerce handles the empty string case better
    },
  });

   // Reset form when the component unmounts or if needed externally
  useEffect(() => {
    return () => {
      form.reset(); // Reset form on component unmount
    };
  }, [form]);


  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    // Trim data before submitting
    const trimmedData = {
        ...data,
        productName: data.productName.trim(),
        store: data.store.trim(),
    };
    await onSubmit(trimmedData);
    // Let parent decide whether to clear/reset based on success/failure
    // If submission is successful, parent hides the form, triggering useEffect cleanup which resets.
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 border p-4 rounded-md shadow-sm">
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Wireless Mouse" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="store"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Amazon, Target" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                {/* Use type="number" but handle potential string values */}
                 <Input
                    type="number"
                    placeholder="e.g., 29.99"
                    step="0.01" // Allow decimals
                    {...field}
                    // value={field.value === 0 ? '' : field.value} // Handle display of initial 0
                    onChange={(e) => {
                         // Allow empty string for clearing, otherwise parse
                        const value = e.target.value;
                        field.onChange(value === '' ? '' : parseFloat(value));
                    }}
                     disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-2">
           <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
             Cancel
           </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Price Entry'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
