// src/app/page.tsx
'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
// import { PriceSearch } from '@/components/price-search'; // Integrated below
import { PriceTable } from '@/components/price-table';
import { AddProductForm } from '@/components/add-product-form';
import { EditProductModal } from '@/components/edit-product-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Info, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// --- Mock Data Structures ---
interface PriceEntry {
  id: string; // Unique ID for each entry
  productName: string;
  store: string;
  price: number;
}

interface LowestPriceInfo {
  store: string;
  price: number;
}

// --- Mock "Database" ---
const initialMockData: PriceEntry[] = [
  { id: '1', productName: 'Laptop', store: 'Amazon', price: 999.99 },
  { id: '2', productName: 'Laptop', store: 'Best Buy', price: 1049.00 },
  { id: '3', productName: 'Laptop', store: 'Walmart', price: 979.50 },
  { id: '4', productName: 'Coffee Maker', store: 'Target', price: 45.00 },
  { id: '5', productName: 'Coffee Maker', store: 'Amazon', price: 49.99 },
  { id: '6', productName: 'Headphones', store: 'Best Buy', price: 199.00 },
  { id: '7', productName: 'Headphones', store: 'Amazon', price: 179.95 },
];

export default function Home() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PriceEntry[]>([]);
  const [lowestPriceInfo, setLowestPriceInfo] = useState<LowestPriceInfo | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingLowest, setIsLoadingLowest] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lowestPriceError, setLowestPriceError] = useState<string | null>(null);

  // State for managing the mock "database"
  const [allProducts, setAllProducts] = useState<PriceEntry[]>([]);

  // State for Add/Edit Modals/Forms
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PriceEntry | null>(null);
  const [isLoadingCrud, setIsLoadingCrud] = useState(false); // Loading state for add/edit/delete

  // Load initial data on mount (simulating fetching from backend)
  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setAllProducts(initialMockData);
      // If there's an initial search term or default view needed, perform search
      // For now, just load the data. User needs to search.
    }, 500); // Simulate network delay
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // --- Mock API Call Functions (Simulate Backend Interaction) ---

  // Simulates searching within the `allProducts` state
  const fetchSearchResults = async (productName: string): Promise<PriceEntry[]> => {
    setIsLoadingSearch(true);
    setSearchError(null);
    setSearchResults([]); // Clear previous results
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

    try {
       if (productName.toLowerCase() === 'error') {
        throw new Error('Simulated server error during search.');
      }
      const results = allProducts.filter(p =>
        p.productName.toLowerCase().includes(productName.toLowerCase())
      );
      if (results.length === 0 && productName.toLowerCase() !== 'empty') {
         setSearchError(`No price information found for "${productName}".`);
      }
      return results;
    } catch (error: any) {
      console.error('Search error:', error);
      setSearchError(error.message || 'Failed to fetch search results.');
      return [];
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // Simulates finding the lowest price from search results
  const findLowestPrice = (results: PriceEntry[]): LowestPriceInfo | null => {
    if (!results || results.length === 0) return null;
    return results.reduce((lowest, current) => {
        if (!lowest || current.price < lowest.price) {
            return { store: current.store, price: current.price };
        }
        return lowest;
        }, null as LowestPriceInfo | null);
  };


  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchError("Please enter a product name.");
      setSearchResults([]);
      setLowestPriceInfo(null);
      return;
    }
    const trimmedSearchTerm = searchTerm.trim();

    const results = await fetchSearchResults(trimmedSearchTerm);
    setSearchResults(results);

    // Find lowest price based *only* on the filtered search results
    setIsLoadingLowest(true); // Simulate loading for lowest price calculation
    setLowestPriceError(null);
    await new Promise(resolve => setTimeout(resolve, 200)); // Short delay for effect
    const lowest = findLowestPrice(results);
    if (results.length > 0 && !lowest) {
        setLowestPriceError("Could not determine the lowest price from results.");
    }
    setLowestPriceInfo(lowest);
    setIsLoadingLowest(false);
  };

  // --- Mock CRUD Operations ---

  const handleAddProduct = async (newProductData: Omit<PriceEntry, 'id'>) => {
    setIsLoadingCrud(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    try {
        const newProduct: PriceEntry = {
            ...newProductData,
            id: Date.now().toString(), // Simple unique ID generation
        };
        const updatedProducts = [...allProducts, newProduct];
        setAllProducts(updatedProducts);
        setIsAddFormVisible(false); // Hide form on success
        toast({
            title: "Product Added",
            description: `${newProduct.productName} from ${newProduct.store} added successfully.`,
        });
        // Optionally refresh search results if the new product matches current search
        if (searchTerm && newProduct.productName.toLowerCase().includes(searchTerm.toLowerCase())) {
            setSearchResults(prev => [...prev, newProduct].sort((a,b) => a.price - b.price));
             // Re-calculate lowest price
            const lowest = findLowestPrice([...searchResults, newProduct]);
            setLowestPriceInfo(lowest);
        }
    } catch (error: any) {
        console.error("Add product error:", error);
        toast({
            title: "Error Adding Product",
            description: error.message || "Could not add the product.",
            variant: "destructive",
        });
    } finally {
        setIsLoadingCrud(false);
    }
  };

 const handleEditProduct = (product: PriceEntry) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
     if (!confirm('Are you sure you want to delete this price entry?')) {
        return;
      }
    setIsLoadingCrud(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
     try {
        const updatedProducts = allProducts.filter(p => p.id !== productId);
        setAllProducts(updatedProducts);
        toast({
            title: "Product Deleted",
            description: "The price entry has been removed.",
        });
         // Refresh search results if the deleted product was showing
        const updatedSearchResults = searchResults.filter(p => p.id !== productId);
        setSearchResults(updatedSearchResults);
        // Re-calculate lowest price
        const lowest = findLowestPrice(updatedSearchResults);
        setLowestPriceInfo(lowest);

    } catch (error: any) {
        console.error("Delete product error:", error);
        toast({
            title: "Error Deleting Product",
            description: error.message || "Could not delete the product.",
            variant: "destructive",
        });
    } finally {
        setIsLoadingCrud(false);
    }
  };

 const handleSaveEdit = async (updatedProduct: PriceEntry) => {
    setIsLoadingCrud(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    try {
      const updatedProducts = allProducts.map(p =>
        p.id === updatedProduct.id ? updatedProduct : p
      );
      setAllProducts(updatedProducts);
      setIsEditModalOpen(false);
      setEditingProduct(null);
      toast({
        title: "Product Updated",
        description: `${updatedProduct.productName} updated successfully.`,
      });

      // Refresh search results if the updated product matches current search
       const updatedSearchResults = searchResults.map(p =>
        p.id === updatedProduct.id ? updatedProduct : p
      );
      // Ensure the updated results still match the search term if product name changed
      const finalSearchResults = updatedSearchResults.filter(p =>
          p.productName.toLowerCase().includes(searchTerm.toLowerCase())
      ).sort((a,b) => a.price - b.price);

      setSearchResults(finalSearchResults);

      // Re-calculate lowest price
      const lowest = findLowestPrice(finalSearchResults);
      setLowestPriceInfo(lowest);

    } catch (error: any) {
      console.error("Update product error:", error);
      toast({
        title: "Error Updating Product",
        description: error.message || "Could not update the product.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCrud(false);
    }
  };


  return (
    <div className="space-y-8">
      <Header />

      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle>Find Prices</CardTitle>
        </CardHeader>
        <CardContent>
           <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="flex-grow">
              <label htmlFor="product-search" className="block text-sm font-medium text-foreground mb-1">
                Product Name
              </label>
              <Input
                id="product-search"
                type="text"
                placeholder="e.g., Laptop, Coffee Maker"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full"
                aria-label="Product Search Input"
                disabled={isLoadingSearch || isLoadingLowest || isLoadingCrud}
              />
            </div>
            <Button type="submit" disabled={isLoadingSearch || isLoadingLowest || isLoadingCrud} className="w-full sm:w-auto">
              { (isLoadingSearch || isLoadingLowest) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search Prices'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Add Product Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
             <CardTitle>Manage Products</CardTitle>
             <Button variant="outline" size="sm" onClick={() => setIsAddFormVisible(!isAddFormVisible)} disabled={isLoadingCrud}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {isAddFormVisible ? 'Cancel Add' : 'Add New Price'}
            </Button>
          </div>
           <CardDescription>
            Add new product price entries to the tracker.
          </CardDescription>
        </CardHeader>
        {isAddFormVisible && (
          <CardContent>
            <AddProductForm
                onSubmit={handleAddProduct}
                isLoading={isLoadingCrud}
                onCancel={() => setIsAddFormVisible(false)} />
          </CardContent>
        )}
      </Card>


      {/* Display Search Results and Lowest Price */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Price Table Section */}
        <div className="lg:col-span-2">
          <Card className="transition-opacity duration-300 ease-in-out">
            <CardHeader>
              <CardTitle>Price Comparison</CardTitle>
               {searchTerm && <CardDescription>Showing results for: "{searchTerm}"</CardDescription>}
            </CardHeader>
            <CardContent>
              {isLoadingSearch && (
                 <div className="flex justify-center items-center p-6">
                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
                   <span className="ml-2">Loading prices...</span>
                 </div>
              )}
              {!isLoadingSearch && searchError && (
                <Alert variant="destructive" className="mt-4">
                   <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Search Error</AlertTitle>
                  <AlertDescription>{searchError}</AlertDescription>
                </Alert>
              )}
               {!isLoadingSearch && !searchError && searchResults.length === 0 && searchTerm && (
                 <Alert variant="default" className="mt-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>No Results</AlertTitle>
                    <AlertDescription>
                      No price information found for "{searchTerm}". Try a different product name or add a new entry.
                     </AlertDescription>
                </Alert>
              )}
              {!isLoadingSearch && !searchError && searchResults.length > 0 && (
                <PriceTable
                    data={searchResults}
                    lowestPriceInfo={lowestPriceInfo}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    isLoading={isLoadingCrud} />
              )}
               {!isLoadingSearch && searchResults.length === 0 && !searchError && !searchTerm && (
                 <div className="text-center text-muted-foreground p-6">
                   Enter a product name above to see price comparisons, or add a new price entry.
                 </div>
               )}
            </CardContent>
          </Card>
        </div>

        {/* Lowest Price Section */}
        <div className="space-y-6">
           {/* Lowest Price Finder */}
          <Card className="transition-opacity duration-300 ease-in-out">
            <CardHeader>
              <CardTitle>Lowest Price</CardTitle>
              {searchTerm && searchResults.length > 0 && <CardDescription>Best deal for "{searchTerm}"</CardDescription>}
            </CardHeader>
            <CardContent>
              {isLoadingLowest && (
                 <div className="flex justify-center items-center p-4">
                   <Loader2 className="h-6 w-6 animate-spin text-primary" />
                   <span className="ml-2">Finding best deal...</span>
                 </div>
              )}
              {!isLoadingLowest && lowestPriceError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Lowest Price Error</AlertTitle>
                  <AlertDescription>{lowestPriceError}</AlertDescription>
                </Alert>
              )}
              {!isLoadingLowest && !lowestPriceError && lowestPriceInfo && searchResults.length > 0 && (
                <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent">
                    <p className="text-lg font-semibold">
                      Best deal found at <span className="font-bold text-primary">{lowestPriceInfo.store}</span>!
                    </p>
                    <p className="text-2xl font-bold text-accent-foreground mt-2 lowest-price-accent inline-block">
                      ${lowestPriceInfo.price.toFixed(2)}
                    </p>
                 </div>
              )}
               {!isLoadingLowest && !lowestPriceError && !lowestPriceInfo && searchTerm && searchResults.length > 0 && (
                  <Alert variant="default" className="mt-2">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Lowest Price Unavailable</AlertTitle>
                    <AlertDescription>Could not determine the lowest price among the current results.</AlertDescription>
                  </Alert>
               )}
               {!isLoadingLowest && !lowestPriceInfo && !lowestPriceError && !searchTerm && (
                  <div className="text-center text-muted-foreground p-4">
                    Search for a product to find the lowest price.
                  </div>
               )}
               {!isLoadingLowest && !lowestPriceInfo && !lowestPriceError && searchTerm && searchResults.length === 0 && !searchError &&(
                    <div className="text-center text-muted-foreground p-4">
                        No results to determine the lowest price.
                    </div>
               )}
            </CardContent>
          </Card>

         </div>
       </div>


      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveEdit}
          isLoading={isLoadingCrud}
        />
      )}

    </div>
  );
}
