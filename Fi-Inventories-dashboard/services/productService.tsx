import { Product } from "@/types/product"
const API_URL = "http://localhost:5000"

export async function getProducts() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/products`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,

        },
    });
    const data = await res.json();
    return data;
}


export const addProduct = async (product: Omit<Product, "id" | "userid">) => {
  const token = localStorage.getItem("token")
  console.log("product", product)
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
body: JSON.stringify(product),
  })
  if (!response.ok) {
    throw new Error("Failed to add product")
  }
  return response.json()
}

export const updateProduct = async (productId: string, quantity: number) => {
  const token = localStorage.getItem("token")
  const response = await fetch(`${API_URL}/products/${productId}/quantity`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  })
  if (!response.ok) {
    throw new Error("Failed to update product")
  }
  return response.json()
}
