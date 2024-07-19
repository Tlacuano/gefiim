import { useContext, useEffect } from "react"
import { Route, BrowserRouter as Router, Routes} from "react-router-dom"
import { AuthContext } from "./modules"
import { textColor } from "./utils/functions/getContrast"

import { AuthRoutes } from "./modules"
import { AppRouter } from "./components"

import axios from './config/http-clientt.gateway'

function App() {
  const { logged, role } = useContext(AuthContext)

  const getInstitutionalInformation = async () => {
    try {
      const response = await axios.doGet('/institutional-information/get-institutional-information')
      
      const textColorPrimary = textColor(response.data.primary_color)

      document.documentElement.style.setProperty('--primary-color', response.data.primary_color)
      document.documentElement.style.setProperty('--secondary-color', response.data.secondary_color)
      document.documentElement.style.setProperty('--text-color-primary', textColorPrimary)

      localStorage.setItem('institutionalInformation', JSON.stringify(response.data))

    } catch (error) {
      console.log(error)
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
