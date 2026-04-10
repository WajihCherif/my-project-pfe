export interface Product {
  id?: number;
  product_code: string;
  name: string;
  description?: string;
  category?: string;
  barcode?: string;
  price?: number;
  unit?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCreate {
  product_code: string;
  name: string;
  description?: string;
  category?: string;
  barcode?: string;
  price?: number;
  unit?: string;
}
