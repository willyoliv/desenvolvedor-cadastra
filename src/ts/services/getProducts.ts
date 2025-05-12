import { Product } from "../types/Product";

const API_URL = "http://localhost:5000";
const PAGE_SIZE = 9;

export async function fetchProducts(page = 1): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products?_page=${page}&_limit=${PAGE_SIZE}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }
  return response.json();
}
