import React from 'react'

import PrimaryButton from './components/Button/PrimaryButton'
import OutlinedButton from './components/Button/OutlinedButton'
import TextField from './components/TextField/TextField'
import { Navigate, Route, Routes } from 'react-router-dom'
import ReportIssue from './pages/report_issue/ReportIssue'
import Login from './pages/auth/Login'
import useAuth from './hooks/auth-hook'
import AuthContext from './context/auth-context'
import IssueReported from './pages/report_issue/IssueReported'
import MyTasks from './pages/my_tasks/MyTasks'
import Task from './pages/tasks/Task'
import CreateProject from './pages/projects/CreateProject'
import ProjectCreated from './pages/projects/ProjectCreated'
import Project from './pages/projects/Project'
import MyProjects from './pages/my_projects/MyProjects'
import Departments from './pages/departments/Departments'
import DepartmentList from './pages/departments/DepartmentList'
import Department from './pages/departments/Department'
import Dashboard from './pages/dashboard/Dashboard'
import IssueSection from './pages/dashboard/IssueSection'
import TasksSection from './pages/dashboard/TasksSection'
import ConfigurePermissions from './pages/admin/Permissions/ConfigurePermissions'
import Notifications from './pages/Notifications/Notifications'

const App = () => {
    const { user, token, loginHandler, logoutHandler, isLoggedIn } = useAuth()
    let routes

    routes = (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/notifications" element={<Notifications />}></Route>
            <Route path="/tasks/:id" element={<Task />}></Route>
            <Route path="/tasks" element={<MyTasks />}></Route>
            <Route path="/new-issue" element={<ReportIssue />}></Route>
            <Route path="/projects" element={<MyProjects />}></Route>
            <Route path="/projects/:id" element={<Project />}></Route>
            <Route path="/new-project" element={<CreateProject />}></Route>
            <Route
                path="/new-issue-reported"
                element={<IssueReported />}
            ></Route>
            <Route
                path="/new-project-submitted"
                element={<ProjectCreated />}
            ></Route>
            <Route
                path="/permissions"
                element={<ConfigurePermissions />}
            ></Route>

            <Route path="/departments" element={<Departments />}>
                <Route path="" element={<DepartmentList />}></Route>
                <Route path=":id" element={<Department />}></Route>
            </Route>
            <Route path="/dashboard" element={<Dashboard />}>
                <Route path="" element={<IssueSection />}></Route>
                <Route path="tasks" element={<TasksSection />}></Route>
            </Route>
        </Routes>
    )

    return (
        <div className={'main-container'}>
            <AuthContext.Provider
                value={{
                    user: user,
                    token: token,
                    isLoggedIn: isLoggedIn,
                    onLogout: logoutHandler,
                    onLogin: loginHandler,
                }}
            >
                {routes}
            </AuthContext.Provider>
        </div>
    )
}

export default App
