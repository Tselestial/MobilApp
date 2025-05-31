import * as Notifications from 'expo-notifications';
import { Marker } from '../types';

interface ActiveNotification {
  markerId: number;
  notificationId: string;
  timestamp: number;
}

export class NotificationManager {
  private activeNotifications = new Map<number, ActiveNotification>();

  async showNotification(marker: Marker) {
    if (this.activeNotifications.has(marker.id)) return;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Вы рядом с меткой!',
        body: 'Вы находитесь рядом с сохранённой меткой.',
      },
      trigger: null,
    });

    this.activeNotifications.set(marker.id, {
      markerId: marker.id,
      notificationId,
      timestamp: Date.now(),
    });
  }

  async removeNotification(markerId: number) {
    const notification = this.activeNotifications.get(markerId);
    if (notification) {
      await Notifications.cancelScheduledNotificationAsync(notification.notificationId);
      this.activeNotifications.delete(markerId);
    }
  }
}

export const notificationManager = new NotificationManager();
