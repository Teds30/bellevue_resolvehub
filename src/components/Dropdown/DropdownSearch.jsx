import React, { useEffect, useState } from 'react'
import {
    Autocomplete,
    Avatar,
    Box,
    FormControl,
    InputAdornment,
    ListItemAvatar,
    ListItemText,
    TextField,
} from '@mui/material'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { styled } from '@mui/material/styles'

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'var(--border-color)',
        },
        '&:hover fieldset': {
            borderColor: 'var(--border-color)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--accent)',
            boxShadow: `rgba(var(--accent-rgb), 0.12) 0 0 0 .2em`,
        },
    },
})

const DropdownSearch = ({
    label,
    leadingIcon,
    value,
    onValueChange,
    inputValue,
    onInputChange,
    placeholder,
    options,
    fullWidth = true,
    isPerson = false,
    defaultValue,
    disabled,
    customEndAdornment,
}) => {
    const [isOpen, setIsOpen] = useState(false)

    let endAdornment

    if (!customEndAdornment) {
        endAdornment = isOpen ? (
            <IoIosArrowUp color="var(--fc-body)" size={24}></IoIosArrowUp>
        ) : (
            <IoIosArrowDown color="var(--fc-body)" size={24}></IoIosArrowDown>
        )
    } else {
        endAdornment = customEndAdornment
    }

    return (
        <Box sx={{ minWidth: 120, position: 'relative' }}>
            <FormControl fullWidth={fullWidth}>
                {label && (
                    <p
                        style={{
                            fontWeight: 500,
                            color: 'var(--fc-strong)',
                            marginBottom: '6px',
                        }}
                    >
                        {label}
                    </p>
                )}
                <Autocomplete
                    key={value}
                    disabled={disabled}
                    defaultValue={defaultValue}
                    value={value}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                        onValueChange(newValue)
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        onInputChange(newInputValue)
                    }}
                    onOpen={() => {
                        setIsOpen(true)
                    }}
                    onClose={() => {
                        setIsOpen(false)
                    }}
                    options={options}
                    renderOption={(props, option) =>
                        isPerson ? (
                            <li {...props}>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={option.name}
                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${option.name}`}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={option.name}
                                    secondary={option.position || ''}
                                />
                            </li>
                        ) : (
                            <li {...props}>
                                <ListItemText primary={option.name} />
                            </li>
                        )
                    }
                    renderInput={(params) => (
                        <StyledTextField
                            placeholder={placeholder}
                            {...params}
                            sx={{
                                borderRadius: '12px',
                            }}
                            InputProps={{
                                ...params.InputProps,
                                placeholder: placeholder,
                                sx: {
                                    borderRadius: '12px',
                                    paddingInline: '12px !important',
                                },

                                startAdornment: (
                                    <InputAdornment>
                                        {leadingIcon}
                                    </InputAdornment>
                                ),
                                endAdornment: endAdornment,
                            }}
                        />
                    )}
                />
            </FormControl>
        </Box>
    )
}

export default DropdownSearch
