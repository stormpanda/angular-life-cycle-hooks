import { CommonModule } from '@angular/common';
import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  QueryList,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '../../services/logger.service';
import { DynamicListComponent } from './dynamic-list/dynamic-list.component';

@Component({
  selector: 'app-ng-after-content-checked-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicListComponent],
  template: `
    <div class="demo-container">
      <div class="demo-header">
        <h1>ngAfterContentChecked Demo</h1>
        <p>Demonstrates content change detection and frequent hook execution</p>
      </div>

      <div class="demo-content">
        <div class="dynamic-content-section">
          <h3>Dynamic Content Projection</h3>

          <div class="controls">
            <button (click)="addListItem()">Add List Item</button>
            <button
              (click)="removeListItem()"
              [disabled]="dynamicItems.length === 0"
            >
              Remove List Item
            </button>
            <button
              (click)="toggleItem()"
              [disabled]="dynamicItems.length === 0"
            >
              Toggle Last Item
            </button>
            <button (click)="clearItems()">Clear All</button>
          </div>

          <app-dynamic-list>
            <div
              *ngFor="
                let item of dynamicItems;
                let i = index;
                trackBy: trackByIndex
              "
              class="list-item"
              [class.highlighted]="item.highlighted"
            >
              <span class="item-number">{{ i + 1 }}.</span>
              <span class="item-text">{{ item.text }}</span>
              <span class="item-status" [class.active]="item.active">
                {{ item.active ? '✅ Active' : '⏸️ Inactive' }}
              </span>
              <button (click)="toggleItemActive(i)" class="toggle-btn">
                {{ item.active ? 'Deactivate' : 'Activate' }}
              </button>
            </div>
          </app-dynamic-list>

          <div class="content-stats">
            <div class="stat-item">
              <span class="stat-label">Total Items:</span>
              <span class="stat-value">{{ dynamicItems.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Active Items:</span>
              <span class="stat-value">{{ getActiveItemsCount() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Highlighted Items:</span>
              <span class="stat-value">{{ getHighlightedItemsCount() }}</span>
            </div>
          </div>
        </div>

        <div class="check-frequency-section">
          <h3>Hook Execution Frequency</h3>
          <div class="frequency-info">
            <div class="frequency-item">
              <span class="frequency-label">ngAfterContentChecked calls:</span>
              <span class="frequency-value">{{ contentCheckedCount }}</span>
            </div>
            <div class="frequency-item">
              <span class="frequency-label">Last check time:</span>
              <span class="frequency-value">{{
                lastCheckTime | date : 'HH:mm:ss.SSS'
              }}</span>
            </div>
            <div class="frequency-item">
              <span class="frequency-label">Content changes detected:</span>
              <span class="frequency-value">{{ contentChangesCount }}</span>
            </div>
          </div>

          <div class="performance-warning">
            ⚠️ <strong>Performance Note:</strong> This hook runs after every
            change detection cycle. Avoid heavy operations here to prevent
            performance issues.
          </div>
        </div>

        <div class="trigger-changes-section">
          <h3>Trigger Change Detection</h3>
          <div class="trigger-controls">
            <button (click)="triggerSimpleChange()">
              Simple Property Change
            </button>
            <button (click)="triggerComplexChange()">
              Complex Object Change
            </button>
            <button
              (click)="startAutoUpdates()"
              [disabled]="autoUpdateInterval"
            >
              Start Auto Updates
            </button>
            <button
              (click)="stopAutoUpdates()"
              [disabled]="!autoUpdateInterval"
            >
              Stop Auto Updates
            </button>
          </div>

          <div class="change-info">
            <div class="change-item">
              <span class="change-label">Simple Counter:</span>
              <span class="change-value">{{ simpleCounter }}</span>
            </div>
            <div class="change-item">
              <span class="change-label">Complex Object Updates:</span>
              <span class="change-value">{{ complexObject.updateCount }}</span>
            </div>
            <div class="change-item">
              <span class="change-label">Auto Updates:</span>
              <span class="change-value">{{
                autoUpdateInterval ? 'Running' : 'Stopped'
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="logs-section">
        <h3>Lifecycle Logs (Latest 20)</h3>
        <div class="log-controls">
          <button (click)="logger.clear()">Clear Logs</button>
          <button (click)="toggleLogPause()">
            {{ logsPaused ? 'Resume' : 'Pause' }} Logging
          </button>
        </div>
        <div class="logs-container">
          <div class="log-entry" *ngFor="let log of getRecentLogs()">
            <div class="log-header">
              <span class="component-name">{{ log.component }}</span>
              <span class="timestamp">{{
                log.timestamp | date : 'HH:mm:ss.SSS'
              }}</span>
            </div>
            <div class="log-message">{{ log.message }}</div>
          </div>
        </div>
      </div>

      <div class="explanation">
        <h3>ngAfterContentChecked Key Points</h3>
        <div class="key-points">
          <div class="point-item danger">
            <h4>⚠️ High Frequency</h4>
            <p>
              Called after every change detection cycle - can impact performance
              if misused
            </p>
          </div>
          <div class="point-item warning">
            <h4>🔍 Content Monitoring</h4>
            <p>
              Useful for monitoring changes in projected content dynamically
            </p>
          </div>
          <div class="point-item success">
            <h4>💡 Use Sparingly</h4>
            <p>
              Keep operations lightweight and consider alternatives like OnPush
              strategy
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './ng-after-content-checked-demo.component.scss',
  providers: [LoggerService],
})
export class NgAfterContentCheckedDemoComponent
  implements AfterContentInit, AfterContentChecked
{
  @ContentChildren('.list-item') contentItems!: QueryList<ElementRef>;

  dynamicItems: Array<{
    id: number;
    text: string;
    active: boolean;
    highlighted: boolean;
  }> = [];

  contentCheckedCount = 0;
  contentChangesCount = 0;
  lastCheckTime = new Date();
  previousContentCount = 0;
  simpleCounter = 0;
  complexObject = { updateCount: 0, data: {} };
  autoUpdateInterval?: ReturnType<typeof setInterval>;
  logsPaused = false;

  private nextItemId = 1;

  constructor(public logger: LoggerService) {
    this.logger.log('NgAfterContentCheckedDemo', 'Constructor called');

    // Initialize with some items
    this.addListItem();
    this.addListItem();
  }

  ngAfterContentInit(): void {
    this.logger.log('NgAfterContentCheckedDemo', 'ngAfterContentInit called');
    this.previousContentCount = this.dynamicItems.length;
  }

  ngAfterContentChecked(): void {
    this.contentCheckedCount++;
    this.lastCheckTime = new Date();

    // Check for content changes
    const currentContentCount = this.dynamicItems.length;
    if (currentContentCount !== this.previousContentCount) {
      this.contentChangesCount++;
      this.previousContentCount = currentContentCount;

      if (!this.logsPaused) {
        this.logger.log(
          'NgAfterContentCheckedDemo',
          `Content change detected: ${this.previousContentCount} → ${currentContentCount} items`
        );
      }
    }

    // Log frequency occasionally (every 50 calls) to avoid log spam
    if (this.contentCheckedCount % 50 === 0 && !this.logsPaused) {
      this.logger.log(
        'NgAfterContentCheckedDemo',
        `Hook called ${this.contentCheckedCount} times (Content changes: ${this.contentChangesCount})`
      );
    }
  }

  addListItem(): void {
    const item = {
      id: this.nextItemId++,
      text: `Dynamic Item ${this.nextItemId - 1}`,
      active: Math.random() > 0.5,
      highlighted: false,
    };
    this.dynamicItems.push(item);

    if (!this.logsPaused) {
      this.logger.log('NgAfterContentCheckedDemo', `Added item: ${item.text}`);
    }
  }

  removeListItem(): void {
    if (this.dynamicItems.length > 0) {
      const removed = this.dynamicItems.pop();
      if (!this.logsPaused) {
        this.logger.log(
          'NgAfterContentCheckedDemo',
          `Removed item: ${removed?.text}`
        );
      }
    }
  }

  toggleItem(): void {
    if (this.dynamicItems.length > 0) {
      const lastItem = this.dynamicItems[this.dynamicItems.length - 1];
      lastItem.highlighted = !lastItem.highlighted;

      if (!this.logsPaused) {
        this.logger.log(
          'NgAfterContentCheckedDemo',
          `Toggled highlight for: ${lastItem.text} (${
            lastItem.highlighted ? 'ON' : 'OFF'
          })`
        );
      }
    }
  }

  clearItems(): void {
    const count = this.dynamicItems.length;
    this.dynamicItems = [];

    if (!this.logsPaused) {
      this.logger.log('NgAfterContentCheckedDemo', `Cleared ${count} items`);
    }
  }

  toggleItemActive(index: number): void {
    const item = this.dynamicItems[index];
    item.active = !item.active;

    if (!this.logsPaused) {
      this.logger.log(
        'NgAfterContentCheckedDemo',
        `Toggled ${item.text}: ${item.active ? 'Active' : 'Inactive'}`
      );
    }
  }

  triggerSimpleChange(): void {
    this.simpleCounter++;
    if (!this.logsPaused) {
      this.logger.log(
        'NgAfterContentCheckedDemo',
        `Simple counter incremented to ${this.simpleCounter}`
      );
    }
  }

  triggerComplexChange(): void {
    this.complexObject = {
      updateCount: this.complexObject.updateCount + 1,
      data: { timestamp: new Date(), random: Math.random() },
    };

    if (!this.logsPaused) {
      this.logger.log(
        'NgAfterContentCheckedDemo',
        `Complex object updated (count: ${this.complexObject.updateCount})`
      );
    }
  }

  startAutoUpdates(): void {
    this.autoUpdateInterval = setInterval(() => {
      this.triggerSimpleChange();
      if (Math.random() > 0.7) {
        this.triggerComplexChange();
      }
    }, 1000);

    if (!this.logsPaused) {
      this.logger.log(
        'NgAfterContentCheckedDemo',
        'Auto updates started (1s interval)'
      );
    }
  }

  stopAutoUpdates(): void {
    if (this.autoUpdateInterval) {
      clearInterval(this.autoUpdateInterval);
      this.autoUpdateInterval = undefined;

      if (!this.logsPaused) {
        this.logger.log('NgAfterContentCheckedDemo', 'Auto updates stopped');
      }
    }
  }

  toggleLogPause(): void {
    this.logsPaused = !this.logsPaused;
    this.logger.log(
      'NgAfterContentCheckedDemo',
      `Logging ${this.logsPaused ? 'paused' : 'resumed'}`
    );
  }

  getActiveItemsCount(): number {
    return this.dynamicItems.filter((item) => item.active).length;
  }

  getHighlightedItemsCount(): number {
    return this.dynamicItems.filter((item) => item.highlighted).length;
  }

  getRecentLogs() {
    return this.logger.logs.slice(-20);
  }

  trackByIndex(index: number): number {
    return index;
  }

  ngOnDestroy(): void {
    this.stopAutoUpdates();
  }
}
