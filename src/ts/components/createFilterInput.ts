type FilterType = "checkbox" | "button";

const colors = [
  "Amarelo", "Azul", "Branco", "Cinza", "Laranja",
  "Verde", "Vermelho", "Preto", "Rosa", "Vinho"
];

const sizes = ["P", "M", "G", "GG", "U", "36", "38", "40"];

const priceRanges = [
  "de R$0 até R$50",
  "de R$51 até R$150",
  "de R$151 até R$300",
  "de R$301 até R$500",
  "a partir de R$ 500"
];

export function createFilters(): void {
  const isMobile = window.innerWidth < 1024;

  if (isMobile) {
    const container = document.getElementById('filterOptions');
    if (!container) return;

    container.appendChild(createMobileFilterGroup("CORES", colors, "checkbox"));
    container.appendChild(createMobileFilterGroup("TAMANHOS", sizes, "button"));
    container.appendChild(createMobileFilterGroup("FAIXA DE PREÇO", priceRanges, "checkbox"));
  } else {
    const container = document.getElementById('filterOptionsDesktop');
    if (!container) return;

    container.appendChild(createDesktopFilterGroup("CORES", colors, "checkbox"));
    container.appendChild(createDesktopFilterGroup("TAMANHOS", sizes, "button"));
    container.appendChild(createDesktopFilterGroup("FAIXA DE PREÇO", priceRanges, "checkbox"));
  }
}

function createMobileFilterGroup(
  title: string,
  items: string[],
  type: FilterType
): HTMLDivElement {
  const group = document.createElement('div');
  group.classList.add('filter-group');

  const toggleButton = createToggleButton(title, type);
  const optionsContainer = createOptionsContainer(items, title, type);
  optionsContainer.style.display = 'none';

  group.appendChild(toggleButton);
  group.appendChild(optionsContainer);
  return group;
}

function createDesktopFilterGroup(
  title: string,
  items: string[],
  type: FilterType
): HTMLDivElement {
  const group = document.createElement('div');
  group.classList.add('filter-group');

  const heading = document.createElement('h3');
  heading.className = 'filter-title';
  heading.textContent = title;

  const optionsContainer = createOptionsContainer(items, title, type);
  const displayStyle = type === "checkbox" ? "flex" : "grid";
  optionsContainer.style.display = displayStyle;

  group.appendChild(heading);
  group.appendChild(optionsContainer);
  return group;
}

function createToggleButton(title: string, type: FilterType): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'filter-toggle';
  button.innerHTML = `
    ${title}
    <svg class="arrow-icon" width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L10 14L19 1.0135" stroke="#666666" stroke-linecap="round"/>
    </svg>
  `;

  button.onclick = () => toggleVisibility(button, type);
  return button;
}

function createOptionsContainer(items: string[], title: string, type: FilterType): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'filter-options';

  if (title === "TAMANHOS") {
    container.classList.add("size-options");
  }

  if (type === 'checkbox') {
    items.forEach(item => {
      const label = document.createElement('label');
      label.className = 'custom-checkbox';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = title.toLowerCase();
      input.value = item;

      const checkmark = document.createElement('span');
      checkmark.className = 'checkmark';

      const text = document.createTextNode(` ${item}`);

      label.appendChild(input);
      label.appendChild(checkmark);
      label.appendChild(text);
      container.appendChild(label);
    });
  } else {
    items.forEach(item => {
      const button = document.createElement('button');
      button.className = 'size-box';
      button.textContent = item;
      button.onclick = () => button.classList.toggle('selected');
      container.appendChild(button);
    });
  }

  return container;
}

function toggleVisibility(button: HTMLButtonElement, type: FilterType): void {
  const container = button.nextElementSibling as HTMLElement;
  const icon = button.querySelector('.arrow-icon') as SVGElement;

  if (!container || !icon) return;

  const displayStyle = type === 'checkbox' ? 'flex' : 'grid';

  const isVisible = container.style.display === displayStyle;
  container.style.display = isVisible ? 'none' : displayStyle;
  icon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
}
