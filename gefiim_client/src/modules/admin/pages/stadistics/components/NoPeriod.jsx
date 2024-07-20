import { Col, Row } from "react-bootstrap"


export const NoPeriod = () => {
    return (
        <Row className="d-flex justify-content-center align-items-center" style={{height:'80vh'}}>
            <Col className="text-center">
                <h4>No hay periodos de venta registrados actualmente</h4>
            </Col>
        </Row>
    )
}