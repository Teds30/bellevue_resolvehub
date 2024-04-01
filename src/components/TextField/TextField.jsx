import React from 'react'

import { alpha, styled } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { FormHelperText } from '@mui/material'

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 12,
        position: 'relative',
        backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1A2027',
        border: '1px solid',
        borderColor: theme.palette.mode === 'light' ? '#E0E3E7' : '#2D3843',
        fontSize: 16,
        padding: '10px 12px',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        '&:focus': {
            boxShadow: `rgba(var(--accent-rgb), 0.12) 0 0 0 .2em`,
            borderColor: 'var(--accent)',
        },
    },
}))

const TextField = (props) => {
    const { label = 'Search', helperText = null, fullWidth = true } = props

    return (
        <FormControl variant="standard" fullWidth={fullWidth}>
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
            <BootstrapInput label={label} {...props} />

            {helperText && (
                <FormHelperText
                    id="component-helper-text"
                    sx={{ color: 'var(--accent-danger)' }}
                >
                    {helperText}
                </FormHelperText>
            )}
        </FormControl>
    )
}

export default TextField
