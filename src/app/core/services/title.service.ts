import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private baseTitle = 'OctoBets';
  private separator = ' | ';

  constructor(
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  init() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary')
    ).subscribe((route) => {
      const title = route.snapshot.data['title'] || '';
      this.setTitle(title);
    });
  }

  setTitle(title: string) {
    if (title) {
      this.title.setTitle(`${this.baseTitle} ${this.separator} ${title}`);
    } else {
      this.title.setTitle(this.baseTitle);
    }
  }

  getTitle(): string {
    return this.title.getTitle();
  }
}
