import React from 'react'

import Button from './Button'

import styles from './OutlinedButton.module.css'

const OutlinedButton = (props) => {
    return (
        <Button {...props} btnStyle={styles}>
            {props.children}
        </Button>
    )
}

export default OutlinedButton
