import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LoggerService } from '../../../services/logger.service';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-profile">
      <div class="profile-header">
        <div class="avatar">{{ user?.name?.charAt(0) || '?' }}</div>
        <div class="user-info">
          <h3>{{ user?.name || 'No Name' }}</h3>
          <p class="email">{{ user?.email || 'No Email' }}</p>
          <span
            class="role-badge"
            [class]="'role-' + (user?.role?.toLowerCase() || 'unknown')"
          >
            {{ user?.role || 'Unknown Role' }}
          </span>
        </div>
      </div>

      <div class="profile-details">
        <div class="detail-item">
          <label>User ID:</label>
          <span>{{ user?.id || 'N/A' }}</span>
        </div>
        <div class="detail-item">
          <label>Last Updated:</label>
          <span>{{ lastUpdateTime | date : 'medium' }}</span>
        </div>
        <div class="detail-item">
          <label>Changes Count:</label>
          <span>{{ changesCount }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .user-profile {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #3498db;
      }

      .profile-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .user-info h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
        font-size: 1.3rem;
      }

      .email {
        margin: 0 0 0.5rem 0;
        color: #7f8c8d;
        font-size: 0.9rem;
      }

      .role-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        color: white;
      }

      .role-developer {
        background: #2ecc71;
      }
      .role-designer {
        background: #9b59b6;
      }
      .role-manager {
        background: #e74c3c;
      }
      .role-tester {
        background: #f39c12;
      }
      .role-unknown {
        background: #95a5a6;
      }

      .profile-details {
        display: grid;
        gap: 0.75rem;
      }

      .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #ecf0f1;
      }

      .detail-item:last-child {
        border-bottom: none;
      }

      .detail-item label {
        font-weight: 500;
        color: #2c3e50;
      }

      .detail-item span {
        color: #7f8c8d;
      }
    `,
  ],
})
export class UserProfileComponent implements OnChanges {
  @Input() user: User | null = null;

  changesCount = 0;
  lastUpdateTime = new Date();

  constructor(private logger: LoggerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.logger.log('UserProfileComponent', 'ngOnChanges called', changes);

    if (changes['user']) {
      const change = changes['user'];
      this.changesCount++;
      this.lastUpdateTime = new Date();

      this.logger.log(
        'UserProfileComponent',
        `User property changed. Changes count: ${this.changesCount}. ` +
          `Previous: ${JSON.stringify(change.previousValue)}, ` +
          `Current: ${JSON.stringify(change.currentValue)}, ` +
          `First change: ${change.firstChange}`
      );
    }
  }
}
