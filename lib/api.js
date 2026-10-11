
import {
  PRODUCTS,
  getProductBySlug,
  getProductsByCategory,
  getTopRisers,
  getTopFallers,
} from "./data";

export async function getAllProducts() {
  return PRODUCTS;
}

export async function getProductBySlugAsync(slug) {
  return getProductBySlug(slug) || null;
}

export async function getProductsByCategoryAsync(category) {
  return getProductsByCategory(category);
}

export function getRisers(limit = 6) {
  return getTopRisers(limit);
}

export function getFallers(limit = 6) {
  return getTopFallers(limit);
}
