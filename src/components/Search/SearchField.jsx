import React, { useRef } from 'react'

import { FiSearch } from 'react-icons/fi'
import styles from './SearchField.module.css'
import TableFilter from '../../pages/reports/TableFilter'
import { Box, IconButton } from '@mui/material'
import styled from 'styled-components'
import { IconCrossOff, IconX } from '@tabler/icons-react'

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: '#fff',
    backgroundColor: 'var(--accent)',
    '&:hover': {
        backgroundColor: 'var(--accent)',
    },
}))
const StyledClearIconButton = styled(IconButton)(({ theme }) => ({
    color: 'var(--fc-body)',
    // backgroundColor: 'var(--accent)',
    '&:hover': {
        // backgroundColor: 'var(--accent)',
    },
}))

const SearchField = (props) => {
    const {
        placeholder,
        searchData,
        onChange,
        width = '100%',
        simple = true,
        dropdown = false,
        dropdownComponent,
        handleSubmit,
        showClear,
        handleClear,
    } = props

    const searchRef = useRef()

    // const changeHandler = () => {
    //     searchData(searchRef.current.value)
    // }

    return (
        <div className={styles['search-container']} style={{ width: width }}>
            <form className={styles.search}>
                <div className={styles.icon}>
                    {!dropdown ? <FiSearch /> : dropdownComponent}
                </div>
                <input
                    type="text"
                    onChange={onChange}
                    ref={searchRef}
                    placeholder={placeholder}
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '8px',
                    }}
                >
                    <StyledIconButton
                        onClick={handleSubmit}
                        disabled={!searchRef.current?.value}
                    >
                        <FiSearch />
                    </StyledIconButton>
                    {showClear && (
                        <StyledClearIconButton
                            onClick={() => {
                                handleClear()
                                searchRef.current.value = ''
                            }}
                        >
                            <IconX />
                        </StyledClearIconButton>
                    )}
                </Box>
            </form>
        </div>
    )
}

export default SearchField
