import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import  { CaptainDataProvider } from './context/CapatainContext.jsx'
import UserContext from './context/UserContext.jsx'
import SocketProvider from './context/SocketContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <CaptainDataProvider>
  <UserContext>
    <SocketProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketProvider>
  </UserContext>
</CaptainDataProvider>,
)
