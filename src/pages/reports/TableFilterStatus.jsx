import React, { useState } from 'react'
import FilterButton from './FilterButton'
import { Popover, Box } from '@mui/material'
import Dropdown from '../../components/Dropdown/Dropdown'
import PrimaryButton from '../../components/Button/PrimaryButton'
import DateSelector from '../../components/DateSelector/DateSelector'

const StatusCircle = (props) => {
    const { color } = props
    return (
        <Box
            sx={{
                borderRadius: '50%',
                marginRight: '8px',
                width: '8px',
                height: '8px',
                backgroundColor: color ?? 'none',
            }}
        ></Box>
    )
}

const TableFilterStatus = (props) => {
    const { handleAppliedFilter } = props
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [selectedFilter, setSelectedFilter] = useState(1)
    const [selectedStatus, setSelectedStatus] = useState(1)

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
        switch (selectedStatus) {
            case 1:
                setFilterLabel('None')
                handleAppliedFilter('')
                break
            case 2:
                setFilterLabel('Request')
                handleAppliedFilter('request')
                break
            case 3:
                setFilterLabel('Active')
                handleAppliedFilter('active')
                break
            case 4:
                setFilterLabel('Pending')
                handleAppliedFilter('pending')
                break
            case 5:
                setFilterLabel('Cancelled')
                handleAppliedFilter('cancelled')
                break
            case 6:
                setFilterLabel('Accomplished')
                handleAppliedFilter('accomplished')
                break
        }
        handleClose()
    }

    const handleSelectStatus = (e) => {
        setSelectedStatus(e.target.value)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    return (
        <div>
            <FilterButton onClick={handleClick}>
                <span>
                    Status{filterLabel && filterLabel !== 'None' && `:`}
                    <span style={{ color: 'var(--accent)', marginLeft: '4px' }}>
                        {filterLabel &&
                            filterLabel !== 'None' &&
                            ` ${filterLabel}`}
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
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box sx={{ padding: '16px', maxWidth: '300px' }}>
                    <Box>
                        <Dropdown
                            items={[
                                {
                                    id: 1,
                                    name: '-- None --',
                                },
                                {
                                    id: 2,
                                    name: 'Request',
                                    adornment: <StatusCircle color="#ccc" />,
                                },
                                {
                                    id: 3,
                                    name: 'Active',
                                    adornment: <StatusCircle color="#0c8a60" />,
                                },
                                {
                                    id: 4,
                                    name: 'Pending',
                                    adornment: <StatusCircle color="#555ccc" />,
                                },
                                {
                                    id: 5,
                                    name: 'Cancelled',
                                    adornment: <StatusCircle color="#c90303" />,
                                },
                                {
                                    id: 6,
                                    name: 'Accomplished',
                                    adornment: <StatusCircle color="#03c988" />,
                                },
                            ]}
                            value={selectedStatus}
                            selected={selectedStatus}
                            handleSelect={handleSelectStatus}
                        />
                    </Box>
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

export default TableFilterStatus
