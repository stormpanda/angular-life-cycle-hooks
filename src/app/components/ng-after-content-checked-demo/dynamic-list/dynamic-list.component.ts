import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dynamic-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dynamic-list-container">
      <div class="list-header">
        <h4>Dynamic Content List</h4>
        <div class="list-info">Items will appear below as they are added</div>
      </div>
      <div class="list-content">
        <ng-content></ng-content>
      </div>
      <div class="list-footer" *ngIf="hasContent">
        <small>Content projected from parent component</small>
      </div>
    </div>
  `,
  styles: [
    `
      .dynamic-list-container {
        background: white;
        border-radius: 8px;
        border: 1px solid #dee2e6;
        overflow: hidden;
      }

      .list-header {
        background: #f8f9fa;
        padding: 1rem;
        border-bottom: 1px solid #dee2e6;

        h4 {
          margin: 0 0 0.5rem 0;
          color: #495057;
        }

        .list-info {
          font-size: 0.875rem;
          color: #6c757d;
        }
      }

      .list-content {
        padding: 1rem;
        min-height: 100px;

        &:empty::before {
          content: 'No items to display';
          color: #6c757d;
          font-style: italic;
          display: block;
          text-align: center;
          padding: 2rem;
        }
      }

      .list-footer {
        background: #f8f9fa;
        padding: 0.5rem 1rem;
        border-top: 1px solid #dee2e6;
        text-align: center;

        small {
          color: #6c757d;
        }
      }
    `,
  ],
})
export class DynamicListComponent {
  hasContent = true;
}
