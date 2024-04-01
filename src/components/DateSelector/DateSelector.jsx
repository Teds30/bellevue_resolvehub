import React, { useEffect } from 'react'

import dayjs, { Dayjs } from '`dayjs`'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { MobileDatePicker } from '@mui/x-date-pickers'

const DateSelector = (props) => {
    const { currentValue, handleSetValue, defaultValue = dayjs() } = props

    const [value, setValue] = React.useState(currentValue)

    useEffect(() => {
        const changeDate = () => {
            setValue(currentValue)
        }
        changeDate()
    }, [currentValue])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
                defaultValue={defaultValue}
                label="Select date"
                value={value}
                onChange={(newValue) => {
                    setValue(newValue)
                    handleSetValue(newValue)
                }}
            />
        </LocalizationProvider>
    )
}

export default DateSelector
