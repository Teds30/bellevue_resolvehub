import React, { useState } from 'react'
import SearchField from '../../components/Search/SearchField'
import TableFilter from './TableFilter'
import Dropdown from '../../components/Dropdown/Dropdown'

import styles from './TableSearch.module.css'
import { Box } from '@mui/material'

const TableSearch = (props) => {
    const { handleSubmitSearch, setSearchParams, options = [] } = props

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
        let selected = options.find((item) => item.id == selectedSearch)
        handleSubmitSearch({
            searchField: selected.name == 'Area' ? 'room' : selected.name,
            search: search,
        })
    }

    const handleClear = () => {
        handleSubmitSearch({
            searchField: '',
            search: '',
        })

        setSearchParams({
            searchField: '',
            search: '',
        })
    }

    return (
        <Box sx={{ width: '100%' }}>
            <SearchField
                showClear={true}
                placeholder="Seach"
                onChange={handleSearchChange}
                handleSubmit={handleSubmit}
                handleClear={handleClear}
                dropdown={true}
                dropdownComponent={
                    // <div className={styles['button']} onClick={onClick}>
                    //     <span>{filterLabel}</span>
                    // </div>
                    <Dropdown
                        variation="small"
                        placeholder="Select"
                        items={options}
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
