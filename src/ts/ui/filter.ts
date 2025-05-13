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
