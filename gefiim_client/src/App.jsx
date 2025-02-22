import { useContext, useEffect } from "react"
import { Route, BrowserRouter as Router, Routes} from "react-router-dom"
import { AuthContext } from "./modules"
import { textColor } from "./utils/functions/getContrast"

import { AuthRoutes } from "./modules"
import { AppRouter } from "./components"

import axios from './config/http-clientt.gateway'
import { ToastWarning } from "./components/SweetAlertToast"

function App() {
  const { logged, role } = useContext(AuthContext)

  const getInstitutionalInformation = async () => {
    try {
      const response = await axios.doGet('/institutional-information/get-institutional-information')
      
      const textColorPrimary = textColor(response.data.primary_color)
      response.data.textColorPrimary = textColorPrimary

      document.documentElement.style.setProperty('--primary-color', response.data.primary_color)
      document.documentElement.style.setProperty('--secondary-color', response.data.secondary_color)
      document.documentElement.style.setProperty('--text-color-primary', textColorPrimary)

      // Cambiar el logo de la pestaña
      const link = document.querySelector("link[rel*='icon']")
      const logo = 'data:image/png;base64,' + response.data.logo
      link.href = logo

      // cambiarr el titulo de la pestaña
      document.title = response.data.name + ' - Registro de candidatos'


      localStorage.setItem('institutionalInformation', JSON.stringify(response.data))

    } catch (error) {
      ToastWarning(error.response.data.message)
    }
  }

  useEffect(() => {
    getInstitutionalInformation()
  }, [])



  return (
    <>
      <Router>
        { /* Enrutador principal */}
        <Routes>
          <Route path="/*" element={ logged ? <AppRouter role={role} /> : <AuthRoutes/>} />
        </Routes>
      </Router>
    </>
    
  )
}

export default App
