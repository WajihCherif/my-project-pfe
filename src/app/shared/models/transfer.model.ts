export interface Transfer {
  id?: number;
  product_id: number;
  from_location?: string;
  to_location?: string;
  quantity: number;
  transferred_at?: string;
  notes?: string;
}

export interface TransferCreate {
  product_id: number;
  from_depot_id?: number;
  to_etagere_id?: number;
  quantity: number;
  notes?: string;
}

export interface TransferHistory {
  id: number;
  product_id: number;
  product_name: string;
  from_depot_id?: number;
  from_depot_name?: string;
  to_etagere_id?: number;
  to_etagere_name?: string;
  quantity: number;
  notes?: string;
  transferred_at: string;
}
