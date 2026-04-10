import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  productId?: number;
  loading = false;
  submitting = false;
  toastMessage = '';
  toastType = 'success';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      product_code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      category: [''],
      barcode: [''],
      price: [0, Validators.min(0)],
      unit: ['piece']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = +idParam;
      this.loadProduct();
    }
  }

  loadProduct(): void {
    this.loading = true;
    this.productService.getById(this.productId!).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue(product);
        this.loading = false;
      },
      error: (err) => {
        this.showToast(err.message, 'danger');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;
    this.submitting = true;

    const request = this.productId 
      ? this.productService.update(this.productId, this.productForm.value)
      : this.productService.create(this.productForm.value);

    request.subscribe({
      next: () => {
        this.showToast('Product saved successfully!', 'success');
        setTimeout(() => this.router.navigate(['/products']), 1000);
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
