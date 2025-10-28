// Browser notification utility
export class NotificationManager {
  static async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  static async showNotification(
    title: string,
    options?: NotificationOptions
  ): Promise<Notification | null> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return null;
    }

    const permission = await this.requestPermission();

    if (permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      return notification;
    }

    return null;
  }

  static showAlarmNotification(alarmName: string, time: string): void {
    this.showNotification('⏰ 알람', {
      body: `${alarmName || '알람'} - ${time}`,
      tag: 'alarm',
      requireInteraction: true,
    });
  }

  static showTimerNotification(): void {
    this.showNotification('⏲️ 타이머 완료', {
      body: '설정한 타이머가 종료되었습니다!',
      tag: 'timer',
      requireInteraction: true,
    });
  }
}
