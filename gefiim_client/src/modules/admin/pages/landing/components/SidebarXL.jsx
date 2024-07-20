import { Nav, Navbar } from "react-bootstrap"
import '../utils//main-landing-admin.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AuthContext } from "../../../../auth"
import { useContext } from "react"


export const SidebarXL = () => {
    const { logout } = useContext(AuthContext)

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
                    <FontAwesomeIcon icon='home' size="2x" className="text-secondary-color my-3 selectable" />
                </Nav.Item>
                <hr/>
                <Nav.Item>
                    <FontAwesomeIcon icon='calendar' style={{ fontSize:'28px'}} className="text-secondary-color my-3 selectable" />
                </Nav.Item>
                <Nav.Item href="#">
                    <FontAwesomeIcon icon='sitemap'  style={{ fontSize:'28px'}}  className="text-secondary-color my-3 selectable" />
                </Nav.Item>
                <Nav.Item href="#">
                    <FontAwesomeIcon icon='school' style={{ fontSize:'28px'}} className="text-secondary-color my-3 selectable" />
                </Nav.Item>
                <Nav.Item href="#">
                    <FontAwesomeIcon icon='folder' style={{ fontSize:'28px'}} className="text-secondary-color my-3 selectable" />
                </Nav.Item>
                <Nav.Item href="#">
                    <FontAwesomeIcon icon='users' style={{ fontSize:'28px'}} className="text-secondary-color my-3 selectable" />
                </Nav.Item>

                <Nav.Item href="#" className="mt-auto">
                    <FontAwesomeIcon icon='arrow-right-from-bracket' style={{ fontSize:'35px'}} className="text-secondary-color my-3 selectable" onClick={logout} />
                </Nav.Item>
            </Nav>

        </Navbar>
    )
}