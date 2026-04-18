export interface Alert {
  id: number;
  product_id: number;
  product_name: string;
  alert_type: string;
  expected_quantity: number;
  actual_quantity: number;
  difference: number;
  message?: string;
  quantity_stock: number;
  quantity_etagere: number;
  quantity_depot: number;
  stock_id?: number;
  etagere_id?: number;
  depot_id?: number;
  created_at: string;
}
