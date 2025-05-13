import { fetchProducts } from "../services/productService";
import { createProductCard } from "../components/createProductCard";
import { Product } from "../types/Product";

const DESKTOP_THRESHOLD = 1024;
const MOBILE_PAGE_SIZE = 4;
const DESKTOP_PAGE_SIZE = 9;

let currentPage = 1;
let currentDevice: "mobile" | "desktop" = window.innerWidth < DESKTOP_THRESHOLD ? "mobile" : "desktop";

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

  
  const pageSize = getPageSize();
  const { products, total } = await fetchProducts(currentPage, pageSize);

  if (reset) container.innerHTML = "";

  products.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });

  const loadMoreBtn = document.getElementById("load-more");
  
  const alreadyLoaded = currentPage * pageSize;
  if (alreadyLoaded >= total) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }
}

export async function loadMore(container: HTMLElement) {
  currentPage++;
  const pageSize = getPageSize();
  const { products, total } = await fetchProducts(currentPage, pageSize);


  products.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });

  const totalPages = Math.ceil(total / pageSize);
  const isLastPage = currentPage >= totalPages;

  if (isLastPage) {
    const loadMoreBtn = document.getElementById("load-more");
    const alreadyLoaded = currentPage * pageSize;
    if (alreadyLoaded >= total) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "block";
    }
  }
}
