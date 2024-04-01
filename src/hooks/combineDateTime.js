import dayjs from 'dayjs'
import React from 'react'

const combineDateTime = (date, time) => {
    const _date = dayjs(date)
    const combinedDateTime = _date
        .hour(time.hour())
        .minute(time.minute())
        .second(time.second())
        .unix()

    const formattedDate = dayjs
        .unix(combinedDateTime)
        .format('YYYY-MM-DD HH:mm:ss')

    return formattedDate
}

export default combineDateTime
