import { Injectable } from '@angular/core';
import { Etagere } from '../models/etagere.model';

@Injectable({
  providedIn: 'root'
})
export class EtagereService {
  private etageres: Etagere[] = [
    { id: 1, nom_etagere: 'Etagere A', code: 'ETA001', zone: 'Zone 1' },
    { id: 2, nom_etagere: 'Etagere B', code: 'ETA002', zone: 'Zone 2' }
  ];

  constructor() { }

  getEtageres(): Etagere[] {
    return this.etageres;
  }

  addEtagere(etagere: Etagere): void {
    etagere.id = this.etageres.length + 1;
    this.etageres.push(etagere);
  }

  updateEtagere(etagere: Etagere): void {
    const index = this.etageres.findIndex(e => e.id === etagere.id);
    if (index !== -1) {
      this.etageres[index] = etagere;
    }
  }

  deleteEtagere(id: number): void {
    this.etageres = this.etageres.filter(e => e.id !== id);
  }

  getTotalEtageres(): number {
    return this.etageres.length;
  }
}