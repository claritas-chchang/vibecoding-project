export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

export const sendLocalNotification = async (title, options = {}) => {
    if (await requestNotificationPermission()) {
        try {
            // Try to use Service Worker for notification (standard for PWAs)
            const registration = await navigator.serviceWorker.ready;
            if (registration && 'showNotification' in registration) {
                await registration.showNotification(title, {
                    icon: '/icon-v2-192.png',
                    badge: '/icon-v2-192.png',
                    vibrate: [100, 50, 100],
                    data: { url: window.location.href },
                    ...options
                });
            } else {
                // Fallback to standard web notification API
                new Notification(title, {
                    icon: '/icon-v2-192.png',
                    ...options
                });
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            // Fallback
            new Notification(title, {
                icon: '/icon-v2-192.png',
                ...options
            });
        }
    }
};
