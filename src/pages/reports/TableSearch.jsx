import React, { useState } from 'react'
import SearchField from '../../components/Search/SearchField'
import TableFilter from './TableFilter'
import Dropdown from '../../components/Dropdown/Dropdown'

import styles from './TableSearch.module.css'
import { Box } from '@mui/material'

const TableSearch = (props) => {
    const { handleSubmitSearch } = props

    const [selectedSearch, setSelectedSearch] = useState(1)
    const [filterLabel, setFilterLabel] = useState('Area')

    const [search, setSearch] = useState('')

    const handleSelectSearch = (e) => {
        setSelectedSearch(e.target.value)
    }

    const handleSearchChange = (e) => {
        const keywords = e.target.value
        setSearch(keywords)
    }

    const handleSubmit = () => {
        handleSubmitSearch({
            searchField:
                selectedSearch == 1
                    ? 'issue'
                    : selectedSearch == 2
                    ? 'room'
                    : '',
            search: search,
        })
    }

    return (
        <Box sx={{ width: '100%' }}>
            <SearchField
                placeholder="Seach a user"
                onChange={handleSearchChange}
                handleSubmit={handleSubmit}
                dropdown={true}
                dropdownComponent={
                    // <div className={styles['button']} onClick={onClick}>
                    //     <span>{filterLabel}</span>
                    // </div>
                    <Dropdown
                        variation="small"
                        placeholder="Select"
                        items={[
                            {
                                id: 1,
                                name: 'Issue',
                            },
                            {
                                id: 2,
                                name: 'Area',
                            },
                        ]}
                        value={selectedSearch}
                        selected={selectedSearch}
                        handleSelect={handleSelectSearch}
                    />
                }
            />
        </Box>
    )
}

export default TableSearch
