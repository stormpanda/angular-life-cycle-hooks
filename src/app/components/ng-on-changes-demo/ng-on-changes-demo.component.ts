import { CommonModule } from '@angular/common';
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '../../services/logger.service';
import { UserProfileComponent } from './user-profile/user-profile.component';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-ng-on-changes-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, UserProfileComponent],
  templateUrl: './ng-on-changes-demo.component.html',
  styleUrl: './ng-on-changes-demo.component.scss',
  providers: [LoggerService],
})
export class NgOnChangesDemoComponent implements OnChanges {
  selectedUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Developer',
  };

  users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Manager' },
    {
      id: 4,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'Tester',
    },
  ];

  inputValue = 'Initial Value';
  counter = 0;

  constructor(public logger: LoggerService) {
    this.logger.log('NgOnChangesDemoComponent', 'Constructor called');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.logger.log('NgOnChangesDemoComponent', 'ngOnChanges called', changes);

    for (const propertyName in changes) {
      const change = changes[propertyName];
      this.logger.log(
        'NgOnChangesDemoComponent',
        `Property ${propertyName} changed from ${JSON.stringify(
          change.previousValue
        )} to ${JSON.stringify(change.currentValue)}. First change: ${
          change.firstChange
        }`
      );
    }
  }

  selectUser(user: User): void {
    this.selectedUser = { ...user }; // Create new object to trigger change detection
    this.logger.log('NgOnChangesDemoComponent', `User selected: ${user.name}`);
  }

  updateUserName(newName: string): void {
    this.selectedUser = { ...this.selectedUser, name: newName };
    this.logger.log(
      'NgOnChangesDemoComponent',
      `User name updated to: ${newName}`
    );
  }

  updateUserEmail(newEmail: string): void {
    this.selectedUser = { ...this.selectedUser, email: newEmail };
    this.logger.log(
      'NgOnChangesDemoComponent',
      `User email updated to: ${newEmail}`
    );
  }

  updateUserRole(newRole: string): void {
    this.selectedUser = { ...this.selectedUser, role: newRole };
    this.logger.log(
      'NgOnChangesDemoComponent',
      `User role updated to: ${newRole}`
    );
  }

  incrementCounter(): void {
    this.counter++;
    this.logger.log(
      'NgOnChangesDemoComponent',
      `Counter incremented to: ${this.counter}`
    );
  }

  resetDemo(): void {
    this.selectedUser = { ...this.users[0] };
    this.inputValue = 'Initial Value';
    this.counter = 0;
    this.logger.clear();
    this.logger.log('NgOnChangesDemoComponent', 'Demo reset');
  }

  trackByTimestamp(index: number, item: any): any {
    return item.timestamp;
  }
}
