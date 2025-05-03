// src/app/page.tsx
'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
// import { PriceSearch } from '@/components/price-search'; // Integrated below
import { PriceTable } from '@/components/price-table';
import { AddProductForm } from '@/components/add-product-form';
import { EditProductModal } from '@/components/edit-product-modal';
import { DeleteProductSection } from '@/components/delete-product-section'; // Import the new component
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Info, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// --- Mock Data Structures (Representing data that would be in AVL nodes) ---
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

// --- Mock "Database" (Simulates data store, eventually replaced by AVL backed service) ---
// In a real AVL implementation, `allProducts` might be managed by an AVL Tree class instance.
// The tree would likely be keyed by `productName`, with each node containing a list of `PriceEntry` for that product.
const initialMockData: PriceEntry[] = [];

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
  // Represents the collection of all price entries, mirroring what the AVL tree would manage.
  const [allProducts, setAllProducts] = useState<PriceEntry[]>([]);

  // State for Add/Edit Modals/Forms
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PriceEntry | null>(null);
  const [isLoadingCrud, setIsLoadingCrud] = useState(false); // Loading state for add/edit/delete single entry
  const [isLoadingDeleteProduct, setIsLoadingDeleteProduct] = useState(false); // Specific loading for deleting all entries of a product

  // Load initial data on mount (simulating fetching from backend/AVL tree)
  useEffect(() => {
    // Simulate fetching data
    // AVL Equivalent: Could involve traversing the tree to get all entries or loading from persistent storage.
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

  // --- Mock API Call Functions (Simulate Backend/AVL Tree Interaction) ---

  // Simulates searching within the `allProducts` state
  const fetchSearchResults = async (productName: string): Promise<PriceEntry[]> => {
    // AVL Equivalent: Search the AVL tree for the node keyed by `productName`.
    // If found, return the list of PriceEntry objects stored in that node.
    // Time Complexity: O(log N) to find the node, where N is the number of unique products.
    setIsLoadingSearch(true);
    setSearchError(null);
    setSearchResults([]); // Clear previous results
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

    try {
       if (productName.toLowerCase() === 'error') {
        throw new Error('Simulated server error during search.');
      }
      // Current Array Implementation: Filter the array. O(M) where M is total price entries.
      const results = allProducts.filter(p =>
        p.productName.toLowerCase().includes(productName.toLowerCase())
      );
      if (results.length === 0 && productName.trim() && productName.toLowerCase() !== 'empty') {
         // Only set error if search term is not empty and not 'empty'
         setSearchError(`No price information found for "${productName}". You can add it below.`);
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
    // AVL Equivalent: This operation would likely happen *after* retrieving the list
    // of entries from the relevant product node found via search (O(log N)).
    // Iterating through the list within the node takes O(K) time, where K is the number
    // of price entries for *that specific product*.
    // Total time: O(log N + K).
    if (!results || results.length === 0) return null;
    // Current Array Implementation: Reduce the filtered array. O(K).
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

    // AVL: Call AVL search function.
    const results = await fetchSearchResults(trimmedSearchTerm);
    setSearchResults(results);

    // Find lowest price based *only* on the filtered search results
    setIsLoadingLowest(true); // Simulate loading for lowest price calculation
    setLowestPriceError(null);
    await new Promise(resolve => setTimeout(resolve, 200)); // Short delay for effect
    // AVL: Call findLowestPrice on the results from the node.
    const lowest = findLowestPrice(results);
    if (results.length > 0 && !lowest) {
        setLowestPriceError("Could not determine the lowest price from results.");
    }
    setLowestPriceInfo(lowest);
    setIsLoadingLowest(false);
  };

  // --- Mock CRUD Operations (Simulating AVL interactions) ---

  const handleAddProduct = async (newProductData: Omit<PriceEntry, 'id'>) => {
    // AVL Equivalent:
    // 1. Search for the node keyed by `newProductData.productName` (O(log N)).
    // 2. If the node exists, add the new `PriceEntry` to the list within the node (O(1) or O(K) depending on list impl).
    // 3. If the node doesn't exist, insert a new node into the AVL tree (O(log N)).
    //    - Insertion involves creating the node with the `productName` and a list containing the new `PriceEntry`.
    //    - **Balancing:** After insertion, check the balance factor of ancestors. Perform rotations (single or double) if the tree becomes unbalanced (violates height-balancing property where height difference between left/right subtrees is > 1) to maintain O(log N) height.
    // 4. Update React state with the modified tree/data.
    setIsLoadingCrud(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    try {
        const newProduct: PriceEntry = {
            ...newProductData,
            id: Date.now().toString(), // Simple unique ID generation
        };
        // Current Array Implementation: Append to array. O(1) on average.
        const updatedProducts = [...allProducts, newProduct];
        setAllProducts(updatedProducts);
        setIsAddFormVisible(false); // Hide form on success
        toast({
            title: "Product Added",
            description: `${newProduct.productName} from ${newProduct.store} added successfully.`,
        });
        // Optionally refresh search results if the new product matches current search
        if (searchTerm && newProduct.productName.toLowerCase().includes(searchTerm.toLowerCase())) {
           const refreshedResults = await fetchSearchResults(searchTerm); // Re-fetch to get all matching
           setSearchResults(refreshedResults);
           const lowest = findLowestPrice(refreshedResults);
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
    // AVL Equivalent: This action primarily sets UI state. The actual update happens in `handleSaveEdit`.
    // No direct AVL operation here, but it prepares data for the update.
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteSingleEntry = async (entryId: string) => {
    // AVL Equivalent:
    // 1. Need to know the `productName` associated with `entryId`. (Requires finding the entry first in the current mock, or storing productName with ID).
    // 2. Search the AVL tree for the node keyed by `productName` (O(log N)).
    // 3. If the node exists, find and remove the `PriceEntry` with the matching `entryId` from the list within the node (O(K)).
    // 4. **Important:** If removing this entry makes the list empty, you *might* consider deleting the entire node from the AVL tree.
    //    - Node Deletion (O(log N)): Standard BST deletion followed by rebalancing.
    //    - **Balancing:** After deletion, check balance factors of ancestors upwards from the deletion point. Perform rotations as needed to restore the AVL property.
    // 5. Update React state.
     if (!confirm('Are you sure you want to delete this specific price entry?')) {
        return;
      }
    setIsLoadingCrud(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
     try {
        const productToDelete = allProducts.find(p => p.id === entryId);
        // Current Array Implementation: Filter the array. O(M).
        const updatedProducts = allProducts.filter(p => p.id !== entryId);
        setAllProducts(updatedProducts);
        toast({
            title: "Price Entry Deleted",
            description: `Entry for ${productToDelete?.productName} from ${productToDelete?.store} removed.`,
        });
         // Refresh search results if the deleted product was showing
        const updatedSearchResults = searchResults.filter(p => p.id !== entryId);
        setSearchResults(updatedSearchResults);
        // Re-calculate lowest price
        const lowest = findLowestPrice(updatedSearchResults);
        setLowestPriceInfo(lowest);

    } catch (error: any) {
        console.error("Delete entry error:", error);
        toast({
            title: "Error Deleting Entry",
            description: error.message || "Could not delete the price entry.",
            variant: "destructive",
        });
    } finally {
        setIsLoadingCrud(false);
    }
  };

 const handleSaveEdit = async (updatedProduct: PriceEntry) => {
    // AVL Equivalent:
    // 1. Search for the node keyed by the *original* `productName` if it might have changed, or just the current `updatedProduct.productName` if the key (product name) is immutable for edits. Assume productName can change here for complexity.
    // 2. If productName *has not* changed:
    //    a. Find the node (O(log N)).
    //    b. Find the specific `PriceEntry` by `id` within the node's list (O(K)).
    //    c. Update the entry's `store` and `price` (O(1) after finding).
    // 3. If productName *has* changed:
    //    a. Delete the old entry: Search old node (O(log N)), remove from list (O(K)). Potential node deletion + rebalancing if list becomes empty (O(log N)).
    //    b. Add the new entry: Search new node (O(log N)), add to list (O(K)) or insert new node + rebalance (O(log N)).
    // 4. Update React state.
    setIsLoadingCrud(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    try {
      // Current Array Implementation: Map and replace. O(M).
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
      if (searchTerm && updatedProduct.productName.toLowerCase().includes(searchTerm.toLowerCase())) {
          const refreshedResults = await fetchSearchResults(searchTerm); // Re-fetch to ensure consistency
          setSearchResults(refreshedResults);
          const lowest = findLowestPrice(refreshedResults);
          setLowestPriceInfo(lowest);
      } else if (searchResults.some(p => p.id === updatedProduct.id)) {
          // If the product was in results but name changed, remove it from current results
          const filteredResults = searchResults.filter(p => p.id !== updatedProduct.id);
           setSearchResults(filteredResults);
           const lowest = findLowestPrice(filteredResults);
           setLowestPriceInfo(lowest);
      }


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

  // --- Delete Product by Name ---
  const handleDeleteProductByName = async (productNameToDelete: string) => {
    // AVL Equivalent:
    // 1. Search for the node keyed by `productNameToDelete` (O(log N)).
    // 2. If the node is found, perform AVL node deletion (O(log N)).
    //    - This involves standard BST deletion (finding successor/predecessor if needed).
    //    - **Balancing:** After deletion, traverse up from the deletion point, checking balance factors and performing necessary rotations (single or double) to restore the AVL height-balancing property.
    // 3. If the node is not found, do nothing.
    // 4. Update React state.
    if (!productNameToDelete.trim()) {
        toast({
            title: "Invalid Input",
            description: "Please enter a product name to delete.",
            variant: "destructive",
        });
        return;
    }
     if (!confirm(`Are you sure you want to delete ALL price entries for "${productNameToDelete}"? This cannot be undone.`)) {
        return;
      }

    setIsLoadingDeleteProduct(true);
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API delay

    try {
        const productNameLower = productNameToDelete.toLowerCase();
        const productsToDeleteCount = allProducts.filter(p => p.productName.toLowerCase() === productNameLower).length;

        if (productsToDeleteCount === 0) {
             toast({
                title: "Product Not Found",
                description: `No price entries found for "${productNameToDelete}".`,
                variant: "default",
            });
             setIsLoadingDeleteProduct(false); // Added to stop loading state
             return; // Exit early if no products match
        }

        // Current Array Implementation: Filter the array. O(M).
        const updatedProducts = allProducts.filter(p => p.productName.toLowerCase() !== productNameLower);
        setAllProducts(updatedProducts);

        toast({
            title: "Product Deleted",
            description: `Successfully deleted ${productsToDeleteCount} price entries for "${productNameToDelete}".`,
        });

        // If the deleted product was the one being searched for, clear results
        if (searchTerm.toLowerCase() === productNameLower) {
            setSearchTerm(''); // Clear search term as well
            setSearchResults([]);
            setLowestPriceInfo(null);
            setSearchError(null);
            setLowestPriceError(null);
        } else {
            // Otherwise, just update the current search results if needed (though unlikely to change unless search term was very broad)
             const refreshedResults = searchResults.filter(p => p.productName.toLowerCase() !== productNameLower);
             setSearchResults(refreshedResults);
             const lowest = findLowestPrice(refreshedResults);
             setLowestPriceInfo(lowest);
        }

    } catch (error: any) {
        console.error("Delete product by name error:", error);
        toast({
            title: "Error Deleting Product",
            description: error.message || `Could not delete product "${productNameToDelete}".`,
            variant: "destructive",
        });
    } finally {
        setIsLoadingDeleteProduct(false);
    }
};


  return (
    <div className="space-y-8">
      <Header />

      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle>Find Prices</CardTitle>
          {/* AVL: Search operation uses the tree's O(log N) search. */}
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
                disabled={isLoadingSearch || isLoadingLowest || isLoadingCrud || isLoadingDeleteProduct}
              />
            </div>
            <Button type="submit" disabled={isLoadingSearch || isLoadingLowest || isLoadingCrud || isLoadingDeleteProduct} className="w-full sm:w-auto">
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

       {/* Manage Products Card (Add/Delete) */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Product Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Add Price Entry</CardTitle>
                {/* AVL: Triggers insert operation, potentially involving balancing. */}
                <Button variant="outline" size="sm" onClick={() => setIsAddFormVisible(!isAddFormVisible)} disabled={isLoadingCrud || isLoadingDeleteProduct}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {isAddFormVisible ? 'Cancel Add' : 'Add New Price'}
                </Button>
              </div>
              <CardDescription>
                Add a new price listing for a product from a specific store.
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

           {/* Delete Product Section */}
           {/* AVL: Triggers delete operation on the entire node, involving balancing. */}
            <DeleteProductSection
                onDelete={handleDeleteProductByName}
                isLoading={isLoadingDeleteProduct}
                disabled={isLoadingCrud || isLoadingSearch || isLoadingLowest} // Disable if other actions are happening
            />
        </div>


      {/* Display Search Results and Lowest Price */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Price Table Section */}
        <div className="lg:col-span-2">
          <Card className="transition-opacity duration-300 ease-in-out">
            <CardHeader>
              <CardTitle>Price Comparison</CardTitle>
               {searchTerm && <CardDescription>Showing results for: "{searchTerm}"</CardDescription>}
               {/* AVL: Displays results retrieved from the AVL node. */}
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
                      No price information found for "{searchTerm}". Add a new entry using the form above.
                     </AlertDescription>
                </Alert>
              )}
              {!isLoadingSearch && !searchError && searchResults.length > 0 && (
                <PriceTable
                    data={searchResults}
                    lowestPriceInfo={lowestPriceInfo}
                    onEdit={handleEditProduct} // AVL: Edit might involve delete+insert if productName changes.
                    onDelete={handleDeleteSingleEntry} // AVL: Deletes specific entry from node list, potentially node itself + rebalance.
                    isLoading={isLoadingCrud || isLoadingDeleteProduct} // Disable actions if either CRUD is happening
                    />
              )}
               {!isLoadingSearch && searchResults.length === 0 && !searchError && !searchTerm && (
                 <div className="text-center text-muted-foreground p-6">
                   {allProducts.length > 0
                    ? "Enter a product name above to see price comparisons, or add a new price entry."
                    : "No products found. Use the 'Add Price Entry' section to start tracking prices."
                   }
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
              {/* AVL: Derived from the list of entries in the found AVL node. */}
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
               {!isLoadingLowest && !lowestPriceInfo && !lowestPriceError && (!searchTerm || (searchTerm && searchResults.length === 0)) && (
                  <div className="text-center text-muted-foreground p-4">
                    {searchTerm && searchResults.length === 0 && !searchError
                        ? "No results to determine the lowest price."
                        : "Search for a product to find the lowest price."
                    }
                  </div>
               )}
            </CardContent>
          </Card>

         </div>
       </div>


      {/* Edit Product Modal */}
      {/* AVL: Saving changes here triggers the `handleSaveEdit` function and its AVL operations. */}
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
