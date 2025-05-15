import { createCartItem } from "../components/minicartComponents";

export function addToCart(product: Product) {
  const orderForm = window.orderForm || { items: [] };

  const existingItemIndex = orderForm.items.findIndex((item: CartItem) => item.product.id === product.id);
  if (existingItemIndex !== -1) {
    orderForm.items[existingItemIndex].quantity += 1;
  } else {
    orderForm.items.push({ product, quantity: 1 });
  }
}

export function openMinicart(): void {
   const minicartPainel = document.getElementById('minicart');
   const minicartOverlay = document.getElementById('minicart-overlay');

  minicartPainel?.classList.add('open');
  minicartOverlay?.classList.add('open');
  document.body.classList.add('panel-open');

  const orderForm = window.orderForm || { items: [] };
  renderMinicartItems(orderForm);
}

export function closeMinicart(): void {
  document.getElementById('minicart')?.classList.remove('open');
  document.getElementById('minicart-overlay')?.classList.remove('open');
  document.body.classList.remove('panel-open');
}

function renderMinicartItems(orderForm: OrderForm): void {
  const container = document.getElementById("minicart__items");

  if (!container) return;

  container.innerHTML = "";
  const items = orderForm.items || [];

  items.forEach(cartItem => {
    const cartItemElement = createCartItem(cartItem);

    container.appendChild(cartItemElement);
  });
}