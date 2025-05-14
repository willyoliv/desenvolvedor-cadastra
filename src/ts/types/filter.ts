interface SelectedFilters {
  colors: string[];
  sizes: string[];
  priceRanges: string;
  orderBy: 'higher-price' | 'lower-price' | 'most-recent' | 'none';
}

type FilterInputType = "checkbox" | "button";