import React, { useState } from 'react'
import FilterButton from './FilterButton'
import { Popover, Box } from '@mui/material'
import Dropdown from '../../components/Dropdown/Dropdown'
import PrimaryButton from '../../components/Button/PrimaryButton'
import DateSelector from '../../components/DateSelector/DateSelector'
import dayjs from 'dayjs'

const dateFilterOptions = [
    {
        id: 1,
        name: 'Daily',
    },
    {
        id: 2,
        name: 'This Week',
    },
    {
        id: 3,
        name: 'Month',
    },
    {
        id: 4,
        name: 'Year',
    },
    {
        id: 5,
        name: 'Custom',
        divided: true,
    },
]

const TableFilter = (props) => {
    const { handleAppliedFilter } = props
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [selectedFilter, setSelectedFilter] = useState()

    const [custom, setCustom] = useState()
    const [month, setMonth] = useState(dayjs)
    const [year, setYear] = useState(dayjs)

    const [filterLabel, setFilterLabel] = useState()

    const handleSelectFilter = (e) => {
        setSelectedFilter(e.target.value)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleApply = () => {
        // setFilterLabel()
        if (selectedFilter === 1) {
            setFilterLabel('Today')
        }
        if (selectedFilter === 2) {
            setFilterLabel('This Week')
        }
        if (selectedFilter === 3) {
            setFilterLabel(dayjs(month).format('MMMM, YYYY'))
        }
        if (selectedFilter === 4) {
            setFilterLabel(dayjs(year).format('YYYY'))
        }
        if (selectedFilter === 5) {
            setFilterLabel(dayjs(custom).format('MMMM DD, YYYY'))
        }
        handleAppliedFilter({ selectedFilter, month, year, custom })
        handleClose()
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    return (
        <div>
            <FilterButton onClick={handleClick}>
                <span>
                    Date Created{filterLabel && `:`}
                    <span style={{ color: 'var(--accent)', marginLeft: '4px' }}>
                        {filterLabel && ` ${filterLabel}`}
                    </span>
                </span>
            </FilterButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ padding: '16px', maxWidth: '300px' }}>
                    <Box>
                        <Dropdown
                            label={`Filter by`}
                            placeholder="Select filter"
                            items={dateFilterOptions}
                            value={selectedFilter}
                            selected={selectedFilter}
                            handleSelect={handleSelectFilter}
                        />
                    </Box>
                    {selectedFilter === 3 && (
                        <Box
                            sx={{
                                marginTop: '16px',
                                borderTop: '1px solid var(--border-color)',
                                paddingTop: '16px',
                            }}
                        >
                            <DateSelector
                                currentValue={month}
                                handleSetValue={setMonth}
                                defaultValue={null}
                                label={'Month'}
                                views={['month', 'year']}
                            />
                        </Box>
                    )}
                    {selectedFilter === 4 && (
                        <Box
                            sx={{
                                marginTop: '16px',
                                borderTop: '1px solid var(--border-color)',
                                paddingTop: '16px',
                            }}
                        >
                            <DateSelector
                                currentValue={year}
                                handleSetValue={setYear}
                                defaultValue={null}
                                label={'Year'}
                                views={['year']}
                            />
                        </Box>
                    )}

                    {selectedFilter === 5 && (
                        <Box
                            sx={{
                                marginTop: '16px',
                                borderTop: '1px solid var(--border-color)',
                                paddingTop: '16px',
                            }}
                        >
                            <DateSelector
                                currentValue={custom}
                                handleSetValue={setCustom}
                                defaultValue={null}
                                // label={''}
                            />
                        </Box>
                    )}

                    <Box sx={{ width: '100%', marginTop: '14px' }}>
                        <PrimaryButton
                            width="100%"
                            onClick={handleApply}
                            disabled={!selectedFilter}
                        >
                            Apply Filter
                        </PrimaryButton>
                    </Box>
                </Box>
            </Popover>
        </div>
    )
}

export default TableFilter
