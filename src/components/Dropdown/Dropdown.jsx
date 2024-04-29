import React, { useEffect, useState } from 'react'
import { Box, Divider } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

import { styled } from '@mui/material/styles'
import { InputAdornment } from '@mui/material'

const StyledSelect = styled(Select)(() => ({
    '&.MuiOutlinedInput-root': {
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
                    // label={label}
                    placeholder={placeholder}
                    onChange={handleSelect}
                    displayEmpty
                    // defaultValue={defaultValue}
                    value={selected || defaultValue}
                    disabled={disabled}
                    sx={{
                        borderRadius: '12px',
                        fontSize: '14px',
                        display: 'flex',
                    }}
                    IconComponent={(props) => {
                        if (props.className.includes('MuiSelect-iconOpen')) {
                            return (
                                <InputAdornment position="end">
                                    <IoIosArrowUp
                                        style={{
                                            marginRight: '12px',
                                        }}
                                        size={24}
                                    ></IoIosArrowUp>
                                </InputAdornment>
                            )
                        }
                        return (
                            <InputAdornment position="end">
                                <IoIosArrowDown
                                    style={{
                                        marginRight: '12px',
                                    }}
                                    size={24}
                                ></IoIosArrowDown>
                            </InputAdornment>
                        )
                    }}
                    startAdornment={
                        <InputAdornment position="start">
                            {leadingIcon}
                        </InputAdornment>
                    }
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
