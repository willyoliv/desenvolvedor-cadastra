import { formatCurrency } from "../components/createProductCard";

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

  items.forEach(item => {
    const itemEl = document.createElement("div");
    itemEl.className = "minicart__item";
    itemEl.innerHTML = `
      <img src="${item.product.image}" alt="${item.product.name}" class="minicart__item-image" />
      <div class="minicart__item-info">
        <h4 class="minicart__item-name">${item.product.name}</h4>
        <p class="minicart__item-quantity">Quantidade: ${item.quantity}</p>
        <p class="minicart__item-price">Preço: ${formatCurrency(item.product.price)}</p>
      </div>
    `;
    container.appendChild(itemEl);
  });
}