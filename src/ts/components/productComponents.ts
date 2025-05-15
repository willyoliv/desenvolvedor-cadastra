import { addToCart, openMinicart } from "../core/cartController";

export const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);


export function createProductCard(product: Product): HTMLElement {
  const card = document.createElement("div");
  card.className = "product-card";

  const { name, price, image, parcelamento } = product;
  const [installments, installmentValue] = Array.isArray(parcelamento) && parcelamento.length === 2
    ? parcelamento
    : [0, 0];

  card.innerHTML = `
    <img src="${image}" alt="${name}" class="product-image" />
    <h3 class="product-name">${name}</h3>
    <p class="product-price">${formatCurrency(price)}</p>
    <p class="product-installment">até ${installments}x de ${formatCurrency(installmentValue)}</p>
    <button class="add-to-cart-button">COMPRAR</button>
  `;

  const button = card.querySelector(".add-to-cart-button") as HTMLButtonElement;

  if (button) {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      addToCart(product);
      openMinicart();
    })
  }

  return card;
}
