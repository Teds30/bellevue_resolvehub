import React, { useEffect, useRef, useState } from 'react'
import { Box, Divider, Input, OutlinedInput } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

import { styled } from '@mui/material/styles'
import { InputAdornment } from '@mui/material'
import styles from './Dropdown.module.css'

const StyledSelect = styled(Select)(({ variation }) => ({
    '&.MuiOutlinedInput-root': {
        padding: variation == 'small' && '0px',
        '& fieldset': {
            borderColor: 'var(--border-color)',
            display: 'flex',
        },
        '&:hover fieldset': {
            borderColor: 'var(--border-color)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--accent)',
            boxShadow: `rgba(var(--accent-rgb), 0.12) 0 0 0 .2em`,
        },
    },
    '& .MuiOutlinedInput-input': {
        padding: variation == 'small' ? '10px 6px' : '16.5px 14px',
    },
}))

export default function Dropdown(props) {
    const {
        placeholder = '',
        label = '',
        items = [],
        fullWidth = true,
        defaultValue = '',
        selected,
        handleSelect = (event) => {},
        disabled = false,
        errorText = undefined,
        leadingIcon = null,
        variation,
    } = props

    const selectRef = useRef(null)

    const [open, setOpen] = React.useState(false)

    const handleAdornmentClick = () => {
        // if (selectRef.current.open) {
        //     selectRef.current.open = false
        // } else {
        //     selectRef.current.open = true
        // }
    }

    return (
        <Box sx={{ minWidth: 120, position: 'relative' }}>
            <FormControl fullWidth={fullWidth}>
                {label && (
                    <h4
                        style={{
                            fontWeight: 500,
                            color: 'var(--fc-strong)',
                            marginBottom: '6px',
                        }}
                    >
                        {label}
                    </h4>
                )}
                <StyledSelect
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    ref={selectRef}
                    // label={label}
                    placeholder={placeholder}
                    onChange={handleSelect}
                    displayEmpty
                    // defaultValue={defaultValue}
                    value={selected || defaultValue}
                    disabled={disabled}
                    variation={variation}
                    sx={{
                        borderRadius: '12px',
                        fontSize: '14px',
                        display: 'flex',
                    }}
                    IconComponent={(props) => {
                        if (props.className.includes('MuiSelect-iconOpen')) {
                            return (
                                <InputAdornment
                                    position="end"
                                    onClick={() => setOpen(false)}
                                >
                                    <IoIosArrowUp
                                        style={{
                                            marginRight: '12px',
                                        }}
                                        size={variation === 'small' ? 18 : 24}
                                    ></IoIosArrowUp>
                                </InputAdornment>
                            )
                        }
                        return (
                            <InputAdornment
                                position="end"
                                onClick={() => setOpen(true)}
                            >
                                <IoIosArrowDown
                                    style={{
                                        marginRight: '12px',
                                    }}
                                    size={variation === 'small' ? 18 : 24}
                                ></IoIosArrowDown>
                            </InputAdornment>
                        )
                    }}
                    startAdornment={
                        <InputAdornment
                            position="start"
                            onClick={handleAdornmentClick}
                        >
                            {leadingIcon}
                        </InputAdornment>
                    }
                    // input={<StyledInput variation={variation} />}
                >
                    <MenuItem disabled value="">
                        <em>{placeholder}</em>
                    </MenuItem>
                    {items
                        .filter((i) => i.divided == null || i.divided == false)
                        .map((item) => {
                            return (
                                <MenuItem key={item.id} value={item.id}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {item.adornment && item.adornment}
                                        <span>{item.name}</span>
                                    </Box>
                                </MenuItem>
                            )
                        })}
                    {items.filter((i) => i.divided == true).length > 0 && (
                        <Divider />
                    )}

                    {items
                        .filter((i) => i.divided == true)
                        .map((item) => {
                            return (
                                <MenuItem key={item.id} value={item.id}>
                                    <p>
                                        <span>
                                            {item.adornment && item.adornment}
                                        </span>
                                        {item.name}
                                    </p>
                                </MenuItem>
                            )
                        })}
                </StyledSelect>
            </FormControl>
        </Box>
    )
}
