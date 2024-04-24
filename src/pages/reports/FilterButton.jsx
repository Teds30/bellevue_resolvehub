import React from 'react'

import styles from './FilterButton.module.css'
import { IconFilter } from '@tabler/icons-react'

const FilterButton = (props) => {
    const { onClick } = props
    return (
        <div className={styles['button']} onClick={onClick}>
            <span>
                <IconFilter size={18} />
            </span>
            {props.children}
        </div>
    )
}

export default FilterButton
