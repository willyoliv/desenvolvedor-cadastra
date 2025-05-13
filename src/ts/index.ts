import {
  loadProducts,
  shouldReloadProducts,
  loadMore
} from "./core/productController";
import { openFilterMobile, closeFilterMobile, initFilters } from "./ui/filter";

function exposeWindowFunctions() {
  window.openFilterMobile = openFilterMobile;
  window.closeFilterMobile = closeFilterMobile;
}

function setupResizeHandler(container: HTMLElement) {
  window.addEventListener("resize", async () => {
    if (shouldReloadProducts()) {
      await loadProducts(container, true);
    }
  });
}

function setupLoadMore(container: HTMLElement) {
  const btn = document.getElementById("load-more");
  if (btn) {
    btn.addEventListener("click", () => loadMore(container));
  }
}

async function main() {
  const container = document.getElementById("products");
  if (!container) return;

  exposeWindowFunctions();
  await loadProducts(container, true);
  initFilters();
  setupResizeHandler(container);
  setupLoadMore(container);
}

document.addEventListener("DOMContentLoaded", main);
