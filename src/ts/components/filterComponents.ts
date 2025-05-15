import { loadProducts } from "../core/productController";

type CheckboxOptionParams = {
  item: string | { label: string; value: string };
  title: string;
  key: keyof SelectedFilters;
  isMobile: boolean;
};

type CheckboxChangeParams = {
  input: HTMLInputElement;
  title: string;
  key: keyof SelectedFilters;
  value: string;
  isMobile: boolean;
};

const colors = [
  "Amarelo", "Azul", "Branco", "Cinza", "Laranja",
  "Verde", "Vermelho", "Preto", "Rosa", "Vinho"
];

const sizes = ["P", "M", "G", "GG", "U", "36", "38", "40"];

const priceRanges = [
  { label: "de R$0 até R$50", value: "0-50" },
  { label: "de R$51 até R$150", value: "51-150" },
  { label: "de R$151 até R$300", value: "151-300" },
  { label: "de R$301 até R$500", value: "301-500" },
  { label: "a partir de R$ 500", value: "500-" }
];

const labels = {
  colors: "CORES",
  sizes: "TAMANHOS",
  priceRanges: "FAIXA DE PREÇO"
};

export function createFilters(): void {
  const isMobile = window.innerWidth < 1024;

  if (isMobile) {
    const container = document.getElementById('filterOptions');
    if (!container) return;

    container.appendChild(createMobileFilterGroup(labels.colors, colors, "checkbox"));
    container.appendChild(createMobileFilterGroup(labels.sizes, sizes, "button"));
    container.appendChild(createMobileFilterGroup(labels.priceRanges, priceRanges, "checkbox"));
  } else {
    const container = document.getElementById('filterOptionsDesktop');
    if (!container) return;

    container.appendChild(createDesktopFilterGroup(labels.colors, colors, "checkbox"));
    container.appendChild(createDesktopFilterGroup(labels.sizes, sizes, "button"));
    container.appendChild(createDesktopFilterGroup(labels.priceRanges, priceRanges, "checkbox"));
  }
}

function createMobileFilterGroup(
  title: string,
  items: (string | { label: string, value: string })[],
  type: FilterInputType
): HTMLDivElement {
  const group = document.createElement('div');
  group.classList.add('filter-group');

  const groupClassType = title === labels.sizes ? "size-group" : title === labels.colors ? "color-group" : "price-group";

  group.classList.add(groupClassType);

  const toggleButton = createToggleButton(title, type);
  const optionsContainer = createOptionsContainer(items, title, type);
  optionsContainer.style.display = 'none';

  group.appendChild(toggleButton);
  group.appendChild(optionsContainer);
  return group;
}

function createDesktopFilterGroup(
  title: string,
  items: (string | { label: string, value: string })[],
  type: FilterInputType
): HTMLDivElement {
  const group = document.createElement('div');
  group.classList.add('filter-group');

  const groupClassType = title === labels.sizes ? "size-group" : title === labels.colors ? "color-group" : "price-group";
  group.classList.add(groupClassType);

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

function createToggleButton(title: string, type: FilterInputType): HTMLButtonElement {
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

function createOptionsContainer(
  items: (string | { label: string, value: string })[],
  title: string,
  type: FilterInputType
): HTMLDivElement {
  const isMobile = window.innerWidth < 1024;
  const container = document.createElement('div');
  container.className = 'filter-options';

  if (title === labels.sizes) {
    container.classList.add("size-options");
  }

  const key = getKeyFromTitle(title);

  if (type === 'checkbox') {
    items.forEach(item => {
      const labelEl = createCheckboxOption({item, title, key, isMobile});
      container.appendChild(labelEl);
    });
  } else {
    (items as string[]).forEach(item => {
      const button = createSizeButton(item, isMobile);
      container.appendChild(button);
    });
  }

  return container;
}

function getKeyFromTitle(title: string): keyof SelectedFilters  {
  if (title === labels.colors) return 'colors';
  if (title === labels.sizes) return 'sizes';

  return 'priceRanges';
}

function createCheckboxOption(
  { item, title, key, isMobile }: CheckboxOptionParams
): HTMLLabelElement {
  const isObject = typeof item === 'object';
  const itemLabel = isObject ? item.label : item;
  const itemValue = isObject ? item.value : item;

  const label = document.createElement('label');
  label.className = 'custom-checkbox';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.name = title.toLowerCase();
  input.value = itemValue;

  markInputAsSelected(input, key, itemValue);

  const checkmark = document.createElement('span');
  checkmark.className = 'checkmark';
  const text = document.createTextNode(` ${itemLabel}`);

  handleCheckboxChange({input, title, key, value: itemValue, isMobile});

  label.appendChild(input);
  label.appendChild(checkmark);
  label.appendChild(text);
  return label;
}

function markInputAsSelected(input: HTMLInputElement, key: keyof SelectedFilters, value: string) {
  const selectedValue = window.selectedFilters[key];
  if (Array.isArray(selectedValue)) {
    input.checked = selectedValue.includes(value);
  } else {
    input.checked = selectedValue === value;
  }
}

function handleCheckboxChange(
  { input, title, key, value, isMobile }: CheckboxChangeParams
) {
  if (title === labels.priceRanges) {
    input.addEventListener("change", () => {
      document.querySelectorAll(`input[name="${input.name}"]`)
        .forEach(el => {
          if (el !== input) (el as HTMLInputElement).checked = false;
        });

      if (!isMobile) {
        window.selectedFilters.priceRanges = input.checked ? input.value : "";
        reloadProducts();
      }
    });
  } else if (!isMobile && key === 'colors') {
    input.addEventListener("change", () => {
      const colors = window.selectedFilters.colors;
      if (input.checked) {
        colors.push(value);
      } else {
        const index = colors.indexOf(value);
        if (index > -1) colors.splice(index, 1);
      }

      reloadProducts();
    });
  }
}

function createSizeButton(item: string, isMobile: boolean): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'size-box';
  button.textContent = item;
  button.dataset.size = item;

  if (window.selectedFilters.sizes.includes(item)) {
    button.classList.add('selected');
  }

  button.onclick = () => {
    button.classList.toggle('selected');

    if (!isMobile) {
      const sizes = window.selectedFilters.sizes;
      const index = sizes.indexOf(item);

      if (index === -1) {
        sizes.push(item);
      } else {
        sizes.splice(index, 1);
      }

      reloadProducts();
    }
  };

  return button;
}

function reloadProducts() {
  const container = document.getElementById("products");
  if (container) loadProducts(container, true);
}


function toggleVisibility(button: HTMLButtonElement, type: FilterInputType): void {
  const container = button.nextElementSibling as HTMLElement;
  const icon = button.querySelector('.arrow-icon') as SVGElement;

  if (!container || !icon) return;

  const displayStyle = type === 'checkbox' ? 'flex' : 'grid';

  const isVisible = container.style.display === displayStyle;
  container.style.display = isVisible ? 'none' : displayStyle;
  icon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
}
