import { TrendingUp } from 'lucide-react'; // Or another relevant icon

export function Header() {
  return (
    <header className="mb-8 pb-4 border-b border-border">
      <div className="container mx-auto flex items-center gap-2">
         <TrendingUp className="h-8 w-8 text-primary" />
         <h1 className="text-3xl font-bold text-primary">
           PriceWise
         </h1>
         <span className="text-sm text-muted-foreground mt-1"> - Track Prices Smartly</span>
      </div>

    </header>
  );
}
