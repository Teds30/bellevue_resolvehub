import React, { useEffect } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { styled } from '@mui/material/styles'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs from 'dayjs'

const StyledTimePicker = styled(TimePicker)(
    ({ theme }) => `
      .MuiOutlinedInput-root {
        border-radius: 15px;
        border-color: var(--accent);
        box-shadow: rgba(var(--accent-rgb), 0.12) 0 0 0 .2em,
      } 
    `
)

const TimeSelector = (props) => {
    const { currentValue, handleSetValue } = props

    const [value, setValue] = React.useState(currentValue)

    useEffect(() => {
        const changeDate = () => {
            setValue(currentValue)
        }
        changeDate()
    }, [currentValue])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StyledTimePicker
                label="Select time"
                value={value}
                onChange={(newValue) => {
                    setValue(newValue)
                    handleSetValue(newValue)
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'var(--accent)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'var(--accent)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'var(--accent)',
                        },
                    },
                }}
            />
        </LocalizationProvider>
    )
}

export default TimeSelector
