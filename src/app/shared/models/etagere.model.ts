export interface Etagere {
  id?: number;
  etagere_code: string;
  depot_id: number;
  product_id?: number;
  name: string;
  section?: string;
  quantity?: number;
  max_capacity?: number;
  last_restocked?: string;
  last_updated?: string;
}

export interface EtagereCreate {
  etagere_code: string;
  depot_id: number;
  product_id?: number | null;
  name: string;
  section?: string;
  quantity?: number;
  max_capacity?: number;
}
