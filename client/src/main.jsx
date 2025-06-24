import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from './context/UserContext';
import { RoutesProvider } from './context/RoutesContext.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RoutesProvider>
        <App />
      </RoutesProvider>
    </UserProvider>
  </StrictMode>,
)
