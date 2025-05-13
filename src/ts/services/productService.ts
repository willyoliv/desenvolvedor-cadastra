import { Product } from "../types/Product";

const API_URL = "http://localhost:5000";

export async function fetchProducts(
  page = 1,
  limit = 9
): Promise<{ products: Product[]; total: number }> {
  const response = await fetch(`${API_URL}/products?_page=${page}&_limit=${limit}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  const products = await response.json();
  const total = Number(response.headers.get("X-Total-Count"));

  return { products, total };
}
