import React, { useEffect } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs from 'dayjs'

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
            <TimePicker
                label="Select time"
                value={value}
                onChange={(newValue) => {
                    setValue(newValue)
                    handleSetValue(newValue)
                }}
            />
        </LocalizationProvider>
    )
}

export default TimeSelector
