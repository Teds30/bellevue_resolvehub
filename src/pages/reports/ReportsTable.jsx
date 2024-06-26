import React, { useContext, useEffect, useRef, useState } from 'react'
import useHttp from '../../hooks/http-hook'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import styles from './ReportsTable.module.css'

import { Box, InputAdornment } from '@mui/material'
import {
    DataGrid,
    GridToolbar,
    GridToolbarExport,
    GridToolbarContainer,
} from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'
import BellevueLoading from '../../components/LoadingSpinner/BellevueLoading'
import TableFilter from './TableFilter'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import {
    IconDownload,
    IconExternalLink,
    IconPrinter,
} from '@tabler/icons-react'
import AuthContext from '../../context/auth-context'
import TableFilterMain from './TableFilterStatus'

import TextField from '../../components/TextField/TextField'
import useValidate from '../../hooks/validate-input-hook'
import FilterButton from './FilterButton'
import FilterSearch from './FilterSearch'
import Dropdown from '../../components/Dropdown/Dropdown'
import TableFilterStatus from './TableFilterStatus'
import Moment from 'react-moment'
import TableSearch from './TableSearch'
import { useReactToPrint } from 'react-to-print'
import { extractQueryParams } from './params'

function CustomToolbar() {
    return (
        <GridToolbarExport
            csvOptions={false}
            printOptions={{
                hideFooter: true,
                hideToolbar: true,
            }}
        />
    )
}

const ReportsTable = () => {
    const {
        value: search,
        isValid: searchIsValid,
        hasError: searchHasError,
        valueChangeHandler: searchChangeHandler,
        inputBlurHandler: searchBlurHandler,
        reset: searchReset,
    } = useValidate((value) => value.trim() !== '')

    const { sendRequest } = useHttp()
    const queryClient = useQueryClient()
    const [params, setParams] = useState('&filter_by=daily')
    const [statusParams, setStatusParams] = useState('')
    const navigate = useNavigate()

    const userCtx = useContext(AuthContext)

    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 10,
        page: 0,
    })
    const [filterModel, setFilterModel] = React.useState({ items: [] })
    const [sortModel, setSortModel] = React.useState([])
    const [options, setOptions] = useState([
        {
            id: 1,
            name: 'Issue',
            field_name: 'issue',
        },
        {
            id: 2,
            name: 'Area',
            field_name: 'room',
        },
        {
            id: 3,
            name: 'Assignee',
            field_name: 'assignee',
        },
    ])

    const apiRef = useRef()

    const [searchParams, setSearchParams] = useState({
        searchField: '',
        search: '',
    })

    const componentRef = useRef()

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const getPageMargins = () => {
        return `@page { margin: 32px 32px 32px 32px !important;}
        @media print {
            html, body{
                width: 1000px !important;
                // border: 1px solid blue;
                max-width: 900px !important;
            }
            
            .MuiDataGrid-root{
                width: 1000px !important;
            }
            .MuiDataGrid-virtualScrollerContent {           
                width: 1000px !important;
                display: flex;
            }
            .MuiDataGrid-columnHeaders{
                width: 1000px !important;
            }
            .exclude-from-print {
              display: none;
            }
            .MuiDataGrid-scrollbar{
                display: none !important;
            }
            .datagrid-container{
                max-width: 900px !important;
            }

            .MuiDataGrid-cell{
                // --maxWidth: 145px !important;
                --flex: 1;
                // flex: unset !important;
                min-width: 170px !important;
                width: 170px !important;
                max-width: 170px !important;
                --width: 145;
                // max-width: 170px !important;
                // display: block;
                padding: 12px 0;
                white-space: normal;
                word-wrap: break-word;
            }

            .MuiDataGrid-columnHeader {
                min-width: 170px !important;
                width: 170px !important;
                max-width: 170px !important;
                --width: 170;
            }
            .MuiDataGrid-columnHeaderTitle {
                white-space: normal;
                line-height: normal;
            },
            .MuiDataGrid-columnHeader {
                height: unset !important,
            },
            .MuiDataGrid-columnHeaders {
                max-height: 168px !important,
            },
          }`
    }

    useEffect(() => {
        if (userCtx.hasPermission('302')) {
            setOptions([
                {
                    id: 1,
                    name: 'Issue',
                    field_name: 'issue',
                },
                {
                    id: 2,
                    name: 'Area',
                    field_name: 'room',
                },
                {
                    id: 3,
                    name: 'Assignee',
                    field_name: 'assignee',
                },
                {
                    id: 4,
                    name: 'Department',
                    field_name: 'department',
                },
            ])
        }
    }, [userCtx])

    const loadTasks = async (params) => {
        const page = paginationModel.page
        const pageSize = paginationModel.pageSize
        let _page

        if (page === 0) {
            _page = 1
        } else {
            _page = page + 1
        }

        let _searchParams = ''
        if (searchParams && searchParams.searchField && searchParams.search) {
            _searchParams = `&searchField=${searchParams.searchField}&search=${searchParams.search}`
        }

        const res = await fetch(
            `${
                import.meta.env.VITE_BACKEND_URL
            }/api/tasks_page?page_size=${pageSize}&page=${_page}${params}${statusParams}${_searchParams}`,
            {
                method: 'POST',
                body: JSON.stringify({
                    department_id: userCtx.user.position.department_id,
                    can_see_all: userCtx.hasPermission('302'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        const out = await res.json()

        return {
            data: out.data,
            model: {
                page: page,
                pageSize: pageSize,
            },
        }
    }

    const handleExport = async () => {
        let _searchParams = ''
        if (searchParams && searchParams.searchField && searchParams.search) {
            _searchParams = `&searchField=${searchParams.searchField}&search=${searchParams.search}`
        }

        const res = await fetch(
            `${
                import.meta.env.VITE_BACKEND_URL
            }/api/tasks_page?${params}${statusParams}${_searchParams}&export=true`,
            {
                method: 'POST',
                body: JSON.stringify({
                    department_id: userCtx.user.position.department_id,
                    can_see_all: userCtx.hasPermission('302'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        if (res.ok) {
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'tasks.csv'
            document.body.appendChild(a) // Append to the DOM for Firefox support
            a.click()
            a.remove() // Remove the element after clicking
            window.URL.revokeObjectURL(url)
        } else {
            console.error('Failed to download tasks')
        }
    }

    const handleAppliedFilter = async (data) => {
        // queryClient.invalidateQueries({ queryKey: ['rows'] })

        let fetchParams = ''
        if (data) {
            if (data.selectedFilter == 1) {
                fetchParams = `&filter_by=daily`
            } else if (data.selectedFilter == 2) {
                fetchParams = `&filter_by=this_week`
            } else if (data.selectedFilter == 3) {
                fetchParams = `&filter_by=month&month=${dayjs(
                    data.month
                ).format('MMMM')}&year=${dayjs(data.month).format('YYYY')}`
            } else if (data.selectedFilter == 4) {
                fetchParams = `&filter_by=year&year=${dayjs(data.year).format(
                    'YYYY'
                )}`
            } else if (data.selectedFilter == 5) {
                console.log(dayjs(data.custom).format('YYYY-MM-DD'))
                fetchParams = `&filter_by=custom&custom=${dayjs(
                    data.custom
                ).format('YYYY-MM-DD')}`
            }
        }

        setParams(fetchParams)
    }

    const handleFilterStatus = async (data) => {
        if (data) {
            let fetchParams = `&status=${data}`
            setStatusParams(fetchParams)
        } else {
            setStatusParams('')
        }
    }

    const {
        data: unitData,
        isLoading,
        isLoadingError,
        refetch: refetchTask,
        isFetching: unitFetching,
    } = useQuery({
        queryKey: [
            'rows',
            {
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
                params: params,
                statusParams: statusParams,
                searchParams: searchParams,
            },
        ],
        retry: false,
        queryFn: async () => loadTasks(params),
        enabled: !!userCtx && !!userCtx.user,

        refetchOnWindowFocus: false,
        initialData: {
            data: {
                data: [],
                total: 0,
            },
            model: {
                page: 0,
                pageSize: 10,
            },
        },
    })

    const handlePageChange = (newPage) => {
        setPaginationModel((prevModel) => ({
            ...prevModel,
            page: newPage.page,
            pageSize: newPage.pageSize,
        }))
    }

    const [queryOptions, setQueryOptions] = React.useState({})

    const onFilterChange = React.useCallback((filterModel) => {
        setQueryOptions({ filterModel: { ...filterModel } })
    }, [])

    const handleSubmitSearch = async (searchParams) => {
        setSearchParams(searchParams)
    }

    return (
        <div className={styles['table_container']}>
            {' '}
            <style>{getPageMargins()}</style>
            {/* <Box
                sx={{
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    borderBottom: '0',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                    display: 'flex',
                    gap: '12px',
                }}
            >
                <Dropdown
                    items={[
                        {
                            id: 1,
                            name: 'Task',
                        },
                        {
                            id: 2,
                            name: 'Area',
                        },
                    ]}
                    value={selectedSearchItem}
                    selected={selectedSearchItem}
                    handleSelect={handleSelectSearchItem}
                    variation="small"
                />
                <TextField
                    label=""
                    placeholder="Search"
                    value={search}
                    onChange={searchChangeHandler}
                    onBlur={searchBlurHandler}
                />
            </Box> */}
            <Box
                sx={{
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                    borderBottom: '0',
                    display: 'flex',
                    gap: '12px',
                }}
            >
                <TableSearch
                    options={options}
                    handleSubmitSearch={handleSubmitSearch}
                    setSearchParams={setSearchParams}
                />
            </Box>
            <Box
                sx={{
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    borderBottom: '0',
                    display: 'flex',
                    gap: '12px',
                }}
            >
                <TableFilter handleAppliedFilter={handleAppliedFilter} />
                <TableFilterStatus handleAppliedFilter={handleFilterStatus} />
            </Box>
            <Box
                ref={componentRef}
                sx={{
                    width: '100%',
                }}
                className={'datagrid-container'}
            >
                <DataGrid
                    columnVisibilityModel={{
                        room: false,
                    }}
                    columns={[
                        {
                            field: 'row_data',
                            hideable: false,
                            disableColumnMenu: true,
                            headerName: 'Task',
                            valueGetter: (value) => {
                                return value.name
                            },
                            // flex: 1,
                            // flex: window.innerWidth > 900 && 1,
                            minWidth: 150,
                            width: 160,
                            cellClassName: styles['row_cells'],
                            headerClassName: `${styles['row_header']}`,
                            headerAlign: 'center',
                            align: 'start',

                            renderCell: (par) => {
                                return (
                                    <div className={styles['details']}>
                                        <p
                                            className={styles['task-link']}
                                            onClick={() =>
                                                navigate(`/tasks/${par.row.id}`)
                                            }
                                        >
                                            {par.row.issue}{' '}
                                            <span>
                                                <IconExternalLink size={10} />
                                            </span>
                                        </p>
                                        <p className="smaller-text">
                                            {/* Created:{' '} */}
                                            <Moment format="MMMM DD, YYYY">
                                                {par.row.created_at}
                                            </Moment>
                                        </p>
                                    </div>
                                )
                            },
                        },
                        {
                            field: 'area',
                            hideable: true,
                            disableColumnMenu: true,
                            headerName: 'Area/Room ID',
                            valueGetter: (value) => {
                                return value
                            },
                            renderCell: (par) => {
                                return (
                                    <Box>
                                        <p>{par.row.room}</p>
                                    </Box>
                                )
                            },
                            // flex: 1,
                            // flex: window.innerWidth > 900 && 1,
                            minWidth: 150,
                            width: 160,

                            cellClassName: styles['row_cells'],
                            headerClassName: `${styles['row_header']}`,
                            headerAlign: 'center',
                            align: 'center',
                        },
                        {
                            field: 'assignee_id',
                            hideable: false,
                            disableColumnMenu: true,
                            headerName: 'Assigned to',
                            valueGetter: (value) => {
                                return value
                            },
                            renderCell: (par) => {
                                return (
                                    <Box>
                                        <p>{par.row.department.name}</p>
                                        <p className="smaller-text">
                                            {par.row.assignee
                                                ? `${par.row.assignee.first_name} ${par.row.assignee.last_name}`
                                                : 'None'}
                                        </p>
                                    </Box>
                                )
                            },
                            // flex: 1,
                            // flex: window.innerWidth > 900 && 1,
                            minWidth: 150,
                            width: 160,

                            cellClassName: styles['row_cells'],
                            headerClassName: `${styles['row_header']}`,
                            headerAlign: 'center',
                            align: 'center',
                        },
                        {
                            field: 'schedule',
                            hideable: false,
                            disableColumnMenu: true,
                            headerName: 'Schedule',
                            valueGetter: (value) => {
                                return value !== null
                                    ? dayjs(value).format(
                                          'MMMM DD, YYYY hh:mm A'
                                      )
                                    : null
                            },
                            renderCell: (par) => {
                                return par.row.schedule ? (
                                    <Box>
                                        <p>
                                            {dayjs(par.row.schedule).format(
                                                'MMMM DD, YYYY'
                                            )}
                                        </p>
                                        <p className="smaller-text">
                                            {dayjs(par.row.schedule).format(
                                                'hh:mm A'
                                            )}
                                        </p>
                                    </Box>
                                ) : (
                                    'N/A'
                                )
                            },
                            // flex: 1,
                            // flex: window.innerWidth > 900 && 1,
                            minWidth: 150,
                            width: 160,

                            cellClassName: styles['row_cells'],
                            headerClassName: `${styles['row_header']}`,
                            headerAlign: 'center',
                            align: 'center',
                        },

                        {
                            field: 'updated_at',
                            hidden: true,
                            hideable: false,
                            disableColumnMenu: true,
                            headerName: 'Completion Date',
                            valueGetter: (value) => {
                                return value !== null
                                    ? dayjs(value).format(
                                          'MMMM DD, YYYY hh:mm A'
                                      )
                                    : null
                            },
                            renderCell: (par) => {
                                let out = par.row.completed_marker_id ? (
                                    <Box>
                                        <p>
                                            {dayjs(par.row.updated_at).format(
                                                'MMMM DD, YYYY'
                                            )}
                                        </p>
                                        <p className="smaller-text">
                                            {dayjs(par.row.updated_at).format(
                                                'hh:mm A'
                                            )}
                                        </p>
                                    </Box>
                                ) : (
                                    'N/A'
                                )

                                return out
                            },
                            // flex: 1,
                            // flex: window.innerWidth > 900 && 1,
                            minWidth: 150,
                            width: 160,

                            cellClassName: styles['row_cells'],
                            headerClassName: `${styles['row_header']}`,
                            headerAlign: 'center',
                            align: 'center',
                        },
                        {
                            field: 'status',
                            hideable: false,
                            disableColumnMenu: true,
                            headerName: 'Status',
                            headerAlign: 'center',
                            align: 'center',
                            valueFormatter: (value) => {
                                if (value == 0) {
                                    return 'request'
                                } else if (value == 1) {
                                    return 'active'
                                } else if (value == 2) {
                                    return 'pending'
                                } else if (value == 3) {
                                    return 'cancelled'
                                } else if (value == 4) {
                                    return 'accomplished'
                                }
                            },
                            renderCell: (par) => {
                                let statusStyles
                                let statusLabel = ''

                                if (par.row.status == 0) {
                                    statusStyles = 'request'
                                    statusLabel = 'Request'
                                } else if (par.row.status == 1) {
                                    statusStyles = 'active'
                                    statusLabel = 'Active'
                                } else if (par.row.status == 2) {
                                    statusStyles = 'pending'
                                    statusLabel = 'Pending'
                                } else if (par.row.status == 3) {
                                    statusStyles = 'cancelled'
                                    statusLabel = 'Cancelled'
                                } else if (par.row.status == 4) {
                                    statusStyles = 'accomplished'
                                    statusLabel = 'Accomplished'
                                }

                                return (
                                    <div className={styles['status-container']}>
                                        <div
                                            className={`${
                                                styles[`status-${statusStyles}`]
                                            } ${styles['status-chip']}`}
                                        >
                                            {statusLabel}
                                        </div>
                                    </div>
                                )
                            },
                            valueGetter: (value) => {
                                return value
                            },
                            // flex: 1,
                            // flex: window.innerWidth > 900 && 1,
                            minWidth: 150,
                            width: 160,
                            cellClassName: `${styles['row_cells']}`,
                            headerClassName: `${styles['row_header']}`,
                        },
                    ]}
                    getRowClassName={(params) => {
                        return styles[`status-${params.row.status}`]
                    }}
                    // getCellClassName={(params) => {
                    //     if(params.field === 's')
                    // }}
                    // ref={apiRef}
                    autosizeOnMount={true}
                    pagination
                    rows={unitData.data.data ?? []}
                    sortingMode="server"
                    filterMode="server"
                    loading={unitFetching}
                    slots={{
                        loadingOverlay: LinearProgress,
                        // toolbar: GridToolbar,
                    }}
                    isRowSelectable={false}
                    paginationMode="server"
                    rowCount={unitData.data.total ?? 0}
                    pageSize={paginationModel.pageSize}
                    paginationModel={unitData.model}
                    sortModel={sortModel}
                    onSortModelChange={(newSortModel) =>
                        setSortModel(newSortModel)
                    }
                    onPaginationModelChange={handlePageChange}
                    pageSizeOptions={[10, 25, 50, 100]}
                    disableColumnSorting={true}
                    getRowHeight={() => 'auto'}
                    // filterModel={filterModel}
                    // onFilterModelChange={(newFilterModel) => {
                    //     console.log(newFilterModel)
                    //     setFilterModel(newFilterModel)
                    // }}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: '12px 16px',
                    gap: '12px',
                    border: '1px solid var(--border-color)',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'var(--accent)',
                        gap: '4px',
                        fontWeight: 500,
                        padding: '12px 16px',
                        border: '1px solid var(--border-color)',
                        width: 'fit-content',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                    onClick={handlePrint}
                >
                    <IconPrinter size={16} /> Print
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'var(--accent)',
                        gap: '4px',
                        fontWeight: 500,
                        padding: '12px 16px',
                        border: '1px solid var(--border-color)',
                        width: 'fit-content',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                    onClick={handleExport}
                >
                    <IconDownload size={16} /> Export Data
                </Box>
            </Box>
        </div>
    )
}

export default ReportsTable
