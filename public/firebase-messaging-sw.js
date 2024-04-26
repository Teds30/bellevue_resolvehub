importScripts(
    'https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js'
)
importScripts(
    'https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js'
)

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
const messaging = firebase.messaging()

messaging.onMessage((payload) => {
    const notificationTitle = payload.notification.title
    const notificationOptions = {
        body: payload.notification.body,
    }

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    )
})

// messaging.onBackgroundMessage((payload) => {
//     const notificationTitle = payload.notification.title
//     const notificationOptions = {
//         body: payload.notification.body,
//     }

//     return self.registration.showNotification(
//         notificationTitle,
//         notificationOptions
//     )
// })

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
