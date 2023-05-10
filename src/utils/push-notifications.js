const pushServerPublicKey = 'BOtHAUcXI9rp3ra9NFnbebt1BDl78oblSfEjRLXsJJCi1p6inmsnfrc3ZmNySvPInU81VGndibLD5QYd-rCeb50';

/**
 * checks if Push notification and service workers are supported by your browser
 */
function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

/**
 * asks user consent to receive push notifications and returns the response of the user, one of granted, default, denied
 */
async function askUserPermission() {
  return Notification.requestPermission();
}
/**
 * shows a notification
 */
function sendNotification() {
  const img = "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg";
  const text = "Take a look at this brand new t-shirt!";
  const title = "New Product Available";
  const options = {
    body: text,
    icon: "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg",
    vibrate: [200, 100, 200],
    tag: "new-product",
    image: img,
    badge: "https://spyna.it/icons/android-icon-192x192.png",
    actions: [{ action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000" }]
  };
  navigator.serviceWorker.ready.then(function(serviceWorker) {
    serviceWorker.showNotification(title, options);
  });
}

/**
 *
 */
async function registerServiceWorker() {
  return navigator.serviceWorker.register("/sw.js");
}

// Convert a base64 string to Uint8Array.
// Must do this so the server can understand the VAPID_PUBLIC_KEY.
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray; 
};

/**
 *
 * using the registered service worker creates a push notification subscription and returns it
 *
 */
async function createNotificationSubscription() {
  //wait for service worker installation to be ready
  const applicationServerKey = urlB64ToUint8Array(pushServerPublicKey);
  const serviceWorker = await navigator.serviceWorker.ready;
  // subscribe and return the subscription
  console.log(serviceWorker);
  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  });
}

/**
 *
 * using the registered service worker creates a push notification subscription and returns it
 *
 */
 async function removeNotificationSubscription() {
  //wait for service worker installation to be ready
  const applicationServerKey = urlB64ToUint8Array(pushServerPublicKey);
  const serviceWorker = await navigator.serviceWorker.ready;
  // subscribe and return the subscription
  console.log(serviceWorker);
  return await serviceWorker.pushManager.unsubscribe();
}


/**
 * returns the subscription if present or nothing
 */
function getUserSubscription() {
  //wait for service worker installation to be ready, and then
  return navigator.serviceWorker.ready
    .then(function(serviceWorker) {
      return serviceWorker.pushManager.getSubscription();
    })
    .then(function(pushSubscription) {
      return pushSubscription;
    });
}

export {
  isPushNotificationSupported,
  askUserPermission,
  registerServiceWorker,
  sendNotification,
  createNotificationSubscription,
  removeNotificationSubscription,
  getUserSubscription
};
