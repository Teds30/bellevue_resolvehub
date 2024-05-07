import { useCallback, useEffect, useState } from 'react'
import useHttp from './http-hook'
import { useNavigate } from 'react-router-dom'

import firebase from 'firebase/compat/app'
import 'firebase/compat/messaging'

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

const useAuth = () => {
    const { sendRequest, isLoading } = useHttp()

    const [user, setUser] = useState()
    const [token, setToken] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState('initial')
    const navigate = useNavigate()

    const logoutHandler = async () => {
        setIsLoggedIn(false)
        setToken(null)
        setUser(null)
        localStorage.removeItem('userData')

        Notification.requestPermission().then(async () => {
            const t = await messaging.getToken()
            if (t) {
                deleteToken(t)
            }
        })
        navigate('/login')
    }

    const hasPermission = useCallback(
        (code) => {
            if (user && user.permissions && user.permissions.includes(code)) {
                return true
            }

            return false
        },
        [user]
    )

    const loginHandler = useCallback(
        async ({ user = {}, token = '', fresh = false }) => {
            // localStorage.removeItem('userData')
            await fetchUserData({ user, token })
            // setToken(token)
            // setUser(user)
            // setIsLoggedIn(true)
            // localStorage.setItem(
            //     'userData',
            //     JSON.stringify({
            //         userId: user.id,
            //         token: token,
            //     })
            // )
            navigate('/tasks', { state: { isFresh: fresh } })
        },
        []
    )

    const fetchUserData = useCallback(async (storedData) => {
        try {
            console.log('tioke: ', storedData.token)
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/user_data`,
                {
                    headers: {
                        Authorization: `Bearer ${storedData.token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': '69420',
                        'localtonet-skip-warning': 'true',
                    },
                }
            )

            const res_data = await response.json()

            const { data } = res_data

            if (data) {
                setUser(data)
                setToken(storedData.token)
                setIsLoggedIn(true)

                localStorage.setItem(
                    'userData',
                    JSON.stringify({
                        userId: data.id,
                        token: storedData.token,
                    })
                )

                Notification.requestPermission()
                    .then(() => {
                        //TODO uncomment
                        const t = messaging.getToken()
                        saveToken(data.id, t)
                        // Token is retrieved when permissions are granted or if already granted
                    })
                    .then((token) => {})
                    .catch((error) => {
                        // console.error('Permission denied:', error)
                    })

                return {
                    userId: data.id,
                    token: storedData.token,
                }
            }

            if (!response.ok) {
                localStorage.removeItem('userData')
                setUser(null)
                setIsLoggedIn(false)
                navigate('/login')
            }
            // navigate('/')

            // setUser(storedData.user)
            // setToken(storedData.token)
            setIsLoggedIn(true)
        } catch (error) {
            // Handle errors if needed
            console.log('error: ', error)
        }
    }, [])

    const saveToken = async (user_id, token) => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/device_tokens`,
            method: 'POST',
            body: JSON.stringify({
                user_id: user_id,
                token: token,
            }),
        })
    }

    const deleteToken = async (token) => {
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/device_tokens`,
            method: 'DELETE',
            body: JSON.stringify({
                token: token,
            }),
        })
    }

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'))

        if (storedData) {
            const loadData = async () => {
                await fetchUserData(storedData)
            }
            loadData()
        } else {
            logoutHandler()
            setIsLoggedIn(false)
        }
    }, [])

    const accountRegistration = useCallback(
        async (body) => {
            let responseData
            try {
                responseData = await sendRequest({
                    url: `${import.meta.env.VITE_BACKEND_URL}/api/register`,
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                return responseData
            } catch (err) {
                throw err.message
            }
        },
        [sendRequest]
    )

    return {
        isLoading,
        accountRegistration,
        user,
        token,
        loginHandler,
        logoutHandler,
        isLoggedIn,
        hasPermission,
        fetchUserData,
    }
}

export default useAuth
