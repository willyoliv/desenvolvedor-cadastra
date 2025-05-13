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
    }
  });
}

function clearFiltersHTML() {
  const mobileContainer = document.getElementById('filterOptions');
  const desktopContainer = document.getElementById('filterOptionsDesktop');

  if (mobileContainer) mobileContainer.innerHTML = '';
  if (desktopContainer) desktopContainer.innerHTML = '';
}
