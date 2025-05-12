import { Product } from "../types/Product";

export function createProductCard(product: Product): HTMLElement {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" />
    <h3>${product.name}</h3>
    <p>R$ ${product.price.toFixed(2)}</p>
  `;

  return card;
}
