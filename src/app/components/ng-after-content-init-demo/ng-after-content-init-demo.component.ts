import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '../../services/logger.service';
import { CardComponent } from './card/card.component';
import { TabsComponent } from './tabs/tabs.component';

@Component({
  selector: 'app-ng-after-content-init-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, TabsComponent],
  template: `
    <div class="demo-container">
      <div class="demo-header">
        <h1>ngAfterContentInit Demo</h1>
        <p>Demonstrates content projection and accessing projected content</p>
      </div>

      <div class="demo-content">
        <div class="content-projection-section">
          <h3>Content Projection Examples</h3>

          <div class="example-container">
            <h4>Card Component with Projected Content</h4>
            <app-card>
              <div class="header" #projectedHeader>
                <h2>📋 Task Dashboard</h2>
                <span class="badge">{{ tasks.length }} items</span>
              </div>
              <div class="content">
                <div
                  *ngFor="let task of tasks; let i = index"
                  class="task-item"
                >
                  <input
                    type="checkbox"
                    [(ngModel)]="task.completed"
                    (change)="onTaskToggle(i)"
                  />
                  <span [class.completed]="task.completed">{{
                    task.title
                  }}</span>
                  <button (click)="removeTask(i)" class="remove-btn">×</button>
                </div>
                <div class="add-task">
                  <input
                    #newTaskInput
                    type="text"
                    placeholder="Add new task..."
                    (keyup.enter)="
                      addTask(newTaskInput.value); newTaskInput.value = ''
                    "
                  />
                  <button
                    (click)="
                      addTask(newTaskInput.value); newTaskInput.value = ''
                    "
                  >
                    Add Task
                  </button>
                </div>
              </div>
              <div class="footer">
                <small
                  >{{ getCompletedCount() }}/{{ tasks.length }} completed</small
                >
              </div>
            </app-card>
          </div>

          <div class="example-container">
            <h4>Tab Container with Multiple Content Areas</h4>
            <app-tabs>
              <div tab-label="Users" class="tab-content">
                <div *ngFor="let user of users" class="user-item">
                  <strong>{{ user.name }}</strong> - {{ user.email }}
                </div>
              </div>
              <div tab-label="Settings" class="tab-content">
                <div class="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      [(ngModel)]="settings.notifications"
                    />
                    Enable Notifications
                  </label>
                </div>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" [(ngModel)]="settings.darkMode" />
                    Dark Mode
                  </label>
                </div>
              </div>
              <div tab-label="About" class="tab-content">
                <p>This is a demo of Angular lifecycle hooks.</p>
                <p>Current time: {{ currentTime | date : 'medium' }}</p>
              </div>
            </app-tabs>
          </div>
        </div>

        <div class="content-info-section">
          <h3>Projected Content Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Header Found:</span>
              <span class="info-value">{{
                hasProjectedHeader ? '✅ Yes' : '❌ No'
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Content Sections:</span>
              <span class="info-value">{{ contentSectionCount }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Tab Panels:</span>
              <span class="info-value">{{ tabPanelCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="logs-section">
        <h3>Lifecycle Logs</h3>
        <div class="logs-container">
          <div class="log-entry" *ngFor="let log of logger.logs">
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
        <h3>ngAfterContentInit Key Points</h3>
        <div class="key-points">
          <div class="point-item">
            <h4>📥 Content Projection</h4>
            <p>
              Called once after Angular projects external content via
              &lt;ng-content&gt;
            </p>
          </div>
          <div class="point-item">
            <h4>🔍 ContentChild Available</h4>
            <p>@ContentChild and @ContentChildren queries are now accessible</p>
          </div>
          <div class="point-item">
            <h4>⚡ One Time Only</h4>
            <p>
              Runs only once per component instance, perfect for initialization
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './ng-after-content-init-demo.component.scss',
  providers: [LoggerService],
})
export class NgAfterContentInitDemoComponent implements AfterContentInit {
  @ContentChild('projectedHeader') projectedHeader?: TemplateRef<any>;
  @ContentChildren('projectedHeader') projectedHeaders!: QueryList<any>;

  hasProjectedHeader = false;
  contentSectionCount = 0;
  tabPanelCount = 0;
  currentTime = new Date();

  tasks = [
    { title: 'Review code changes', completed: false },
    { title: 'Update documentation', completed: true },
    { title: 'Plan next sprint', completed: false },
  ];

  users = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Bob Johnson', email: 'bob@example.com' },
  ];

  settings = {
    notifications: true,
    darkMode: false,
  };

  constructor(public logger: LoggerService) {
    this.logger.log('NgAfterContentInitDemo', 'Constructor called');

    // Update time every second
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngAfterContentInit(): void {
    this.logger.log('NgAfterContentInitDemo', 'ngAfterContentInit called');

    // Check for projected content
    this.checkProjectedContent();

    this.logger.log(
      'NgAfterContentInitDemo',
      `Content initialization complete - Header: ${this.hasProjectedHeader}, Sections: ${this.contentSectionCount}`
    );
  }

  private checkProjectedContent(): void {
    this.hasProjectedHeader = !!this.projectedHeader;
    this.contentSectionCount = document.querySelectorAll('.content').length;
    this.tabPanelCount = document.querySelectorAll('.tab-content').length;

    this.logger.log(
      'NgAfterContentInitDemo',
      `Projected content analyzed - Headers: ${this.projectedHeaders.length}, Content sections: ${this.contentSectionCount}`
    );
  }

  addTask(title: string): void {
    if (title.trim()) {
      this.tasks.push({ title: title.trim(), completed: false });
      this.logger.log('NgAfterContentInitDemo', `Task added: ${title}`);
    }
  }

  removeTask(index: number): void {
    const task = this.tasks[index];
    this.tasks.splice(index, 1);
    this.logger.log('NgAfterContentInitDemo', `Task removed: ${task.title}`);
  }

  onTaskToggle(index: number): void {
    const task = this.tasks[index];
    this.logger.log(
      'NgAfterContentInitDemo',
      `Task ${task.completed ? 'completed' : 'uncompleted'}: ${task.title}`
    );
  }

  getCompletedCount(): number {
    return this.tasks.filter((task) => task.completed).length;
  }
}
