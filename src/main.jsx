import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { router } from './route/routes.jsx'
import { RouterProvider } from 'react-router-dom'
import { TooltipProvider } from "@/components/ui/tooltip";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TooltipProvider delayDuration={0}>
      <RouterProvider router={router} />
    </TooltipProvider>
  </StrictMode>,
)