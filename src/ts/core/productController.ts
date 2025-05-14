import { fetchProducts } from "../services/productService";
import { createProductCard } from "../components/createProductCard";

const DESKTOP_THRESHOLD = 1024;
const MOBILE_PAGE_SIZE = 4;
const DESKTOP_PAGE_SIZE = 9;

let currentPage = 1;
let currentDevice: "mobile" | "desktop" = window.innerWidth < DESKTOP_THRESHOLD ? "mobile" : "desktop";
let allProducts: Product[] = [];
let filteredProducts: Product[] = [];

function getPageSize() {
  return window.innerWidth < DESKTOP_THRESHOLD ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;
}

export function shouldReloadProducts(): boolean {
  const isNowMobile = window.innerWidth < DESKTOP_THRESHOLD;
  const newDevice = isNowMobile ? "mobile" : "desktop";
  const shouldReload = newDevice !== currentDevice;
  currentDevice = newDevice;

  return shouldReload;
}

export async function loadProducts(container: HTMLElement, reset = false) {
  if (reset) currentPage = 1;

  if (allProducts.length === 0) {
    allProducts = await fetchProducts();
  }

  filteredProducts = applyFilters(allProducts);

  const pageSize = getPageSize();
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const productsToShow = filteredProducts.slice(start, end);

  if (reset) container.innerHTML = "";

  productsToShow.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });

  const loadMoreBtn = document.getElementById("load-more");
  if (end >= filteredProducts.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }
}


export async function loadMore(container: HTMLElement) {
  currentPage++;

  const pageSize = getPageSize();
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const productsToShow = filteredProducts.slice(start, end);

  productsToShow.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });

  if (end >= filteredProducts.length) {
    const loadMoreBtn = document.getElementById("load-more");
    loadMoreBtn.style.display = "none";
  }
}

export function applyFilters(products: Product[]): Product[] {
  const filters: SelectedFilters = window.selectedFilters;

  return products
    .filter(product => {
      const matchColor =
        filters.colors.length === 0 ||
        filters.colors.includes(product.color);

      const matchSize =
        filters.sizes.length === 0 ||
        product.size.some(size => filters.sizes.includes(size));

      let minPrice = 0;
      let maxPrice = Infinity;

      if (filters.priceRanges) {
        const [minStr, maxStr] = filters.priceRanges.split("-");
        minPrice = Number(minStr) || 0;
        maxPrice = maxStr ? Number(maxStr) : Infinity;
      }

      const matchPrice =
        product.price >= minPrice && product.price <= maxPrice;

      return matchColor && matchSize && matchPrice;
    }).sort((a, b) => {
      switch (filters.orderBy) {
        case "higher-price":
          return b.price - a.price;
        case "lower-price":
          return a.price - b.price;
        case "most-recent":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        default:
          return 0;
      }
    });
}
