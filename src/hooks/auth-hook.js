import { useCallback, useEffect, useState } from 'react'
import useHttp from './http-hook'
import { useNavigate } from 'react-router-dom'

const useAuth = () => {
    const { sendRequest, isLoading } = useHttp()

    const [user, setUser] = useState()
    const [token, setToken] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState('initial')
    const navigate = useNavigate()

    const logoutHandler = () => {
        setIsLoggedIn(false)
        setToken(null)
        setUser(null)
        localStorage.removeItem('userData')
    }

    const loginHandler = useCallback(
        ({ user = {}, token = '', fresh = false }) => {
            setToken(token)
            setUser(user)
            setIsLoggedIn(true)
            localStorage.setItem(
                'userData',
                JSON.stringify({
                    userId: user.id,
                    token: token,
                })
            )
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
                    },
                }
            )

            const res_data = await response.json()

            const { data } = res_data
            if (response) {
                setUser(data)
                setToken(storedData.token)
                setIsLoggedIn(true)
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

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'))

        if (storedData) {
            const loadData = async () => {
                await fetchUserData(storedData)
            }
            loadData()
        } else {
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
    }
}

export default useAuth
