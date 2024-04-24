import React, { useEffect, Suspense, lazy } from 'react'

import { Navigate, Route, Routes } from 'react-router-dom'
// import ReportIssue from './pages/report_issue/ReportIssue'
import Login from './pages/auth/Login'
import useAuth from './hooks/auth-hook'
import AuthContext from './context/auth-context'
import IssueReported from './pages/report_issue/IssueReported'
// import Task from './pages/tasks/Task'
import CreateProject from './pages/projects/CreateProject'
import ProjectCreated from './pages/projects/ProjectCreated'
import Project from './pages/projects/Project'
import MyProjects from './pages/my_projects/MyProjects'
import Departments from './pages/departments/Departments'
import DepartmentList from './pages/departments/DepartmentList'
import Department from './pages/departments/Department'
// import Dashboard from './pages/dashboard/Dashboard'
import IssueSection from './pages/dashboard/IssueSection'
import TasksSection from './pages/dashboard/TasksSection'
import Notifications from './pages/Notifications/Notifications'
// import Reports from './pages/reports/Reports'
import Profile from './pages/profile/Profile'
import ProfileDetails from './pages/profile/ProfileDetails'
import Logout from './pages/auth/Logout'
import SplashScreen from './pages/spashscreen/SplashScreen'
// import EditProject from './pages/projects/EditProject'

const MyTasks = lazy(() => import('./pages/my_tasks/MyTasks'))
const Task = lazy(() => import('./pages/tasks/Task'))
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'))
const ReportIssue = lazy(() => import('./pages/report_issue/ReportIssue'))
const Reports = lazy(() => import('./pages/reports/Reports'))
// const Login = lazy(() => import('./pages/auth/Login'))
const EditProject = lazy(() => import('./pages/projects/EditProject'))

const App = () => {
    const {
        user,
        token,
        loginHandler,
        logoutHandler,
        isLoggedIn,
        hasPermission,
        fetchUserData,
    } = useAuth()
    let routes

    routes = (
        <Suspense fallback={<SplashScreen />}>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate replace to="login" />}
                ></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/logout" element={<Logout />}></Route>
                <Route
                    path="/notifications"
                    element={<Notifications />}
                ></Route>
                <Route path="/tasks/:id" element={<Task />}></Route>
                <Route path="/tasks" element={<MyTasks />}></Route>
                <Route path="/new-issue" element={<ReportIssue />}></Route>
                <Route path="/projects" element={<MyProjects />}></Route>
                <Route path="/projects/:id" element={<Project />}></Route>
                <Route
                    path="/edit-project/:project_id"
                    element={<EditProject />}
                ></Route>
                <Route path="/new-project" element={<CreateProject />}></Route>
                <Route path="/reports" element={<Reports />}></Route>
                <Route
                    path="/new-issue-reported"
                    element={<IssueReported />}
                ></Route>
                <Route
                    path="/new-project-submitted"
                    element={<ProjectCreated />}
                ></Route>

                <Route path="/departments" element={<Departments />}>
                    <Route path="" element={<DepartmentList />}></Route>
                    <Route path=":id" element={<Department />}></Route>
                </Route>
                <Route path="/dashboard" element={<Dashboard />}>
                    <Route path="" element={<IssueSection />}></Route>
                    <Route path="tasks" element={<TasksSection />}></Route>
                </Route>
                <Route path="/profile" element={<Profile />}>
                    <Route path="" element={<ProfileDetails />}></Route>
                </Route>
            </Routes>
        </Suspense>
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
                    hasPermission: hasPermission,
                    fetchUserData: fetchUserData,
                }}
            >
                {routes}
            </AuthContext.Provider>
        </div>
    )
}

export default App
