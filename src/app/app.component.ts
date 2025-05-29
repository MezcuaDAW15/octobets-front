import { TitleService } from './core/services/title.service';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./shared/layout/sidebar/sidebar.component";
import { FooterComponent } from "./shared/layout/footer/footer.component";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'octobets-front';

  private router = inject(Router);

  showSidebar = signal(true);

  constructor(
    private titleService: TitleService
  ) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => this.showSidebar.set(this.resolveSidebar(this.router.routerState.snapshot.root)));

    this.titleService.init();
  }

  private resolveSidebar(snap: ActivatedRouteSnapshot): boolean {
    let node: ActivatedRouteSnapshot | null = snap;
    while (node?.firstChild) node = node.firstChild;
    return node?.data?.['sidebar'] !== false;
  }
}


