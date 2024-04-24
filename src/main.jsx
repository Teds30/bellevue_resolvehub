import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import NotifyProvider from './components/Feedback/NotifyProvider'

// import './utils/firebase-sw.js'

import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={true} /> */}
        <NotifyProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </NotifyProvider>
    </QueryClientProvider>
)
