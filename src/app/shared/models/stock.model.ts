export interface Stock {
  id: number;
  product_id: number;
  product_name: string;
  barcode: string;
  last_update: string;
  quantity_stock: number;
}

export interface StockUpdate {
  quantity_stock: number;
}
