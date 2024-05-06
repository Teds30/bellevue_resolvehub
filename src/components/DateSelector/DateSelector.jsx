import React, { useEffect } from 'react'

import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { styled } from '@mui/material/styles'
import { MobileDatePicker } from '@mui/x-date-pickers'

const StyledDatePicker = styled(MobileDatePicker)(
    ({ theme }) => `
      .MuiOutlinedInput-root {
        border-radius: 15px;
        border-color: var(--accent);
        box-shadow: rgba(var(--accent-rgb), 0.12) 0 0 0 .2em,
      } 
    `
)

const DateSelector = (props) => {
    const {
        currentValue,
        handleSetValue,
        defaultValue = dayjs(),
        label,
        views,
        minDate,
        maxDate,
    } = props

    const [value, setValue] = React.useState(currentValue)

    useEffect(() => {
        const changeDate = () => {
            setValue(currentValue)
        }
        changeDate()
    }, [currentValue])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StyledDatePicker
                defaultValue={defaultValue}
                value={value}
                onChange={(newValue) => {
                    setValue(newValue)
                    handleSetValue(newValue)
                }}
                minDate={minDate}
                maxDate={maxDate}
                views={views && views}
                label={label ?? 'Select date'}
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

export default DateSelector
