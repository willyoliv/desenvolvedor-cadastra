import { fetchProducts } from "./services/getProducts";
import { Product } from "./types/Product";
import { createProductCard } from "./components/createProductCard";
import { closeFilterMobile, openFilterMobile } from "./ui/filter";

const loadWindowFunctions = () => {
  window.openFilterMobile = openFilterMobile;
  window.closeFilterMobile = closeFilterMobile;
}

async function main() {
  const container = document.getElementById("products");
  if (!container) return;

  loadWindowFunctions();

  try {
    const products: Product[] = await fetchProducts();
    products.forEach(product => {
      const card = createProductCard(product);
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

document.addEventListener("DOMContentLoaded", main);
