import { formatCurrency } from "./productComponents";

export function createCartItem(cartItem: CartItem): HTMLDivElement {
  const itemEl = document.createElement("div");
    itemEl.className = "minicart__item";
    itemEl.innerHTML = `
      <img src="${cartItem.product.image}" alt="${cartItem.product.name}" class="minicart__item-image" />
      <div class="minicart__item-info">
        <h4 class="minicart__item-name">${cartItem.product.name}</h4>
        <p class="minicart__item-quantity">Quantidade: ${cartItem.quantity}</p>
        <p class="minicart__item-price">Preço: ${formatCurrency(cartItem.product.price)}</p>
      </div>
    `;

  return itemEl;
}

export function badgeCartItemCount(count: number): void {
  const cartItemCount = document.getElementById("cart-badge");
  if (cartItemCount) {
    cartItemCount.textContent = count.toString();
  }
}