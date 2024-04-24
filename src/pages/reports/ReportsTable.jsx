import React, { useEffect, useState } from 'react'
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
import { IconExternalLink } from '@tabler/icons-react'

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarExport />
        </GridToolbarContainer>
    )
}

const ReportsTable = () => {
    const { sendRequest } = useHttp()
    const queryClient = useQueryClient()
    const [params, setParams] = useState('')
    const navigate = useNavigate()

    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 10,
        page: 0,
    })
    const [filterModel, setFilterModel] = React.useState({ items: [] })
    const [sortModel, setSortModel] = React.useState([])

    const loadTasks = async (params) => {
        const page = paginationModel.page
        const pageSize = paginationModel.pageSize
        let _page

        if (page === 0) {
            _page = 1
        } else {
            _page = page + 1
        }

        const res = await fetch(
            `${
                import.meta.env.VITE_BACKEND_URL
            }/api/tasks_page?page_size=${pageSize}&page=${_page}${params}`
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
                fetchParams = `&filter_by=today`
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
            },
        ],
        retry: false,
        queryFn: async () => loadTasks(params),

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

    return (
        <div className={styles['table_container']}>
            <Box
                sx={{
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    borderBottom: '0',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                }}
            >
                <TableFilter handleAppliedFilter={handleAppliedFilter} />
            </Box>
            <DataGrid
                sx={{ width: '100%' }}
                columnVisibilityModel={{
                    room: false,
                }}
                columns={[
                    {
                        field: 'room',
                    },
                    {
                        field: 'row_data',
                        hideable: false,
                        disableColumnMenu: true,
                        headerName: 'Task',
                        valueGetter: (value) => {
                            return value.name
                        },
                        flex: 1,
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
                                            navigate(`/tasks/${par.row.id}`)
                                        }
                                    >
                                        {par.row.issue}{' '}
                                        <span>
                                            <IconExternalLink size={10} />
                                        </span>
                                    </p>
                                    <p className="smaller-text">
                                        Area: {par.row.room}
                                    </p>
                                </div>
                            )
                        },
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
                        flex: 1,
                        cellClassName: styles['row_cells'],
                        headerClassName: styles['row_header'],
                        headerAlign: 'center',
                        align: 'center',
                    },
                    {
                        field: 'schedule',
                        hideable: false,
                        disableColumnMenu: true,
                        headerName: 'Schedule',
                        valueGetter: (value) => {
                            return value
                        },
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
                        flex: 1,
                        cellClassName: styles['row_cells'],
                        headerClassName: styles['row_header'],
                        headerAlign: 'center',
                        align: 'center',
                    },
                    {
                        field: 'completion_date',
                        hideable: false,
                        disableColumnMenu: true,
                        headerName: 'Completion Date',
                        valueGetter: (value) => {
                            return value
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
                                ''
                            )

                            return out
                        },
                        flex: 1,
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
                        flex: 1,
                        cellClassName: `${styles['row_cells']}`,
                        headerClassName: styles['row_header'],
                    },
                ]}
                getRowClassName={(params) => {
                    return styles[`status-${params.row.status}`]
                }}
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
                onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
                onPaginationModelChange={handlePageChange}
                pageSizeOptions={[10, 25, 50, 100]}
                disableColumnSorting={true}
                onFilterModelChange={onFilterChange}
            />
        </div>
    )
}

export default ReportsTable
