// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: 'AIzaSyCHderxK3GHFan_OcO-8tbcbCbIji3vONU',
    authDomain: 'bellevue-notifications.firebaseapp.com',
    projectId: 'bellevue-notifications',
    storageBucket: 'bellevue-notifications.appspot.com',
    messagingSenderId: '329712442874',
    appId: '1:329712442874:web:3d700e0a0a94ffa6261843',
}

// import { initializeApp } from 'firebase/app'
// import { getMessaging } from 'firebase/messaging/sw'

// import { onBackgroundMessage } from 'firebase/messaging/sw'

// const app = initializeApp(firebaseConfig)
// const messaging = getMessaging(app)

// onBackgroundMessage(messaging, (payload) => {
//     console.log(
//         '[firebase-messaging-sw.js] Received background message ',
//         payload
//     )
//     const notificationTitle = 'Background Message Title'
//     const notificationOptions = {
//         body: 'Background Message body.',
//         icon: '/firebase-logo.png',
//     }
//     return self.registration.showNotification(
//         notificationTitle,
//         notificationOptions
//     )
// })

// firebase.initializeApp(firebaseConfig)

// // // Retrieve firebase messaging
// const messaging = firebase.messaging()

// messaging.onBackgroundMessage(function (payload) {
//     console.log('Received background message ', payload)

//     const notificationTitle = payload.notification.title
//     const notificationOptions = {
//         body: payload.notification.body,
//     }

//     self.registration.showNotification(notificationTitle, notificationOptions)
// })
