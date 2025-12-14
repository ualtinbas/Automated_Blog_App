import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Homepage from './routes/Homepage.jsx';
import ArticlePage from './routes/ArticlePage.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import Write from './routes/Write.jsx';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    element:<MainLayout/>,
    children: [ 
      {
      path: "/",
      element: <Homepage/>
      },
      {
      path: "/:slug",
      element: <ArticlePage/>
      },
      {
      path: "/write",
      element: <Write/>
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer position="bottom-right" />
    </QueryClientProvider>
  </StrictMode>,
)
