import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription, fromEvent, interval } from 'rxjs';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-ng-on-destroy-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container">
      <div class="demo-header">
        <h1>ngOnDestroy Demo</h1>
        <p>Demonstrates proper cleanup to prevent memory leaks</p>
        <button class="reset-btn" (click)="resetDemo()">Reset Demo</button>
      </div>

      <div class="demo-content">
        <div class="subscriptions-section">
          <h3>Observable Subscriptions</h3>
          <div class="subscription-item">
            <div class="subscription-info">
              <strong>Timer Subscription:</strong> {{ timerValue }}s
              <span class="status" [class.active]="timerSubscription">
                {{ timerSubscription ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="subscription-controls">
              <button (click)="startTimer()" [disabled]="!!timerSubscription">
                Start Timer
              </button>
              <button (click)="stopTimer()" [disabled]="!timerSubscription">
                Stop Timer
              </button>
            </div>
          </div>

          <div class="subscription-item">
            <div class="subscription-info">
              <strong>Mouse Move Listener:</strong> ({{ mouseX }}, {{ mouseY }})
              <span class="status" [class.active]="mouseMoveSubscription">
                {{ mouseMoveSubscription ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="subscription-controls">
              <button
                (click)="startMouseTracking()"
                [disabled]="!!mouseMoveSubscription"
              >
                Start Tracking
              </button>
              <button
                (click)="stopMouseTracking()"
                [disabled]="!mouseMoveSubscription"
              >
                Stop Tracking
              </button>
            </div>
          </div>

          <div class="subscription-item">
            <div class="subscription-info">
              <strong>HTTP Requests:</strong> {{ ongoingRequests }} active
              <span class="status" [class.active]="ongoingRequests > 0">
                {{ ongoingRequests > 0 ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="subscription-controls">
              <button
                (click)="makeHttpRequest()"
                [disabled]="ongoingRequests >= 3"
              >
                Make Request
              </button>
              <button
                (click)="cancelAllRequests()"
                [disabled]="ongoingRequests === 0"
              >
                Cancel All
              </button>
            </div>
          </div>
        </div>

        <div class="intervals-section">
          <h3>Intervals & Timeouts</h3>
          <div class="interval-item">
            <div class="interval-info">
              <strong>Fast Interval:</strong> {{ fastIntervalCount }}
              <span class="status" [class.active]="fastInterval">
                {{ fastInterval ? 'Running' : 'Stopped' }}
              </span>
            </div>
            <div class="interval-controls">
              <button (click)="startFastInterval()" [disabled]="!!fastInterval">
                Start (500ms)
              </button>
              <button (click)="stopFastInterval()" [disabled]="!fastInterval">
                Stop
              </button>
            </div>
          </div>

          <div class="interval-item">
            <div class="interval-info">
              <strong>Slow Interval:</strong> {{ slowIntervalCount }}
              <span class="status" [class.active]="slowInterval">
                {{ slowInterval ? 'Running' : 'Stopped' }}
              </span>
            </div>
            <div class="interval-controls">
              <button (click)="startSlowInterval()" [disabled]="!!slowInterval">
                Start (2s)
              </button>
              <button (click)="stopSlowInterval()" [disabled]="!slowInterval">
                Stop
              </button>
            </div>
          </div>

          <div class="timeout-section">
            <h3>Pending Timeouts: {{ pendingTimeouts.length }}</h3>
            <button (click)="scheduleTimeout()">Schedule 5s Timeout</button>
            <button
              (click)="clearAllTimeouts()"
              [disabled]="pendingTimeouts.length === 0"
            >
              Clear All
            </button>
            <div class="timeout-list">
              <div
                *ngFor="let timeout of pendingTimeouts; let i = index"
                class="timeout-item"
              >
                Timeout {{ i + 1 }} - {{ timeout.remainingTime }}s remaining
              </div>
            </div>
          </div>
        </div>

        <div class="child-components-section">
          <h3>Child Components (Test Destruction)</h3>
          <div class="child-controls">
            <button (click)="addChildComponent()">Add Child Component</button>
            <button
              (click)="removeChildComponent()"
              [disabled]="childComponents.length === 0"
            >
              Remove Child
            </button>
            <button
              (click)="removeAllChildren()"
              [disabled]="childComponents.length === 0"
            >
              Remove All
            </button>
          </div>
          <div class="child-list">
            <div
              *ngFor="let child of childComponents; let i = index"
              class="child-component"
            >
              <div class="child-header">
                <h4>Child Component {{ child.id }}</h4>
                <button (click)="removeChildById(child.id)">Remove</button>
              </div>
              <p>Created: {{ child.createdAt | date : 'medium' }}</p>
              <p>This child will log when destroyed</p>
            </div>
          </div>
        </div>
      </div>

      <div class="memory-info">
        <h3>Memory & Resources Status</h3>
        <div class="resource-grid">
          <div class="resource-item">
            <span class="resource-label">Active Subscriptions:</span>
            <span class="resource-value">{{
              getActiveSubscriptionsCount()
            }}</span>
          </div>
          <div class="resource-item">
            <span class="resource-label">Running Intervals:</span>
            <span class="resource-value">{{ getActiveIntervalsCount() }}</span>
          </div>
          <div class="resource-item">
            <span class="resource-label">Pending Timeouts:</span>
            <span class="resource-value">{{ pendingTimeouts.length }}</span>
          </div>
          <div class="resource-item">
            <span class="resource-label">HTTP Requests:</span>
            <span class="resource-value">{{ ongoingRequests }}</span>
          </div>
        </div>
      </div>

      <div class="logs-section">
        <h3>Lifecycle Logs</h3>
        <div class="logs-container">
          <div
            class="log-entry"
            *ngFor="let log of logger.logs; trackBy: trackByTimestamp"
          >
            <div class="log-header">
              <span class="component-name">{{ log.component }}</span>
              <span class="timestamp">{{
                log.timestamp | date : 'HH:mm:ss.SSS'
              }}</span>
            </div>
            <div class="log-message">{{ log.message }}</div>
          </div>
          <div class="no-logs" *ngIf="logger.logs.length === 0">
            Logs will appear here showing cleanup activities.
          </div>
        </div>
      </div>

      <div class="explanation">
        <h3>Important: ngOnDestroy Best Practices</h3>
        <div class="best-practices">
          <div class="practice-item danger">
            <h4>❌ Memory Leaks to Avoid</h4>
            <ul>
              <li>Unsubscribed Observables continue running</li>
              <li>Event listeners remain attached to DOM</li>
              <li>Intervals and timeouts keep running</li>
              <li>HTTP requests continue in background</li>
            </ul>
          </div>
          <div class="practice-item success">
            <h4>✅ Proper Cleanup</h4>
            <ul>
              <li>Unsubscribe from all Observables</li>
              <li>Clear intervals and timeouts</li>
              <li>Remove event listeners</li>
              <li>Cancel ongoing HTTP requests</li>
              <li>Clean up references to prevent memory leaks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './ng-on-destroy-demo.component.scss',
  providers: [LoggerService],
})
export class NgOnDestroyDemoComponent implements OnInit, OnDestroy {
  // Subscriptions
  timerSubscription?: Subscription;
  mouseMoveSubscription?: Subscription;
  httpSubscriptions: Subscription[] = [];

  // Values
  timerValue = 0;
  mouseX = 0;
  mouseY = 0;
  ongoingRequests = 0;

  // Intervals
  fastInterval?: ReturnType<typeof setInterval>;
  slowInterval?: ReturnType<typeof setInterval>;
  fastIntervalCount = 0;
  slowIntervalCount = 0;

  // Timeouts
  pendingTimeouts: Array<{
    id: ReturnType<typeof setTimeout>;
    remainingTime: number;
  }> = [];

  // Child components
  childComponents: Array<{ id: number; createdAt: Date }> = [];
  nextChildId = 1;

  constructor(private http: HttpClient, public logger: LoggerService) {
    this.logger.log('NgOnDestroyDemoComponent', 'Constructor called');
  }

  ngOnInit(): void {
    this.logger.log(
      'NgOnDestroyDemoComponent',
      'ngOnInit called - Starting some resources automatically'
    );
    this.startTimer();
    this.addChildComponent();
  }

  ngOnDestroy(): void {
    this.logger.log(
      'NgOnDestroyDemoComponent',
      'ngOnDestroy called - Starting cleanup process'
    );

    this.cleanupSubscriptions();
    this.cleanupIntervals();
    this.cleanupTimeouts();

    this.logger.log(
      'NgOnDestroyDemoComponent',
      'All resources cleaned up successfully'
    );
  }

  private cleanupSubscriptions(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.logger.log(
        'NgOnDestroyDemoComponent',
        'Timer subscription unsubscribed'
      );
    }

    if (this.mouseMoveSubscription) {
      this.mouseMoveSubscription.unsubscribe();
      this.logger.log(
        'NgOnDestroyDemoComponent',
        'Mouse move subscription unsubscribed'
      );
    }

    this.httpSubscriptions.forEach((sub, index) => {
      if (!sub.closed) {
        sub.unsubscribe();
        this.logger.log(
          'NgOnDestroyDemoComponent',
          `HTTP subscription ${index + 1} unsubscribed`
        );
      }
    });
    this.httpSubscriptions = [];
  }

  private cleanupIntervals(): void {
    if (this.fastInterval) {
      clearInterval(this.fastInterval);
      this.fastInterval = undefined;
      this.logger.log('NgOnDestroyDemoComponent', 'Fast interval cleared');
    }

    if (this.slowInterval) {
      clearInterval(this.slowInterval);
      this.slowInterval = undefined;
      this.logger.log('NgOnDestroyDemoComponent', 'Slow interval cleared');
    }
  }

  private cleanupTimeouts(): void {
    this.pendingTimeouts.forEach((timeout, index) => {
      clearTimeout(timeout.id);
      this.logger.log(
        'NgOnDestroyDemoComponent',
        `Timeout ${index + 1} cleared`
      );
    });
    this.pendingTimeouts = [];
  }

  // Timer methods
  startTimer(): void {
    if (!this.timerSubscription) {
      this.timerValue = 0;
      this.timerSubscription = interval(1000).subscribe(() => {
        this.timerValue++;
      });
      this.logger.log('NgOnDestroyDemoComponent', 'Timer started');
    }
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
      this.logger.log('NgOnDestroyDemoComponent', 'Timer stopped manually');
    }
  }

  // Mouse tracking
  startMouseTracking(): void {
    if (!this.mouseMoveSubscription) {
      this.mouseMoveSubscription = fromEvent<MouseEvent>(
        document,
        'mousemove'
      ).subscribe((event) => {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
      });
      this.logger.log('NgOnDestroyDemoComponent', 'Mouse tracking started');
    }
  }

  stopMouseTracking(): void {
    if (this.mouseMoveSubscription) {
      this.mouseMoveSubscription.unsubscribe();
      this.mouseMoveSubscription = undefined;
      this.logger.log(
        'NgOnDestroyDemoComponent',
        'Mouse tracking stopped manually'
      );
    }
  }

  // HTTP requests (simulated)
  makeHttpRequest(): void {
    this.ongoingRequests++;
    const subscription = interval(1000).subscribe({
      next: (value) => {
        if (value >= 3) {
          // Complete after 3 seconds
          subscription.unsubscribe();
          this.ongoingRequests--;
          this.httpSubscriptions = this.httpSubscriptions.filter(
            (s) => s !== subscription
          );
          this.logger.log('NgOnDestroyDemoComponent', 'HTTP request completed');
        }
      },
    });

    this.httpSubscriptions.push(subscription);
    this.logger.log(
      'NgOnDestroyDemoComponent',
      'HTTP request started (simulated)'
    );
  }

  cancelAllRequests(): void {
    this.httpSubscriptions.forEach((sub) => sub.unsubscribe());
    this.httpSubscriptions = [];
    this.ongoingRequests = 0;
    this.logger.log('NgOnDestroyDemoComponent', 'All HTTP requests cancelled');
  }

  // Intervals
  startFastInterval(): void {
    if (!this.fastInterval) {
      this.fastIntervalCount = 0;
      this.fastInterval = setInterval(() => {
        this.fastIntervalCount++;
      }, 500);
      this.logger.log('NgOnDestroyDemoComponent', 'Fast interval started');
    }
  }

  stopFastInterval(): void {
    if (this.fastInterval) {
      clearInterval(this.fastInterval);
      this.fastInterval = undefined;
      this.logger.log(
        'NgOnDestroyDemoComponent',
        'Fast interval stopped manually'
      );
    }
  }

  startSlowInterval(): void {
    if (!this.slowInterval) {
      this.slowIntervalCount = 0;
      this.slowInterval = setInterval(() => {
        this.slowIntervalCount++;
      }, 2000);
      this.logger.log('NgOnDestroyDemoComponent', 'Slow interval started');
    }
  }

  stopSlowInterval(): void {
    if (this.slowInterval) {
      clearInterval(this.slowInterval);
      this.slowInterval = undefined;
      this.logger.log(
        'NgOnDestroyDemoComponent',
        'Slow interval stopped manually'
      );
    }
  }

  // Timeouts
  scheduleTimeout(): void {
    let remainingTime = 5;
    const timeoutId = setTimeout(() => {
      this.pendingTimeouts = this.pendingTimeouts.filter(
        (t) => t.id !== timeoutId
      );
      this.logger.log('NgOnDestroyDemoComponent', 'Timeout completed');
    }, 5000);

    const timeoutObj = { id: timeoutId, remainingTime };
    this.pendingTimeouts.push(timeoutObj);

    // Update countdown
    const countdown = setInterval(() => {
      remainingTime--;
      timeoutObj.remainingTime = remainingTime;
      if (remainingTime <= 0) {
        clearInterval(countdown);
      }
    }, 1000);

    this.logger.log('NgOnDestroyDemoComponent', '5-second timeout scheduled');
  }

  clearAllTimeouts(): void {
    this.pendingTimeouts.forEach((timeout) => clearTimeout(timeout.id));
    this.pendingTimeouts = [];
    this.logger.log('NgOnDestroyDemoComponent', 'All timeouts cleared');
  }

  // Child components
  addChildComponent(): void {
    const child = {
      id: this.nextChildId++,
      createdAt: new Date(),
    };
    this.childComponents.push(child);
    this.logger.log(
      'NgOnDestroyDemoComponent',
      `Child component ${child.id} created`
    );
  }

  removeChildComponent(): void {
    if (this.childComponents.length > 0) {
      const removed = this.childComponents.pop();
      this.logger.log(
        'NgOnDestroyDemoComponent',
        `Child component ${removed?.id} removed`
      );
    }
  }

  removeChildById(id: number): void {
    this.childComponents = this.childComponents.filter(
      (child) => child.id !== id
    );
    this.logger.log(
      'NgOnDestroyDemoComponent',
      `Child component ${id} removed`
    );
  }

  removeAllChildren(): void {
    const count = this.childComponents.length;
    this.childComponents = [];
    this.logger.log(
      'NgOnDestroyDemoComponent',
      `All ${count} child components removed`
    );
  }

  // Helper methods
  getActiveSubscriptionsCount(): number {
    let count = 0;
    if (this.timerSubscription) count++;
    if (this.mouseMoveSubscription) count++;
    count += this.httpSubscriptions.length;
    return count;
  }

  getActiveIntervalsCount(): number {
    let count = 0;
    if (this.fastInterval) count++;
    if (this.slowInterval) count++;
    return count;
  }

  resetDemo(): void {
    this.logger.clear();
    this.stopTimer();
    this.stopMouseTracking();
    this.cancelAllRequests();
    this.stopFastInterval();
    this.stopSlowInterval();
    this.clearAllTimeouts();
    this.removeAllChildren();
    this.logger.log(
      'NgOnDestroyDemoComponent',
      'Demo reset - all resources cleaned up'
    );
  }

  trackByTimestamp(index: number, item: any): any {
    return item.timestamp;
  }
}
