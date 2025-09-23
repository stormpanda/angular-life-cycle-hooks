import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header" *ngIf="hasHeader">
        <ng-content select=".header"></ng-content>
      </div>
      <div class="card-body">
        <ng-content select=".content"></ng-content>
      </div>
      <div class="card-footer" *ngIf="hasFooter">
        <ng-content select=".footer"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .card-header {
        background: #f8f9fa;
        padding: 1rem;
        border-bottom: 1px solid #dee2e6;

        :ng-deep h2 {
          margin: 0;
          color: #495057;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        :ng-deep .badge {
          background: #007bff;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
        }
      }

      .card-body {
        padding: 1rem;
      }

      .card-footer {
        background: #f8f9fa;
        padding: 0.75rem 1rem;
        border-top: 1px solid #dee2e6;
        text-align: center;

        :ng-deep small {
          color: #6c757d;
        }
      }
    `,
  ],
})
export class CardComponent implements AfterContentInit {
  @ContentChild('.header', { read: ElementRef }) headerContent?: ElementRef;
  @ContentChild('.footer', { read: ElementRef }) footerContent?: ElementRef;

  hasHeader = false;
  hasFooter = false;

  ngAfterContentInit(): void {
    // Check if header/footer content exists
    setTimeout(() => {
      this.hasHeader = !!document.querySelector('.header');
      this.hasFooter = !!document.querySelector('.footer');
    });
  }
}
