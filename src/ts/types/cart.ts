interface CartItem {
  product: Product;
  quantity: number;
}

interface OrderForm {
  items: CartItem[];
}