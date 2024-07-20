import { Col, Container, Row } from "react-bootstrap"
import { SidebarXL } from "./components/SidebarXL"
import './utils/main-landing-admin.css'
import { Route, Routes } from "react-router-dom"

import { Stadistics } from "../stadistics"

export const LandingAdmin = () => {
    return (
        <Container fluid>
            <Row>
                <Col lg='auto' className="p-0">
                    <SidebarXL />
                </Col>
                <Col className="content px-5">
                    <Routes>
                        <Route path="/" element={<Stadistics/>} />
                    </Routes>
                </Col>
            </Row>
        </Container>
    )
}