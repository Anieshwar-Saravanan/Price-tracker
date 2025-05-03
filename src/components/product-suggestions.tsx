'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Lightbulb } from 'lucide-react';

interface ProductSuggestionsProps {
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  onSuggestionClick: (suggestion: string) => void;
}

export function ProductSuggestions({ suggestions, isLoading, error, onSuggestionClick }: ProductSuggestionsProps) {
  return (
    <Card className="transition-opacity duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Product Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center items-center p-4 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Generating suggestions...</span>
          </div>
        )}
        {!isLoading && error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Suggestion Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && suggestions.length === 0 && (
          <p className="text-muted-foreground text-sm p-4 text-center">
            No suggestions available. Try searching for some products!
          </p>
        )}
        {!isLoading && !error && suggestions.length > 0 && (
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-1 px-2 hover:bg-accent/10"
                  onClick={() => onSuggestionClick(suggestion)}
                  title={`Search for ${suggestion}`}
                >
                  {suggestion}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
