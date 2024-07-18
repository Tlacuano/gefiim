import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { AuthProvider } from "./modules"

import 'bootstrap/dist/css/bootstrap.min.css';
import './utils/main.css'

// importar font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
