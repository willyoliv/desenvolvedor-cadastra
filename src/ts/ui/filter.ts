import { createFilters } from "../components/createFilterInput";

let currentIsMobile: boolean;

export function openFilterMobile(section: 'filter' | 'sort'): void {
   const panel = document.getElementById('filterPanel');
  const filterSection = document.getElementById('filterSection');
  const sortSection = document.getElementById('sortSection');

  panel?.classList.add('open');
  document.body.classList.add('panel-open');

  if (section === 'filter') {
    filterSection?.classList.add('active');
    sortSection?.classList.remove('active');
  } else {
    sortSection?.classList.add('active');
    filterSection?.classList.remove('active');
  }
}

export function closeFilterMobile(): void {
  revertUnappliedFilters();

  document.getElementById('filterPanel')?.classList.remove('open');
  document.body.classList.remove('panel-open');
}

export function initFilters() {
  currentIsMobile = window.innerWidth < 1024;
  createFilters();

  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth < 1024;

    if (isMobile !== currentIsMobile) {
      currentIsMobile = isMobile;
      clearFiltersHTML();
      createFilters();
      syncOrderFilterDesktopWithMobile();
    }
  });
}

function clearFiltersHTML() {
  const mobileContainer = document.getElementById('filterOptions');
  const desktopContainer = document.getElementById('filterOptionsDesktop');

  if (mobileContainer) mobileContainer.innerHTML = '';
  if (desktopContainer) desktopContainer.innerHTML = '';
}

export function updateSelectedFilters(): void {
  const selectedFilters: SelectedFilters = {
    colors: [],
    sizes: [],
    priceRanges: "",
    orderBy: window.selectedFilters.orderBy || 'none'
  };

  const colorInputs = document.querySelectorAll<HTMLInputElement>('.filter-group.color-group input[type="checkbox"]');
  const sizeButtons = document.querySelectorAll<HTMLElement>('.filter-group.size-group .size-box');
  const priceRangeInputs = document.querySelectorAll<HTMLInputElement>('.filter-group.price-group input[type="checkbox"]');

  colorInputs.forEach(input => {
    if (input.checked && !selectedFilters.colors.includes(input.value)) {
      selectedFilters.colors.push(input.value);
    }
  });

  sizeButtons.forEach(button => {
    const size = button.dataset.size;
    if (button.classList.contains('selected') && size && !selectedFilters.sizes.includes(size)) {
      selectedFilters.sizes.push(size);
    }
  });

  priceRangeInputs.forEach(input => {
    if (input.checked) {
      selectedFilters.priceRanges = input.value;
    }
  });

  window.selectedFilters = selectedFilters;
  closeFilterMobile();
}

export function clearSelectedFilters(): void {
  const colorInputs = document.querySelectorAll<HTMLInputElement>('.filter-group.color-group input[type="checkbox"]');
  const sizeButtons = document.querySelectorAll<HTMLInputElement>('.filter-group.size-group .size-box');
  const priceRangeInputs = document.querySelectorAll<HTMLInputElement>('.filter-group.price-group input[type="checkbox"]');

  colorInputs.forEach(input => {
    input.checked = false;
  });

  sizeButtons.forEach(input => {
    input.classList.remove('selected');
  });

  priceRangeInputs.forEach(input => {
    input.checked = false;
  });

  window.selectedFilters = {
    colors: [],
    sizes: [],
    priceRanges: '',
    orderBy: window.selectedFilters.orderBy
  };

  closeFilterMobile();
}

export function revertUnappliedFilters(): void {
  const selectedFilters = window.selectedFilters;

  const colorInputs = document.querySelectorAll<HTMLInputElement>('.filter-group.color-group input[type="checkbox"]');
  colorInputs.forEach(input => {
    input.checked = selectedFilters.colors.includes(input.value);
  });

  const sizeButtons = document.querySelectorAll<HTMLButtonElement>('.filter-group.size-group .size-box');
  sizeButtons.forEach(button => {
    const size = button.dataset.size || '';
    if (selectedFilters.sizes.includes(size)) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  });

  const priceRangeInputs = document.querySelectorAll<HTMLInputElement>('.filter-group.price-group input[type="checkbox"]');
  priceRangeInputs.forEach(input => {
    input.checked = selectedFilters.priceRanges.includes(input.value);
  });
}

export function handleSortOptionClick(event: MouseEvent): void {
  const clickedButton = event.currentTarget as HTMLButtonElement;
  const allButtons = document.querySelectorAll<HTMLButtonElement>('.sort-button-option');
  const isAlreadySelected = clickedButton.classList.contains('selected');

  allButtons.forEach(button => button.classList.remove('selected'));

  if (!isAlreadySelected) {
    clickedButton.classList.add('selected');
    const selectedOrder = (clickedButton.dataset.order || 'none') as SelectedFilters['orderBy'];
    window.selectedFilters.orderBy = selectedOrder;
  } else {
    window.selectedFilters.orderBy = 'none';
  }

  closeFilterMobile();
}

function syncOrderFilterDesktopWithMobile() {
  const select = document.querySelector<HTMLSelectElement>('.custom-select');
  const buttons = document.querySelectorAll<HTMLButtonElement>('.sort-button-option');

  if (select) {
    select.value = window.selectedFilters.orderBy;
  }

  buttons.forEach(button => {
    const order = button.dataset.order;
    if (order === window.selectedFilters.orderBy) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  });
}


export function setupOrderBySelectListener(): void {
  const select = document.querySelector<HTMLSelectElement>('.custom-select');
  if (!select) return;

  select.addEventListener('change', () => {
    window.selectedFilters.orderBy = select.value as SelectedFilters['orderBy'];
    syncOrderFilterDesktopWithMobile();
  });
}
