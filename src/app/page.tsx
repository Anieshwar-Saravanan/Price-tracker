'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { PriceSearch } from '@/components/price-search';
import { PriceTable } from '@/components/price-table';
import { ProductSuggestions } from '@/components/product-suggestions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Info } from 'lucide-react';
import { suggestProducts, type SuggestProductsOutput } from '@/ai/flows/product-suggestion';

// Mock data structure - replace with actual API calls later
interface PriceEntry {
  store: string;
  price: number;
}

interface LowestPriceInfo {
  store: string;
  price: number;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PriceEntry[]>([]);
  const [lowestPriceInfo, setLowestPriceInfo] = useState<LowestPriceInfo | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingLowest, setIsLoadingLowest] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lowestPriceError, setLowestPriceError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestProductsOutput | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('searchHistory');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load search history from localStorage:", error);
      // Optionally clear corrupted data
      // localStorage.removeItem('searchHistory');
    }
  }, []);

  // Update localStorage when search history changes
  useEffect(() => {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } catch (error) {
      console.error("Failed to save search history to localStorage:", error);
    }
  }, [searchHistory]);


  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Mock API call functions (replace with actual fetch calls to your backend)
  const fetchSearchResults = async (productName: string) => {
    setIsLoadingSearch(true);
    setSearchError(null);
    setSearchResults([]); // Clear previous results
    try {
      // Replace with: await fetch(`/api/searchProduct?name=${encodeURIComponent(productName)}`)
      // Simulate API delay and response
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (productName.toLowerCase() === 'error') {
        throw new Error('Simulated server error during search.');
      }
      if (productName.toLowerCase() === 'empty') {
        return []; // Simulate no results found
      }
      // Mock successful response
      return [
        { store: 'Amazon', price: Math.floor(Math.random() * 100) + 50 },
        { store: 'Best Buy', price: Math.floor(Math.random() * 100) + 55 },
        { store: 'Walmart', price: Math.floor(Math.random() * 100) + 45 },
        { store: 'Target', price: Math.floor(Math.random() * 100) + 60 },
      ];
    } catch (error: any) {
      console.error('Search error:', error);
      setSearchError(error.message || 'Failed to fetch search results.');
      return [];
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const fetchLowestPrice = async (productName: string) => {
    setIsLoadingLowest(true);
    setLowestPriceError(null);
    setLowestPriceInfo(null); // Clear previous result
    try {
      // Replace with: await fetch(`/api/lowestPrice?name=${encodeURIComponent(productName)}`)
      // Simulate API delay and response
      await new Promise(resolve => setTimeout(resolve, 800));
      if (productName.toLowerCase() === 'error') {
        throw new Error('Simulated server error finding lowest price.');
      }
      if (productName.toLowerCase() === 'empty') {
         setLowestPriceError('Product not found or no prices available.');
         return null;
      }
      // Mock successful response
       return { store: 'Walmart', price: Math.floor(Math.random() * 50) + 45 }; // Example: Walmart has the lowest
    } catch (error: any) {
      console.error('Lowest price error:', error);
      setLowestPriceError(error.message || 'Failed to fetch the lowest price.');
      return null;
    } finally {
      setIsLoadingLowest(false);
    }
  };

  const fetchSuggestions = async (history: string[]) => {
     if (history.length === 0) {
      setSuggestions(null);
      return;
    }
    setIsLoadingSuggestions(true);
    setSuggestionsError(null);
    try {
      const result = await suggestProducts({ searchHistory: history });
      setSuggestions(result);
    } catch (error: any) {
      console.error('Suggestion error:', error);
      setSuggestionsError(error.message || 'Failed to fetch product suggestions.');
      setSuggestions(null); // Clear suggestions on error
    } finally {
      setIsLoadingSuggestions(false);
    }
  };


  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchError("Please enter a product name.");
      return;
    }
    const trimmedSearchTerm = searchTerm.trim();

    // Add to history (avoid duplicates, limit size)
    if (!searchHistory.includes(trimmedSearchTerm)) {
      const newHistory = [trimmedSearchTerm, ...searchHistory].slice(0, 10); // Keep last 10 searches
      setSearchHistory(newHistory);
       // Fetch suggestions after updating history
      fetchSuggestions(newHistory);
    } else {
      // If term exists, move it to the front
      const newHistory = [trimmedSearchTerm, ...searchHistory.filter(item => item !== trimmedSearchTerm)].slice(0, 10);
       setSearchHistory(newHistory);
       // Fetch suggestions even if term exists but is now prioritized
       fetchSuggestions(newHistory);
    }


    // Fetch both search results and lowest price in parallel
    const resultsPromise = fetchSearchResults(trimmedSearchTerm);
    const lowestPricePromise = fetchLowestPrice(trimmedSearchTerm);

    const [results, lowestPriceData] = await Promise.all([resultsPromise, lowestPricePromise]);

    setSearchResults(results);
    setLowestPriceInfo(lowestPriceData);

    // Handle case where no results are found for search
    if (results.length === 0 && !searchError && trimmedSearchTerm.toLowerCase() !== 'error' && trimmedSearchTerm.toLowerCase() !== 'empty') {
        setSearchError(`No price information found for "${trimmedSearchTerm}".`);
    }
    // Handle case where no lowest price found (already handled inside fetchLowestPrice by setting error)

  };

   // Fetch initial suggestions on load if history exists
   useEffect(() => {
    if (searchHistory.length > 0) {
      fetchSuggestions(searchHistory);
    }
  }, []); // Empty dependency array ensures this runs only once on mount


  return (
    <div className="space-y-8">
      <Header />

      <Card>
        <CardHeader>
          <CardTitle>Find Prices</CardTitle>
        </CardHeader>
        <CardContent>
           <form onSubmit={handleSearchSubmit} className="flex gap-4 items-end">
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
                disabled={isLoadingSearch || isLoadingLowest}
              />
            </div>
            <Button type="submit" disabled={isLoadingSearch || isLoadingLowest}>
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


      {/* Display Search Results and Lowest Price */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Price Table Section */}
        <div className="lg:col-span-2">
          <Card className="transition-opacity duration-300 ease-in-out">
            <CardHeader>
              <CardTitle>Price Comparison</CardTitle>
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
                      No price information found for "{searchTerm}". Try a different product name.
                     </AlertDescription>
                </Alert>
              )}
              {!isLoadingSearch && !searchError && searchResults.length > 0 && (
                <PriceTable data={searchResults} lowestPriceInfo={lowestPriceInfo} />
              )}
               {!isLoadingSearch && searchResults.length === 0 && !searchError && !searchTerm && (
                 <div className="text-center text-muted-foreground p-6">
                   Enter a product name above to see price comparisons.
                 </div>
               )}
            </CardContent>
          </Card>
        </div>

        {/* Lowest Price & Suggestions Section */}
        <div className="space-y-6">
           {/* Lowest Price Finder */}
          <Card className="transition-opacity duration-300 ease-in-out">
            <CardHeader>
              <CardTitle>Lowest Price</CardTitle>
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
              {!isLoadingLowest && !lowestPriceError && lowestPriceInfo && (
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
                    <AlertTitle>Lowest Price Not Available</AlertTitle>
                    <AlertDescription>Could not determine the lowest price for "{searchTerm}".</AlertDescription>
                  </Alert>
               )}
               {!isLoadingLowest && !lowestPriceInfo && !lowestPriceError && !searchTerm && (
                  <div className="text-center text-muted-foreground p-4">
                    Search for a product to find the lowest price.
                  </div>
               )}
            </CardContent>
          </Card>

            {/* Product Suggestions */}
           <ProductSuggestions
             suggestions={suggestions?.suggestions ?? []}
             isLoading={isLoadingSuggestions}
             error={suggestionsError}
             onSuggestionClick={(suggestion) => {
               setSearchTerm(suggestion);
               // Optionally trigger search immediately
               // handleSearchSubmit(new Event('submit') as any);
             }}
           />
         </div>
       </div>

       {/* Placeholder for Add/Update/Delete functionality - To be implemented */}
        {/*
        <Card>
          <CardHeader><CardTitle>Manage Products (Coming Soon)</CardTitle></CardHeader>
          <CardContent>
             <p className="text-muted-foreground">Functionality to add, update, or delete product prices will be available here.</p>
          </CardContent>
        </Card>
        */}
    </div>
  );
}
