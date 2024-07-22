import { Col, Container, Row } from "react-bootstrap"
import { SidebarXL } from "./components/SidebarXL"
import './utils/main-landing-admin.css'
import { Route, Routes } from "react-router-dom"

import { Stadistics } from "../stadistics"
import { SalePeriods } from "../sale_periods/SalePeriods"
import { Specialities } from "../specialitys/Specialities"
import { InstitutionalInformation } from "../institutional_information/InstitutionalInformation"

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
                        <Route path="/periodo-de-venta" element={<SalePeriods/>} />
                        <Route path="/especialidades" element={<Specialities />} />
                        <Route path="/informacion-institucional" element={<InstitutionalInformation />} />
                    </Routes>
                </Col>
            </Row>
        </Container>
    )
}