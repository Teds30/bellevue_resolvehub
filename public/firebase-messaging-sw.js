importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: 'AIzaSyCHderxK3GHFan_OcO-8tbcbCbIji3vONU',
    authDomain: 'bellevue-notifications.firebaseapp.com',
    projectId: 'bellevue-notifications',
    storageBucket: 'bellevue-notifications.appspot.com',
    messagingSenderId: '329712442874',
    appId: '1:329712442874:web:3d700e0a0a94ffa6261843',
}

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload)

    const notificationTitle = payload.notification.title
    const notificationOptions = {
        body: payload.notification.body,
        click_action: payload.notification.click_action, // To handle notification click when notification is moved to notification tray
        data: {
            click_action: payload.notification.click_action,
        },
    }

    self.registration.showNotification(notificationTitle, notificationOptions)
})
