import tshirt from "@/assets/merch-tshirt.jpg";
import jacket from "@/assets/merch-jacket.jpg";
import tote from "@/assets/merch-tote.jpg";
import cap from "@/assets/merch-cap.jpg";
import type { Product } from "@/context/CartContext";

export const products: Product[] = [
  { id: "tshirt", name: "NAIM Signature Tee", price: 65, image: tshirt, category: "Apparel" },
  { id: "jacket", name: "Heritage Varsity Jacket", price: 240, image: jacket, category: "Apparel" },
  { id: "tote", name: "Kelantan Tote Bag", price: 45, image: tote, category: "Accessories" },
  { id: "cap", name: "Embroidered Cap", price: 55, image: cap, category: "Accessories" },
];
