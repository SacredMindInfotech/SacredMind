import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}
const currentPath = window.location.pathname;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider 
    appearance={{
      elements: {
        userProfile: "none",
      }
    }}
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl={currentPath}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
