import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  QueryList,
} from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tabs-container">
      <div class="tab-headers">
        <button
          *ngFor="let tab of tabs; let i = index"
          class="tab-header"
          [class.active]="activeTabIndex === i"
          (click)="selectTab(i)"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="tab-content-container">
        <div
          *ngFor="let tab of tabs; let i = index"
          class="tab-panel"
          [class.active]="activeTabIndex === i"
          [innerHTML]="tab.content"
        ></div>
      </div>
    </div>
  `,
  styles: [
    `
      .tabs-container {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .tab-headers {
        display: flex;
        background: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
      }

      .tab-header {
        padding: 1rem 1.5rem;
        background: none;
        border: none;
        cursor: pointer;
        font-weight: 500;
        color: #6c757d;
        transition: all 0.2s;

        &:hover {
          background: #e9ecef;
          color: #495057;
        }

        &.active {
          background: white;
          color: #007bff;
          border-bottom: 3px solid #007bff;
        }
      }

      .tab-content-container {
        position: relative;
        min-height: 200px;
      }

      .tab-panel {
        padding: 1.5rem;
        display: none;

        &.active {
          display: block;
        }
      }
    `,
  ],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren('[tab-label]', { read: ElementRef })
  tabElements!: QueryList<ElementRef>;

  tabs: Array<{ label: string; content: string }> = [];
  activeTabIndex = 0;

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.initializeTabs();
    });
  }

  private initializeTabs(): void {
    const tabElements = document.querySelectorAll('[tab-label]');
    this.tabs = Array.from(tabElements).map((element) => ({
      label: element.getAttribute('tab-label') || 'Tab',
      content: element.innerHTML,
    }));
  }

  selectTab(index: number): void {
    this.activeTabIndex = index;
  }
}
