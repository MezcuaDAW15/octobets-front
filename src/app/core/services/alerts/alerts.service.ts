import {
  Injectable, Injector, ApplicationRef, ComponentFactoryResolver,
  Inject, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import MicroModal from 'micromodal';
import { AlertModalComponent, AlertType } from '../../../shared/alert-modal/alert-modal.component';

interface AlertOptions {
  title: string;
  message: string;
  type?: AlertType;
}
@Injectable({ providedIn: 'root' })
export class AlertsService {
  private counter = 0;
  private readonly isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private injector: Injector,
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Init solo una vez en cliente
    if (this.isBrowser) {
      MicroModal.init({ openClass: 'is-open', disableScroll: true });
    }
  }

  info = (t: string, m: string) => this.open({ title: t, message: m, type: 'info' });
  success = (t: string, m: string) => this.open({ title: t, message: m, type: 'success' });
  error = (t: string, m: string) => this.open({ title: t, message: m, type: 'error' });

  confirm(title: string, message: string): Promise<boolean> {
    return new Promise(res =>
      this.open({
        title, message, type: 'confirm',
        onConfirm: () => res(true),
        onCancel: () => res(false)
      })
    );
  }

  private open(
    opts: AlertOptions & { onConfirm?: () => void; onCancel?: () => void }
  ): void {
    if (!this.isBrowser) return;

    const id = `alert-${++this.counter}`;

    const compRef = this.cfr
      .resolveComponentFactory(AlertModalComponent)
      .create(this.injector);

    Object.assign(compRef.instance, {
      id,
      title: opts.title,
      message: opts.message,
      type: opts.type ?? 'info'
    });

    compRef.instance.confirm.subscribe(() => opts.onConfirm?.());
    compRef.instance.cancel.subscribe(() => opts.onCancel?.());

    this.appRef.attachView(compRef.hostView);
    document.body.appendChild(compRef.location.nativeElement);

    compRef.changeDetectorRef.detectChanges();

    setTimeout(() => {
      MicroModal.show(id, {
        onClose: () => {
          this.appRef.detachView(compRef.hostView);
          compRef.destroy();
        }
      });
    }, 0);
  }

}
