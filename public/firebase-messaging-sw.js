// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyBEGuTkD3kZKrpPS8Ugsjctngyb3oj1P0o",
    authDomain: "vox-domini.firebaseapp.com",
    projectId: "vox-domini",
    storageBucket: "vox-domini.appspot.com",
    messagingSenderId: "348105008143",
    appId: "1:348105008143:web:56bf511446b4ef46892f7a"
 };

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});