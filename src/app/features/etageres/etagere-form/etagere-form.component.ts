import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EtagereService } from '../../../core/services/etagere.service';
import { DepotService } from '../../../core/services/depot.service';
import { ProductService } from '../../../core/services/product.service';
import { Etagere } from '../../../shared/models/etagere.model';
import { Depot } from '../../../shared/models/depot.model';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-etagere-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './etagere-form.component.html'
})
export class EtagereFormComponent implements OnInit {
  etagereForm!: FormGroup;
  etagereId?: number;
  loading = false;
  submitting = false;
  toastMessage = '';
  toastType = 'success';
  
  depots: Depot[] = [];
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private etagereService: EtagereService,
    private depotService: DepotService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.etagereForm = this.fb.group({
      etagere_code: ['', Validators.required],
      name: ['', Validators.required],
      depot_id: [null, Validators.required],
      product_id: [null],
      section: [''],
      quantity: [0, Validators.min(0)],
      max_capacity: [100, Validators.min(1)]
    });

    this.depotService.getAll().subscribe(d => this.depots = d);
    this.productService.getAll().subscribe(p => this.products = p);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.etagereId = +idParam;
      this.loadEtagere();
    }
  }

  loadEtagere(): void {
    this.loading = true;
    this.etagereService.getById(this.etagereId!).subscribe({
      next: (etagere: Etagere) => {
        this.etagereForm.patchValue(etagere);
        this.loading = false;
      },
      error: (err) => {
        this.showToast(err.message, 'danger');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.etagereForm.invalid) return;
    this.submitting = true;

    // Convert product_id empty string to null
    const formVal = { ...this.etagereForm.value };
    if (!formVal.product_id) formVal.product_id = null;

    const request = this.etagereId 
      ? this.etagereService.update(this.etagereId, formVal)
      : this.etagereService.create(formVal);

    request.subscribe({
      next: () => {
        this.showToast('Etagere saved successfully!', 'success');
        setTimeout(() => this.router.navigate(['/etageres']), 1000);
      },
      error: (err) => {
        this.showToast(err.message, 'danger');
        this.submitting = false;
      }
    });
  }

  showToast(message: string, type: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}
