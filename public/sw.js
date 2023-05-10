function receivePushNotification(event) {
  console.log("[Service Worker] Push Received.");

  const { image, badge, icon, tag, url, title, body } = event.data.json();

  const options = {
    data: url,
    body: body,
    icon: icon,
    vibrate: [200, 100, 200],
    tag: tag,
    image: image,
    badge: badge,
    actions: [
      { action: "Detail", title: "Detail  ", icon: "https://via.placeholder.com/128/ff0000" },
      { action: "View", title: "View", icon: "https://via.placeholder.com/128/ff0000" }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
}

// https://developer.chrome.com/blog/notification-actions/
function openPushNotification(event) {
  console.log("[Service Worker] Notification click Received.", event.notification.data);
  
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
}

self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", openPushNotification);
