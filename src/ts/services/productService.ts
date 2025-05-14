import { Product } from "../types/Product";

const API_URL = "http://localhost:5000";

export async function fetchProducts(

): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  const products = await response.json();

  return products;
}
