import { AppBar, Box, Fab, IconButton, Toolbar } from '@mui/material'
import {
    IconBell,
    IconBuilding,
    IconFolderOpen,
    IconSubtask,
    IconUserSquareRounded,
} from '@tabler/icons-react'
import { IconMessageReport, IconSmartHome } from '@tabler/icons-react'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import userPermission from '../../hooks/userPermission'
import AuthContext from '../../context/auth-context'

const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
})

const itemStyles = {
    color: 'inherit',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '12px',
}

const BottomNavigationBar = (props) => {
    const { current = 0 } = props

    const [selectedItem, setSelectedItem] = useState(current)
    const [nav_items, setNavItems] = useState([])

    const navigate = useNavigate()

    const nav_active_style = {
        ...itemStyles,
        color: 'var(--accent)',
        fill: 'var(--accent)',
    }

    const nav_style = {
        ...itemStyles,
        color: 'var(--fc-body)',
        fill: 'var(--fc-body)',
    }

    const { hasPermission } = userPermission()
    const userCtx = useContext(AuthContext)

    useEffect(() => {
        const insertNav = () => {
            setNavItems([])
            if (userCtx.hasPermission('401')) {
                setNavItems((prev) => [
                    ...prev,
                    {
                        index: 0,
                        name: 'Home',
                        url: '/dashboard',
                        icon: <IconSmartHome />,
                    },
                ])
            }
            if (userCtx.hasPermission('101') || userCtx.hasPermission('102')) {
                setNavItems((prev) => [
                    ...prev,
                    {
                        index: 1,
                        name: 'Tasks',
                        url: '/tasks',
                        icon: <IconMessageReport />,
                    },
                ])
            }
            if (
                userCtx.hasPermission('201') ||
                userCtx.hasPermission('202') ||
                userCtx.hasPermission('203') ||
                userCtx.hasPermission('204')
            ) {
                setNavItems((prev) => [
                    ...prev,
                    {
                        index: 2,
                        name: 'Projects',
                        url: '/projects',
                        icon: <IconSubtask />,
                    },
                ])
            }
            if (userCtx.hasPermission('301')) {
                setNavItems((prev) => [
                    ...prev,
                    {
                        index: 3,
                        name: 'Department',
                        url: '/departments',
                        icon: <IconBuilding />,
                    },
                ])
            }
            setNavItems((prev) => [
                ...prev,
                {
                    index: 4,
                    name: 'Notifications',
                    url: '/notifications',
                    icon: <IconBell />,
                },
            ])
            setNavItems((prev) => [
                ...prev,
                {
                    index: 6,
                    name: 'Profile',
                    url: '/profile',
                    icon: (
                        <IconUserSquareRounded
                        // onClick={() => userCtx.onLogout()}
                        />
                    ),
                },
            ])
            if (userCtx.hasPermission('501')) {
                setNavItems((prev) => [
                    ...prev,
                    {
                        index: 5,
                        name: 'Reports',
                        url: '/reports',
                        icon: (
                            <IconFolderOpen
                            // onClick={() => userCtx.onLogout()}
                            />
                        ),
                    },
                ])
            }
        }

        if (userCtx.user) insertNav()
    }, [userCtx.user])

    return (
        <AppBar
            position="fixed"
            // color="primary"
            sx={{ top: 'auto', bottom: 0, background: 'var(--bg)' }}
        >
            <Toolbar
                sx={{
                    paddingInline: 0,
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                }}
            >
                {nav_items.sort((a, b) => a.index - b.index) &&
                    nav_items.map((item, index) => {
                        return (
                            <Box
                                key={index}
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <IconButton onClick={() => navigate(item.url)}>
                                    <Box
                                        sx={
                                            selectedItem === item.index
                                                ? nav_active_style
                                                : nav_style
                                        }
                                    >
                                        {item.icon}
                                        {window.innerWidth > 768
                                            ? item.name
                                            : selectedItem === item.index
                                            ? item.name
                                            : null}
                                    </Box>
                                </IconButton>
                            </Box>
                        )
                    })}

                {/* <StyledFab color="secondary" aria-label="add">
                    <IconSmartHome />
                </StyledFab> */}
                {/* <Box sx={{ flexGrow: 1 }} /> */}
            </Toolbar>
        </AppBar>
    )
}

export default BottomNavigationBar
