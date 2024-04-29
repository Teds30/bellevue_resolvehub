import React, { useEffect, useState } from 'react'

import styles from './TaskImage.module.css'

import useHttp from '../../hooks/http-hook'
import { Backdrop, Box, IconButton } from '@mui/material'
import { IoClose } from 'react-icons/io5'

const TaskImage = (props) => {
    const { img_url } = props

    const { sendRequest } = useHttp()

    const [image, setImage] = useState()

    const [open, setOpen] = useState(false)
    const [fullImage, setFullImage] = useState(null)
    const [imageFullScreen, setImageFullScreen] = useState(false)

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

    const handleClose = () => {
        setOpen(false)
        setFullImage(null)
        setImageFullScreen(false)
    }
    const handleFullScreen = () => {
        setImageFullScreen(!imageFullScreen)
    }

    return (
        <div className={styles['img-container']}>
            <img
                src={`${
                    import.meta.env.VITE_BACKEND_URL
                }/api/task_images/${cleanedUrl}`}
                alt=""
                onClick={(e) => {
                    setFullImage(e)
                    setOpen(true)
                }}
            />
            {fullImage && (
                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        backgroundColor: imageFullScreen
                            ? 'rgba(0,0,0,1)'
                            : 'rgba(255,255,255,1)',
                        transition: '.5s',
                    }}
                    open={open}
                    // onClick={handleClose}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                        }}
                        onClick={() => imageFullScreen && handleFullScreen()}
                    >
                        {!imageFullScreen && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingInline: '8px',
                                }}
                            >
                                <IconButton
                                    sx={{
                                        alignSelf: 'flex-start',
                                    }}
                                    size="large"
                                    color="inherit"
                                    aria-label="menu"
                                    onClick={handleClose}
                                >
                                    <IoClose
                                        style={{ fill: 'var(--accent)' }}
                                    />
                                </IconButton>
                            </Box>
                        )}

                        <Box
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingInline: !imageFullScreen && '8px',
                                transition: '.5s',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={fullImage.target.src}
                                alt=""
                                style={{
                                    width: '100%',
                                    maxWidth: '500px',
                                    height: 'auto',
                                    borderRadius: !imageFullScreen && '16px',
                                    transition: '.5s',
                                }}
                                onClick={handleFullScreen}
                            />
                        </Box>
                    </Box>
                </Backdrop>
            )}
        </div>
    )
}

export default TaskImage
