import { useCallback, useContext, useEffect, useState } from 'react'
import useHttp from '../../hooks/http-hook'
import { useNavigate } from 'react-router-dom'

import AuthContext from '../../context/auth-context'

const department_tasks = () => {
    const { sendRequest, isLoading } = useHttp()

    const userCtx = useContext(AuthContext)

    const loadDepartmentAssigned = async () => {
        const res = await sendRequest({
            url: `${
                import.meta.env.VITE_BACKEND_URL
            }/api/department_assigned_tasks/${
                userCtx.user.position.department_id
            }`,
            headers: {
                Authorization: `Bearer ${userCtx.token}`,
            },
        })
        return res.data
    }
    const loadDepartmentOnGoing = async () => {
        const res = await sendRequest({
            url: `${
                import.meta.env.VITE_BACKEND_URL
            }/api/department_ongoing_tasks/${
                userCtx.user.position.department_id
            }`,
            headers: {
                Authorization: `Bearer ${userCtx.token}`,
            },
        })
        return res.data
    }
    const loadDepartmentPending = async () => {
        const res = await sendRequest({
            url: `${
                import.meta.env.VITE_BACKEND_URL
            }/api/department_pending_tasks/${
                userCtx.user.position.department_id
            }`,
            headers: {
                Authorization: `Bearer ${userCtx.token}`,
            },
        })
        return res.data
    }
    const loadDepartmentDone = async () => {
        const res = await sendRequest({
            url: `${
                import.meta.env.VITE_BACKEND_URL
            }/api/department_done_tasks/${userCtx.user.position.department_id}`,
            method: 'POST',
            body: JSON.stringify({ today: true }),
            headers: {
                Authorization: `Bearer ${userCtx.token}`,
            },
        })
        return res.data
    }

    return {
        loadDepartmentAssigned,
        loadDepartmentOnGoing,
        loadDepartmentPending,
        loadDepartmentDone,
        isLoading,
    }
}

export default department_tasks
