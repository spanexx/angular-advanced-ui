import { Component, HostListener, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollService } from './infinite-scroll.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class InfiniteScrollComponent implements OnInit, OnDestroy {
  data: any[] = [];
  page = 0;
  loading = false;
  hasMore = true;
  private scrollSubscription: Subscription | undefined;

  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
    private infiniteScrollService: InfiniteScrollService
  ) { }

  ngOnInit(): void {
    this.loadMore();
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  @HostListener('scroll', ['$event']) // Listen to scroll events on the host element
  onScroll(event: any): void {
    // Check if the user has scrolled to the bottom
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 100 && !this.loading && this.hasMore) {
      this.ngZone.run(() => {
        this.loadMore();
      });
    }
  }

  loadMore(): void {
    if (this.loading || !this.hasMore) {
      return;
    }

    this.loading = true;
    this.scrollSubscription = this.infiniteScrollService.getData(this.page, 10).subscribe({
      next: (response) => {
        if (response && response.items && response.items.length > 0) {
          this.data = [...this.data, ...response.items];
          this.page++;
          this.hasMore = response.currentPage < response.totalPages;
        } else {
          this.hasMore = false;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.loading = false;
      }
    });
  }
}

