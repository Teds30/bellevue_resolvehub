import { getToken, getMessaging } from '@firebase/messaging'
import { initializeApp } from '@firebase/app'
import React, { useEffect, useState } from 'react'

const Notifications = () => {
    const [isInit, setIsInit] = useState(false)
    const [token, setToken] = useState()

    useEffect(() => {
        if (isInit) {
            const messaging = getMessaging()
            getToken(messaging, {
                vapidKey:
                    'BFO6IBQW1xqi9mmxnlrqvR4hg5x-Dp2ApgVN0W2ovwzh1rTz9LJMReMWkGj4ePFUaEdmwdrW3Ri1uuf_gi4wIhs',
            })
                .then((currentToken) => {
                    if (currentToken) {
                        console.log('current: ', currentToken)
                        setToken(currentToken)
                        // Send the token to your server and update the UI if necessary
                        // ...
                    } else {
                        // Show permission request UI
                        setToken('no oken!')
                        console.log(
                            'No registration token available. Request permission to generate one.'
                        )
                        // ...
                    }
                })
                .catch((err) => {
                    console.log(
                        'An error occurred while retrieving token. ',
                        err
                    )
                    // ...
                })
        }
    }, [isInit])

    const subscribeDevice = async () => {
        try {
            switch (Notification.permission) {
                case 'denied':
                    alert('ddeenniedd')
                    throw new Error('Push messages are blocked.')
                case 'granted':
                    alert('granteedd')
                    break
                default:
                    await new Promise((resolve, reject) => {
                        Notification.requestPermission((result) => {
                            if (result !== 'granted') {
                                alert('ddeenniedd 2')
                                reject(new Error('Bad permission result'))
                            }

                            resolve()
                        })
                    })
            }
        } catch (err) {
            alert('adsdsd')
            // Check for a permission prompt issue
        }
    }

    const requestPermission = async () => {
        Notification.requestPermission().then((permission) => {
            alert(permission)
            if (permission === 'granted') {
                console.log('Notification permission granted.')

                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker
                        .register('../../../public/firebase-messaging-sw.js')
                        .then(function (registration) {
                            console.log(
                                'Registration successful, scope is:',
                                registration.scope
                            )
                        })
                        .catch(function (err) {
                            console.log(
                                'Service worker registration failed, error:',
                                err
                            )
                        })
                }

                const firebaseConfig = {
                    apiKey: 'AIzaSyCHderxK3GHFan_OcO-8tbcbCbIji3vONU',
                    authDomain: 'bellevue-notifications.firebaseapp.com',
                    projectId: 'bellevue-notifications',
                    storageBucket: 'bellevue-notifications.appspot.com',
                    messagingSenderId: '329712442874',
                    appId: '1:329712442874:web:3d700e0a0a94ffa6261843',
                }

                const app = initializeApp(firebaseConfig)

                setIsInit(true)
            }
        })
    }

    // useEffect(() => {
    //     requestPermission()
    // }, [])

    return (
        <div>
            Notifications {token && token}
            <div>
                <button onClick={requestPermission}>Reques</button>
            </div>
        </div>
    )
}

export default Notifications
