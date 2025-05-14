import {
  loadProducts,
  shouldReloadProducts,
  loadMore
} from "./core/productController";
import { openFilterMobile, closeFilterMobile, initFilters, updateSelectedFilters, clearSelectedFilters, handleSortOptionClick, setupOrderBySelectListener } from "../ts/core/filterController";
import { closeMinicart, openMinicart } from "./core/cartController";

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
  window.orderForm = {
    items: [],
  };
  window.closeMinicart = closeMinicart;
  window.openMinicart = openMinicart;
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
