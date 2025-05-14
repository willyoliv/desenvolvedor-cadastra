import { loadProducts } from "../core/productController";

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

  const key =
    title === labels.colors ? 'colors' :
    title === labels.sizes ? 'sizes' :
    title === labels.priceRanges ? 'priceRanges' :
    '';

  if (type === 'checkbox') {
    items.forEach(item => {
      const label = document.createElement('label');
      label.className = 'custom-checkbox';

      const isObject = typeof item === 'object';
      const itemLabel = isObject ? item.label : item;
      const itemValue = isObject ? item.value : item;

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = title.toLowerCase();
      input.value = itemValue;

      if (key) {
        const selectedValue = window.selectedFilters[key];
        if (Array.isArray(selectedValue)) {
          input.checked = selectedValue.includes(itemValue);
        } else {
          input.checked = selectedValue === itemValue;
        }
      }

      const checkmark = document.createElement('span');
      checkmark.className = 'checkmark';
      const text = document.createTextNode(` ${itemLabel}`);

      if (title === labels.priceRanges) {
        input.addEventListener("change", () => {
          const all = document.querySelectorAll(`input[name="${input.name}"]`);
          all.forEach(el => {
            if (el !== input) (el as HTMLInputElement).checked = false;
          });

          if (!isMobile) {
            window.selectedFilters.priceRanges = input.checked ? input.value : "";

            const container = document.getElementById("products");
            if (container) loadProducts(container, true);
          }
        });
      } else if (!isMobile && key === 'colors') {
        input.addEventListener("change", () => {
          if (input.checked) {
            window.selectedFilters.colors.push(itemValue);
          } else {
            const index = window.selectedFilters.colors.indexOf(itemValue);
            if (index > -1) {
              window.selectedFilters.colors.splice(index, 1);
            }
          }

          const container = document.getElementById("products");
          if (container) loadProducts(container, true);
        });
      }

      label.appendChild(input);
      label.appendChild(checkmark);
      label.appendChild(text);
      container.appendChild(label);
    });

  } else {
    (items as string[]).forEach(item => {
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
          const index = window.selectedFilters.sizes.indexOf(item);

          if (index === -1) {
            window.selectedFilters.sizes.push(item);
          } else {
            window.selectedFilters.sizes.splice(index, 1);
          }

          const container = document.getElementById("products");
          if (container) loadProducts(container, true);
        }
      };

      container.appendChild(button);
    });
  }

  return container;
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
