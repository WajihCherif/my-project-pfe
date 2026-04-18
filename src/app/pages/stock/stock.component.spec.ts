import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockComponent } from './stock.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { DepotService } from '../../core/services/depot.service';
import { EtagereService } from '../../core/services/etagere.service';
import { TransferService } from '../../core/services/transfer.service';
import { of } from 'rxjs';

declare var describe: any;
declare var beforeEach: any;
declare var it: any;
declare var expect: any;

describe('StockComponent', () => {
  let component: StockComponent;
  let fixture: ComponentFixture<StockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StockComponent, // Since it's a standalone component
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: ProductService, useValue: { getAll: () => of([]) } },
        { provide: DepotService, useValue: { getAll: () => of([]) } },
        { provide: EtagereService, useValue: { getAll: () => of([]) } },
        { provide: TransferService, useValue: { getAll: () => of([]) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate statistics correctly', () => {
    // Mock data
    component.products = [
      { id: 1, product_code: 'P1', name: 'Prod 1', price: 10 }
    ];
    component.etageres = [
      { id: 101, etagere_code: 'E1', name: 'Shelf 1', depot_id: 1, product_id: 1, quantity_etagere: 5, max_capacity: 100 },
      { id: 102, etagere_code: 'E2', name: 'Shelf 2', depot_id: 1, product_id: 1, quantity_etagere: 2, max_capacity: 100 } // Low stock (<= 20%)
    ];

    component.calculateStats();

    expect(component.totalStockValue).toBe(70); // (5 * 10) + (2 * 10)
    expect(component.lowStockCount).toBe(1);    // Only Shelf 2 is <= 20%
  });
});