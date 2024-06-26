import React, { useContext, useEffect, useRef, useState } from 'react'
import useHttp from '../../hooks/http-hook'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import styles from './ReportsTable.module.css'

import { Box } from '@mui/material'
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
    IconCircleCheck,
    IconCircleX,
    IconExternalLink,
    IconFileDislike,
    IconPlayerPlay,
} from '@tabler/icons-react'
import { IconSend } from '@tabler/icons-react'
import { IconHourglassHigh } from '@tabler/icons-react'
import AuthContext from '../../context/auth-context'
import TableSearch from './TableSearch'
import TableFilterStatus from './TableFilterStatus'
import TableFilterStatusProject from './TableFilterStatusProject'
import TableFilterTypeProject from './TableFilterTypeProject'
import { IconDownload } from '@tabler/icons-react'
import { IconPrinter } from '@tabler/icons-react'
import { useReactToPrint } from 'react-to-print'

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarExport />
        </GridToolbarContainer>
    )
}

const ProjectsTable = () => {
    const { sendRequest } = useHttp()
    const queryClient = useQueryClient()
    const [params, setParams] = useState('&filter_by=daily')
    const navigate = useNavigate()

    const userCtx = useContext(AuthContext)

    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 10,
        page: 0,
    })
    const [filterModel, setFilterModel] = React.useState({ items: [] })
    const [sortModel, setSortModel] = React.useState([])
    const [statusParams, setStatusParams] = useState('')
    const [typeParams, setTypeParams] = useState('')

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
                width: 900px !important;
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
                min-width: 145px !important;
                width: 145px !important;
                max-width: 145px !important;
                --width: 145;
                // max-width: 145px !important;
                // display: block;
                padding: 12px 0;
                white-space: normal;
                word-wrap: break-word;
            }

            .MuiDataGrid-columnHeader {
                min-width: 145px !important;
                width: 145px !important;
                max-width: 145px !important;
                --width: 145;
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
            }/api/projects_page?page_size=${pageSize}&page=${_page}${params}${statusParams}${typeParams}${_searchParams}`,
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

    const handleFilterType = async (data) => {
        if (data) {
            let fetchParams = `&type=${data}`
            setTypeParams(fetchParams)
        } else {
            setTypeParams('')
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
            'project_rows',
            {
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
                params: params,
                statusParams: statusParams,
                typeParams: typeParams,
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
        // Here you save the data you need from the filter model
        setQueryOptions({ filterModel: { ...filterModel } })
    }, [])

    const handleSubmitSearch = async (searchParams) => {
        setSearchParams(searchParams)
    }

    const handleExport = async () => {
        let _searchParams = ''
        if (searchParams && searchParams.searchField && searchParams.search) {
            _searchParams = `&searchField=${searchParams.searchField}&search=${searchParams.search}`
        }

        const res = await fetch(
            `${
                import.meta.env.VITE_BACKEND_URL
            }/api/projects_page?${params}${statusParams}${typeParams}${_searchParams}&export=true`,
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
            a.download = 'projects.csv'
            document.body.appendChild(a) // Append to the DOM for Firefox support
            a.click()
            a.remove() // Remove the element after clicking
            window.URL.revokeObjectURL(url)
        } else {
            console.error('Failed to download projects')
        }
    }

    return (
        <div className={styles['table_container']}>
            <style>{getPageMargins()}</style>
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
                    options={[
                        {
                            id: 1,
                            name: 'Title',
                            field_name: 'title',
                        },
                        {
                            id: 2,
                            name: 'Location',
                            field_name: 'location',
                        },
                        {
                            id: 3,
                            name: 'In-Charge',
                            field_name: 'incharge',
                        },
                        {
                            id: 4,
                            name: 'Department',
                            field_name: 'department',
                        },
                    ]}
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
                <TableFilterStatusProject
                    handleAppliedFilter={handleFilterStatus}
                />
                <TableFilterTypeProject
                    handleAppliedFilter={handleFilterType}
                />
            </Box>

            <Box
                ref={componentRef}
                sx={{
                    width: '100%',
                }}
                className={'datagrid-container'}
            >
                <DataGrid
                    ref={componentRef}
                    columnVisibilityModel={{
                        room: false,
                    }}
                    columns={[
                        {
                            field: 'room',
                        },
                        {
                            field: 'title',
                            hideable: false,
                            disableColumnMenu: true,
                            headerName: 'Project',
                            valueGetter: (value) => {
                                return value
                            },
                            // flex: window.innerWidth > 700 && 1,
                            // minWidth: 110,
                            // maxWidth: 150,
                            width: 145,
                            cellClassName: styles['row_cells'],
                            headerClassName: styles['row_header'],
                            headerAlign: 'center',
                            align: 'start',

                            renderCell: (par) => {
                                return (
                                    <div className={styles['details']}>
                                        <p
                                            className={styles['task-link']}
                                            onClick={() =>
                                                navigate(
                                                    `/projects/${par.row.id}`
                                                )
                                            }
                                        >
                                            {par.row.title}{' '}
                                            <span className="exclude-from-print">
                                                <IconExternalLink size={10} />
                                            </span>
                                        </p>

                                        <p className="smaller-text">
                                            Area: {par.row.location}
                                        </p>
                                    </div>
                                )
                            },
                        },
                        {
                            field: 'type',
                            hideable: false,
                            disableColumnMenu: true,
                            headerName: 'Type',
                            valueGetter: (value) => {
                                return value == 1
                                    ? 'Major'
                                    : value == 0
                                    ? 'Minor'
                                    : ''
                            },
                            // flex: window.innerWidth > 700 && 1,
                            // minWidth: 110,
                            // maxWidth: 150,
                            width: 145,
                            cellClassName: styles['row_cells'],
                            headerClassName: styles['row_header'],
                            headerAlign: 'center',
                            align: 'center',
                        },
                        {
                            field: 'incharge',
                            hideable: false,
                            disableColumnMenu: true,
                            headerName: 'In-Charge',
                            valueGetter: (value) => {
                                return `${value.first_name} ${value.last_name}`
                            },
                            // flex: window.innerWidth > 700 && 1,
                            // minWidth: 110,
                            // maxWidth: 150,
                            width: 145,
                            cellClassName: styles['row_cells'],
                            headerClassName: styles['row_header'],
                            headerAlign: 'center',
                            align: 'center',
                        },
                        {
                            field: 'department',
                            hideable: false,
                            disableColumnMenu: true,
                            headerName: 'Department',
                            valueGetter: (value) => {
                                return value.name
                            },
                            // flex: window.innerWidth > 700 && 1,
                            // minWidth: 110,
                            // maxWidth: 150,
                            width: 145,
                            cellClassName: styles['row_cells'],
                            headerClassName: styles['row_header'],
                            headerAlign: 'center',
                            align: 'center',
                        },
                        {
                            field: 'schedule',
                            hideable: false,
                            disableColumnMenu: true,
                            headerName: 'Start Date',
                            renderCell: (par) => {
                                return (
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
                                )
                            },
                            // flex: window.innerWidth > 700 && 1,
                            // minWidth: 110,
                            // maxWidth: 150,
                            width: 145,
                            cellClassName: styles['row_cells'],
                            headerClassName: styles['row_header'],
                            headerAlign: 'center',
                            align: 'center',
                        },
                        {
                            field: 'deadline',
                            hideable: false,
                            disableColumnMenu: true,
                            headerName: 'End Date',
                            renderCell: (par) => {
                                return (
                                    <Box>
                                        <p>
                                            {dayjs(par.row.deadline).format(
                                                'MMMM DD, YYYY'
                                            )}
                                        </p>
                                        <p className="smaller-text">
                                            {dayjs(par.row.deadline).format(
                                                'hh:mm A'
                                            )}
                                        </p>
                                    </Box>
                                )
                            },
                            // flex: window.innerWidth > 700 && 1,
                            // minWidth: 110,
                            // maxWidth: 150,
                            width: 145,
                            cellClassName: styles['row_cells'],
                            headerClassName: styles['row_header'],
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
                                    return 'Request'
                                } else if (value == 1) {
                                    return 'Pending'
                                } else if (value == 2) {
                                    return 'On-Going'
                                } else if (value == 3) {
                                    return 'Cancelled'
                                } else if (value == 4) {
                                    return 'Accomplished'
                                } else if (value == 5) {
                                    return 'Rejected'
                                }
                            },
                            renderCell: (par) => {
                                let statusStyles
                                let statusLabel = ''
                                let icon

                                if (par.row.status == 0) {
                                    statusStyles = 'request'
                                    statusLabel = 'Request'
                                    icon = <IconSend size={18} />
                                } else if (par.row.status == 1) {
                                    statusStyles = 'pending'
                                    statusLabel = 'Pending '
                                    icon = <IconHourglassHigh size={18} />
                                } else if (par.row.status == 2) {
                                    statusStyles = 'on-going'
                                    statusLabel = 'On-Going'
                                    icon = (
                                        <IconPlayerPlay
                                            size={18}
                                            color="var(--success)"
                                        />
                                    )
                                } else if (par.row.status == 3) {
                                    statusStyles = 'cancelled'
                                    statusLabel = 'Cancelled'
                                    icon = <IconCircleX size={18} />
                                } else if (par.row.status == 4) {
                                    statusStyles = 'accomplished'
                                    statusLabel = 'Accomplished'
                                    icon = (
                                        <IconCircleCheck
                                            size={18}
                                            style={{ color: 'inherit' }}
                                        />
                                    )
                                } else if (par.row.status == 5) {
                                    statusStyles = 'rejected'
                                    statusLabel = 'Rejected'
                                    icon = <IconFileDislike size={18} />
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
                            // flex: window.innerWidth > 700 && 1,
                            // minWidth: 110,
                            // maxWidth: 150,
                            width: 145,
                            cellClassName: `${styles['row_cells']}`,
                            headerClassName: styles['row_header'],
                        },
                    ]}
                    // getRowClassName={(params) => {
                    //     return styles[`status-${params.row.status}`]
                    // }}
                    // getCellClassName={(params) => {
                    //     if(params.field === 's')
                    // }}

                    pagination
                    rows={unitData.data.data ?? []}
                    sortingMode="server"
                    filterMode="server"
                    loading={unitFetching}
                    slots={{
                        loadingOverlay: LinearProgress,
                        // toolbar: CustomToolbar,
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
                    pageSizeOptions={[10, 25, 50, 110]}
                    disableColumnSorting={true}
                    onFilterModelChange={onFilterChange}
                    getRowHeight={() => 'auto'}
                    // sx={{
                    //     '& .MuiDataGrid-cell': {
                    //         // fontSize: '12px',
                    //         // padding: '8px 0',
                    //         display: 'flex',
                    //         alignItems: 'center',
                    //     },
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

export default ProjectsTable
