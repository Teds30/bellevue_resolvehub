import { useContext } from 'react'
import useHttp from './http-hook'
import AuthContext from '../context/auth-context'

const userPermission = (code) => {
    const { sendRequest } = useHttp()
    const userCtx = useContext(AuthContext)

    const hasPermission = (code) => {
        if (
            userCtx.user &&
            userCtx.user.permissions &&
            userCtx.user.permissions.includes(code)
        ) {
            return true
        }

        return false
    }

    return {
        hasPermission,
    }
}

export default userPermission
