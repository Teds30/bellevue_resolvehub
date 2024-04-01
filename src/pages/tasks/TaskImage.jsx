import React, { useEffect, useState } from 'react'

import styles from './TaskImage.module.css'

import useHttp from '../../hooks/http-hook'

const TaskImage = (props) => {
    const { img_url } = props

    const { sendRequest } = useHttp()

    const [image, setImage] = useState()

    // useEffect(() => {
    //     const loadData = async () => {
    //         const res = await sendRequest({
    //             url: `${
    //                 import.meta.env.VITE_BACKEND_URL
    //             }/api/task_images/${img_url}`,
    //         })

    //         if (res) {
    //             const imageBlob = await res.blob()
    //             setImage(URL.createObjectURL(imageBlob))
    //         }
    //     }
    //     if (img_url) loadData()
    // }, [])

    let cleanedUrl = img_url.replace('task_images/', '')

    return (
        <div className={styles['img-container']}>
            <img
                src={`${
                    import.meta.env.VITE_BACKEND_URL
                }/api/task_images/${cleanedUrl}`}
                alt=""
            />
        </div>
    )
}

export default TaskImage
