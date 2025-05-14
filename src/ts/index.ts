import {
  loadProducts,
  shouldReloadProducts,
  loadMore
} from "./core/productController";
import { openFilterMobile, closeFilterMobile, initFilters, updateSelectedFilters, clearSelectedFilters, handleSortOptionClick, setupOrderBySelectListener } from "./ui/filter";

function exposeWindowFunctions() {
  const selectedFilters: SelectedFilters = {
    colors: [],
    sizes: [],
    priceRanges: '',
    orderBy: "none"
  };

  window.selectedFilters = selectedFilters;
  window.openFilterMobile = openFilterMobile;
  window.closeFilterMobile = closeFilterMobile;
  window.updateSelectedFilters = updateSelectedFilters;
  window.clearSelectedFilters = clearSelectedFilters;
  window.handleSortOptionClick = handleSortOptionClick;
  
}

function setupResizeHandler(container: HTMLElement) {
  window.addEventListener("resize", async () => {
    closeFilterMobile();

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
  setupOrderBySelectListener();
}

document.addEventListener("DOMContentLoaded", main);
