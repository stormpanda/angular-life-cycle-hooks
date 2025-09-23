import { CommonModule } from '@angular/common';
import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-ng-do-check-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container">
      <div class="demo-header">
        <h1>ngDoCheck Demo</h1>
        <p>Custom change detection for complex objects and arrays</p>
        <button class="reset-btn" (click)="resetDemo()">Reset Demo</button>
      </div>

      <div class="demo-content">
        <div class="controls-section">
          <h3>Modify Data to Trigger ngDoCheck</h3>

          <div class="control-group">
            <label>Simple String (Angular detects automatically):</label>
            <input
              type="text"
              [(ngModel)]="simpleString"
              placeholder="Type here"
            />
            <small>This triggers normal change detection</small>
          </div>

          <div class="control-group">
            <label>Complex Object (ngDoCheck detects deep changes):</label>
            <div class="object-controls">
              <input
                type="text"
                [(ngModel)]="complexObject.name"
                placeholder="Name"
              />
              <input
                type="number"
                [(ngModel)]="complexObject.age"
                placeholder="Age"
              />
              <input
                type="text"
                [(ngModel)]="complexObject.city"
                placeholder="City"
              />
            </div>
            <small>Deep object changes detected by custom ngDoCheck</small>
          </div>

          <div class="control-group">
            <label>Array (ngDoCheck detects array mutations):</label>
            <div class="array-controls">
              <input type="text" #newItem placeholder="New item" />
              <button (click)="addArrayItem(newItem.value); newItem.value = ''">
                Add Item
              </button>
              <button
                (click)="removeLastItem()"
                [disabled]="arrayData.length === 0"
              >
                Remove Last
              </button>
              <button
                (click)="shuffleArray()"
                [disabled]="arrayData.length < 2"
              >
                Shuffle
              </button>
            </div>
            <div class="array-display">
              <span
                *ngFor="let item of arrayData; let i = index"
                class="array-item"
              >
                {{ item }}
                <button (click)="removeArrayItem(i)">×</button>
              </span>
            </div>
            <small>Array mutations detected by custom ngDoCheck</small>
          </div>

          <div class="control-group">
            <label>Nested Object (Deep change detection):</label>
            <div class="nested-controls">
              <input
                type="text"
                [(ngModel)]="nestedObject.user.profile.firstName"
                placeholder="First Name"
              />
              <input
                type="text"
                [(ngModel)]="nestedObject.user.profile.lastName"
                placeholder="Last Name"
              />
              <input
                type="text"
                [(ngModel)]="nestedObject.user.settings.theme"
                placeholder="Theme"
              />
            </div>
            <small>Even deeply nested changes are detected</small>
          </div>
        </div>

        <div class="detection-info">
          <h3>Change Detection Statistics</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">ngDoCheck calls:</span>
              <span class="stat-value">{{ doCheckCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Simple string changes:</span>
              <span class="stat-value">{{ simpleStringChanges }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Complex object changes:</span>
              <span class="stat-value">{{ complexObjectChanges }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Array changes:</span>
              <span class="stat-value">{{ arrayChanges }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Nested object changes:</span>
              <span class="stat-value">{{ nestedObjectChanges }}</span>
            </div>
          </div>

          <div class="current-values">
            <h4>Current Values (Live Preview)</h4>
            <div class="value-display">
              <div class="value-item">
                <strong>Simple String:</strong> "{{ simpleString }}"
              </div>
              <div class="value-item">
                <strong>Complex Object:</strong>
                <pre>{{ complexObject | json }}</pre>
              </div>
              <div class="value-item">
                <strong>Array:</strong>
                <pre>{{ arrayData | json }}</pre>
              </div>
              <div class="value-item">
                <strong>Nested Object:</strong>
                <pre>{{ nestedObject | json }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="logs-section">
        <h3>ngDoCheck Logs (Limited to prevent spam)</h3>
        <div class="logs-container">
          <div
            class="log-entry"
            *ngFor="let log of recentLogs; trackBy: trackByTimestamp"
          >
            <div class="log-header">
              <span class="component-name">{{ log.component }}</span>
              <span class="timestamp">{{
                log.timestamp | date : 'HH:mm:ss.SSS'
              }}</span>
            </div>
            <div class="log-message">{{ log.message }}</div>
          </div>
          <div class="no-logs" *ngIf="recentLogs.length === 0">
            ngDoCheck logs will appear here when changes are detected.
          </div>
        </div>
      </div>

      <div class="explanation">
        <h3>Understanding ngDoCheck</h3>
        <div class="explanation-grid">
          <div class="explanation-item warning">
            <h4>⚠️ Performance Warning</h4>
            <p>
              ngDoCheck runs on EVERY change detection cycle, which can be very
              frequent. Use it carefully and avoid heavy operations inside
              ngDoCheck.
            </p>
          </div>
          <div class="explanation-item info">
            <h4>🎯 When to Use</h4>
            <p>
              Use ngDoCheck when you need to detect changes in complex objects,
              arrays, or nested structures that Angular's default change
              detection might miss.
            </p>
          </div>
          <div class="explanation-item tip">
            <h4>💡 Best Practices</h4>
            <p>
              Cache previous values using JSON.stringify() or immutable
              comparison. Always check if changes actually occurred before
              taking action.
            </p>
          </div>
          <div class="explanation-item example">
            <h4>🔍 Detection Strategy</h4>
            <p>
              This demo uses JSON.stringify() to compare object states, which is
              simple but not the most performant for large objects.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './ng-do-check-demo.component.scss',
  providers: [LoggerService],
})
export class NgDoCheckDemoComponent implements OnInit, DoCheck, OnDestroy {
  // Data properties
  simpleString = 'Hello World';
  complexObject = {
    name: 'John Doe',
    age: 30,
    city: 'New York',
  };
  arrayData: string[] = ['Item 1', 'Item 2', 'Item 3'];
  nestedObject = {
    user: {
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
      },
      settings: {
        theme: 'dark',
      },
    },
  };

  // Tracking previous states
  private previousSimpleString = '';
  private previousComplexObject = '';
  private previousArrayData = '';
  private previousNestedObject = '';

  // Statistics
  doCheckCount = 0;
  simpleStringChanges = 0;
  complexObjectChanges = 0;
  arrayChanges = 0;
  nestedObjectChanges = 0;

  // Logs (limited to prevent UI spam)
  recentLogs: any[] = [];
  private maxLogs = 20;

  constructor(public logger: LoggerService) {
    this.logger.log('NgDoCheckDemoComponent', 'Constructor called');
    this.initializePreviousStates();
  }

  ngOnInit(): void {
    this.logger.log('NgDoCheckDemoComponent', 'ngOnInit called');
  }

  ngDoCheck(): void {
    this.doCheckCount++;

    // Check simple string
    if (this.simpleString !== this.previousSimpleString) {
      this.simpleStringChanges++;
      this.addRecentLog(
        `Simple string changed: "${this.previousSimpleString}" → "${this.simpleString}"`
      );
      this.previousSimpleString = this.simpleString;
    }

    // Check complex object
    const currentComplexObject = JSON.stringify(this.complexObject);
    if (currentComplexObject !== this.previousComplexObject) {
      this.complexObjectChanges++;
      this.addRecentLog(
        `Complex object changed: ${this.previousComplexObject} → ${currentComplexObject}`
      );
      this.previousComplexObject = currentComplexObject;
    }

    // Check array
    const currentArrayData = JSON.stringify(this.arrayData);
    if (currentArrayData !== this.previousArrayData) {
      this.arrayChanges++;
      this.addRecentLog(
        `Array changed: ${this.previousArrayData} → ${currentArrayData}`
      );
      this.previousArrayData = currentArrayData;
    }

    // Check nested object
    const currentNestedObject = JSON.stringify(this.nestedObject);
    if (currentNestedObject !== this.previousNestedObject) {
      this.nestedObjectChanges++;
      this.addRecentLog(`Nested object changed: Deep change detected`);
      this.previousNestedObject = currentNestedObject;
    }

    // Log every 50th doCheck call to show frequency
    if (this.doCheckCount % 50 === 0) {
      this.addRecentLog(`ngDoCheck called ${this.doCheckCount} times total`);
    }
  }

  ngOnDestroy(): void {
    this.logger.log('NgDoCheckDemoComponent', 'ngOnDestroy called');
  }

  private initializePreviousStates(): void {
    this.previousSimpleString = this.simpleString;
    this.previousComplexObject = JSON.stringify(this.complexObject);
    this.previousArrayData = JSON.stringify(this.arrayData);
    this.previousNestedObject = JSON.stringify(this.nestedObject);
  }

  private addRecentLog(message: string): void {
    const logEntry = {
      timestamp: new Date(),
      component: 'NgDoCheckDemoComponent',
      message: message,
    };

    this.recentLogs.unshift(logEntry);

    // Keep only recent logs to prevent memory issues
    if (this.recentLogs.length > this.maxLogs) {
      this.recentLogs = this.recentLogs.slice(0, this.maxLogs);
    }

    // Also log to the main logger service
    this.logger.log('NgDoCheckDemoComponent', message);
  }

  // Array manipulation methods
  addArrayItem(item: string): void {
    if (item.trim()) {
      this.arrayData.push(item.trim());
    }
  }

  removeLastItem(): void {
    this.arrayData.pop();
  }

  removeArrayItem(index: number): void {
    this.arrayData.splice(index, 1);
  }

  shuffleArray(): void {
    for (let i = this.arrayData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.arrayData[i], this.arrayData[j]] = [
        this.arrayData[j],
        this.arrayData[i],
      ];
    }
  }

  resetDemo(): void {
    this.simpleString = 'Hello World';
    this.complexObject = {
      name: 'John Doe',
      age: 30,
      city: 'New York',
    };
    this.arrayData = ['Item 1', 'Item 2', 'Item 3'];
    this.nestedObject = {
      user: {
        profile: {
          firstName: 'Jane',
          lastName: 'Smith',
        },
        settings: {
          theme: 'dark',
        },
      },
    };

    this.doCheckCount = 0;
    this.simpleStringChanges = 0;
    this.complexObjectChanges = 0;
    this.arrayChanges = 0;
    this.nestedObjectChanges = 0;
    this.recentLogs = [];

    this.initializePreviousStates();
    this.logger.clear();
    this.logger.log('NgDoCheckDemoComponent', 'Demo reset');
  }

  trackByTimestamp(index: number, item: any): any {
    return item.timestamp;
  }
}
