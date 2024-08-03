import { Nav, Navbar } from "react-bootstrap"
import '../utils//main-landing-admin.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AuthContext } from "../../../../auth"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"


export const SidebarXL = () => {
    const { logout } = useContext(AuthContext)

    const navigate = useNavigate()
    const navigateFunction = (path) => {
        navigate
    }

    return(
        <Navbar
            className="d-none d-lg-block sidebar"
            style={{
                backgroundColor: "var(--primary-color)",
                height: "100vh",
                paddingLeft: "10px",
                paddingRight: "10px",
            }}
        >
            <Nav className="flex-column text-center h-100 d-flex">
                <Nav.Item>
                    <FontAwesomeIcon icon='home' onClick={() => navigate('/')} size="2x" className="text-secondary-color my-3 selectable" />
                </Nav.Item>
                <hr/>
                <Nav.Item>
                    <FontAwesomeIcon icon='calendar' onClick={()=> navigate('/periodo-de-venta')} style={{ fontSize:'23px'}} className="text-secondary-color my-3 selectable" />
                </Nav.Item>
                <Nav.Item href="#">
                    <FontAwesomeIcon icon='sitemap' onClick={()=> navigate('/especialidades')}  style={{ fontSize:'23px'}}  className="text-secondary-color my-3 selectable" />
                </Nav.Item>
                <Nav.Item href="#">
                    <FontAwesomeIcon icon='school' onClick={()=> navigate('/informacion-institucional')} style={{ fontSize:'23px'}} className="text-secondary-color my-3 selectable" />
                </Nav.Item>
                <Nav.Item href="#">
                    <FontAwesomeIcon icon='folder' onClick={() => navigate('/candidatos')} style={{ fontSize:'23px'}} className="text-secondary-color my-3 selectable" />
                </Nav.Item>
                <Nav.Item href="#">
                    <FontAwesomeIcon icon='users' onClick={()=> navigate('/administradores')}  style={{ fontSize:'23px'}} className="text-secondary-color my-3 selectable" />
                </Nav.Item>

                <Nav.Item href="#" className="mt-auto">
                    <FontAwesomeIcon icon='arrow-right-from-bracket' style={{ fontSize:'28px'}} className="text-secondary-color my-3 selectable" onClick={logout} />
                </Nav.Item>
            </Nav>

        </Navbar>
    )
}