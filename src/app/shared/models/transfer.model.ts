export interface Transfer {
  id?: number;
  product_id: number;
  from_etagere_id: number;
  to_etagere_id: number;
  quantity: number;
  transfer_date?: string;
  notes?: string;
}

export interface TransferCreate {
  product_id: number;
  from_etagere_id: number;
  to_etagere_id: number;
  quantity: number;
  transfer_date?: string;
  notes?: string;
}
