import { Component } from '@angular/core';
import { InfiniteScrollComponent } from './infinite-scroll.component';

@Component({
  selector: 'app-infinite-scroll-demo',
  templateUrl: './infinite-scroll-demo.component.html',
  standalone: true,
  imports: [InfiniteScrollComponent]
})
export class InfiniteScrollDemoComponent {
  // Demo component logic here
}
