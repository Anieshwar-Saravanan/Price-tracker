// src/components/edit-product-modal.tsx
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from 'lucide-react';

// Define the Zod schema for form validation
const formSchema = z.object({
  id: z.string(), // Include ID, but it won't be editable in the form usually
  productName: z.string().min(1, { message: "Product name is required." }).max(100),
  store: z.string().min(1, { message: "Store name is required." }).max(50),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number." })
    .positive({ message: "Price must be positive." })
    .finite(),
});

// Define the type for the form data based on the schema
type FormData = z.infer<typeof formSchema>;

interface EditProductModalProps {
  product: FormData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>; // Accepts FormData, returns Promise
  isLoading: boolean;
}

export function EditProductModal({ product, isOpen, onClose, onSave, isLoading }: EditProductModalProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    // Default values will be set by useEffect when the product prop changes
  });

   // Reset form and set default values when the product prop changes or modal opens
  useEffect(() => {
    if (product && isOpen) {
      form.reset({
        id: product.id,
        productName: product.productName,
        store: product.store,
        price: product.price,
      });
    } else if (!isOpen) {
        form.reset({ // Reset to empty/default when closing
             id: '',
             productName: '',
             store: '',
             price: 0,
         });
    }
  }, [product, isOpen, form]);


  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    await onSave(data);
    // onClose(); // Let the parent handle closing on successful save
  };

  // Handle closing the dialog via the 'x' button or overlay click
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose(); // Call the onClose prop when the dialog is closed
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Price Entry</DialogTitle>
          <DialogDescription>
            Make changes to the product's price information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
         <Form {...form}>
             <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
                {/* ID is usually not shown or edited, but keep it in the form state */}
                {/* <Input type="hidden" {...form.register('id')} /> */}

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
                        <Input
                            type="number"
                            placeholder="e.g., 29.99"
                            step="0.01"
                            {...field}
                             onChange={(e) => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
                             disabled={isLoading}
                         />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <DialogFooter className="pt-4">
                    {/* DialogClose automatically triggers onOpenChange(false) */}
                     <DialogClose asChild>
                         <Button type="button" variant="outline" disabled={isLoading}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                        ) : (
                        'Save Changes'
                        )}
                    </Button>
                </DialogFooter>
             </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
