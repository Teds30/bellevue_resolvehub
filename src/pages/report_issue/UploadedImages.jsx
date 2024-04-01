import React, { useEffect, useRef, useState } from 'react'

import { IconPlus, IconX } from '@tabler/icons-react'

import styles from './UploadedImages.module.css'

const UploadedImages = (props) => {
    const { uploadedImages, setUploadedImages } = props

    // const [uploadedImages, setUploadedImages] = useState([])
    const imgRef = useRef()

    const addImageChangeHandler = (event) => {
        const selectedImage = event.target.files[0]

        if (selectedImage && selectedImage.size > 5 * 1024 * 1024) {
            return
        }

        if (selectedImage) setUploadedImages([...uploadedImages, selectedImage])
    }

    useEffect(() => {
        console.log('uploaded: ', uploadedImages)
    }, [uploadedImages])

    const removeHandler = (id) => {
        const newUploadedImages = uploadedImages.filter(
            (image, index) => index !== id
        )
        if (uploadedImages.length === 0) {
            setUploadedImages([])
            return
        }

        setUploadedImages(newUploadedImages)
    }

    return (
        <div className={styles['container']}>
            {uploadedImages.map((img, index) => {
                return (
                    <div className={styles['image-container']} key={index}>
                        <div
                            className={styles['closeBtn']}
                            onClick={() => {
                                removeHandler(index)
                            }}
                        >
                            <IconX />
                        </div>
                        <img src={URL.createObjectURL(img)} alt="CushyRental" />
                    </div>
                )
            })}
            <div
                className={styles['add-image-container']}
                onClick={() => imgRef.current.click()}
            >
                <IconPlus />
                <h5>Add Image</h5>
            </div>
            <input
                hidden
                ref={imgRef}
                type="file"
                accept="image/jpeg, image/png"
                onChange={addImageChangeHandler}
                multiple={false}
            />
        </div>
    )
}

export default UploadedImages
