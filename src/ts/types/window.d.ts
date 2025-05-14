interface Window {
  openFilterMobile: (section: 'filter' | 'sort') => void;
  closeFilterMobile: () => void;
  selectedFilters: SelectedFilters;
  updateSelectedFilters: () => void;
  clearSelectedFilters: () => void;
  handleSortOptionClick: (event: MouseEvent) => void;
  closeMinicart: () => void;
  openMinicart: () => void;
  orderForm: OrderForm;
}