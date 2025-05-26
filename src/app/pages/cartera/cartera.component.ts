import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { CarteraService } from '../../core/services/cartera/cartera.service';
import { FormBuilder, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AlertsService } from '../../core/services/alerts/alerts.service';
import { environment } from '../../../environments/environment';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cartera',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cartera.component.html',
  styleUrl: './cartera.component.scss'
})
export class CarteraComponent implements OnInit, AfterViewInit {

  /* --------- Stripe --------- */
  private stripe: Stripe | null = null;
  private elements!: StripeElements;

  /* --------- UI state ------- */
  loading = signal(false);
  balance = signal<number>(0);

  /* --------- Forms ---------- */
  buyForm: FormGroup;
  withdrawForm: FormGroup;

  private readonly isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private cartera: CarteraService,
    private alerts: AlertsService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.buyForm = this.fb.group({
      euros: [null, [Validators.required, Validators.min(1)]],
    });
    this.withdrawForm = this.fb.group({
      chips: [null, [Validators.required, Validators.min(100)]],
    });
  }

  /* ---------- lifecycle ---------- */
  ngOnInit(): void {
    this.cartera.balance().subscribe(b => this.balance.set(b));
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;

    /* 1. Stripe desde global window (sdk ya cargado en index.html) */
    this.stripe = (window as any).Stripe(environment.stripeKey);
    if (!this.stripe) {
      this.alerts.error('Stripe', 'No se pudo inicializar el servicio de pagos.');
      return;
    }

    /* 2. Elements */
    this.elements = this.stripe.elements();
    const card = this.elements.create('card');
    card.mount('#card-element');
  }

  /* ---------- COMPRAR ---------- */
  async onBuy(): Promise<void> {
    if (this.buyForm.invalid || !this.stripe) {
      this.buyForm.markAllAsTouched();
      return;
    }

    const euros = this.buyForm.value.euros!;
    const chips = euros * 100;
    this.loading.set(true);

    this.cartera.buyChips(chips).subscribe({
      next: async clientSecret => {
        const { error } = await this.stripe!.confirmCardPayment(clientSecret, {
          payment_method: { card: this.elements.getElement('card')! }
        });
        if (error) {
          this.alerts.error('Pago rechazado', error.message ?? '');
        } else {
          this.alerts.success('¡Compra realizada!', `Se añadieron ${chips} fichas.`);
          this.balance.update(b => b + chips);
          this.buyForm.reset();
        }
      },
      error: () => this.alerts.error('Error', 'No se pudo iniciar el pago.'),
      complete: () => this.loading.set(false)
    });
  }

  /* ---------- RETIRAR ---------- */
  onWithdraw(): void {
    if (this.withdrawForm.invalid) {
      this.withdrawForm.markAllAsTouched();
      return;
    }

    const chips = this.withdrawForm.value.chips!;
    this.loading.set(true);

    this.cartera.withdrawChips(chips).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => {
        this.alerts.success('Retiro efectuado', `Has retirado ${chips} fichas.`);
        this.balance.update(b => b - chips);
        this.withdrawForm.reset();
      },
      error: err => {
        const code = typeof err.error === 'object' ? err.error.code : null;
        if (code === 'INSUFFICIENT_CHIPS') {
          this.alerts.info('Saldo insuficiente', 'No tienes tantas fichas.');
        } else {
          this.alerts.error('Error', 'No se pudo procesar el retiro.');
        }
      }
    });
  }
}
