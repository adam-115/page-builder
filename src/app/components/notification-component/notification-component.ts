import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Notification, NotificationType } from '../../../appTypes';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-notification-component',
  imports: [CommonModule],
  templateUrl: './notification-component.html',
  styleUrl: './notification-component.css',
})
export class NotificationComponent {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifications$.subscribe(notification => {
      this.notifications.push(notification);
      setTimeout(() => this.remove(notification.id), notification.duration);
    });
  }

  remove(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  getIconClasses(type: NotificationType): string {
    const classes = {
      info: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500'
    };
    return classes[type];
  }

  getCardClasses(type: NotificationType): string {
    const classes = {
      info: 'bg-blue-50 border-blue-200',
      success: 'bg-green-50 border-green-200',
      warning: 'bg-yellow-50 border-yellow-200',
      error: 'bg-red-50 border-red-200'
    };
    return classes[type];
  }

  getProgressBarClasses(type: NotificationType): string {
    const classes = {
      info: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500'
    };
    return classes[type];
  }

}
