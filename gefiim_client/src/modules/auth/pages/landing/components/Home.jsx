import { Col, Row } from "react-bootstrap"
import { ButtonComponent } from "../../../../../components"
import { useNavigate } from "react-router-dom"
import { LoadAlert, ToastWarning } from "../../../../../components/SweetAlertToast"
import axios from "../../../../../config/http-clientt.gateway"



export const Home = ({ increaseComponent }) => {

        // navegar a registro
        const navigate = useNavigate()

        const navigateToRegister = async () => {
            try {
                LoadAlert(true)
                const response = await axios.doGet('/sale-period/get-current-period')
                LoadAlert(false)

                if (response.data.specialities.length > 0) {
                    navigate('/registro')
                }
            }
            catch (error) {
                ToastWarning('No hay periodos de venta activos')
            }
        }

        
    return (
        <>
            <Row style={{ marginTop: '15vh' }} className="">
                <Col className="text-center">
                    <ButtonComponent
                        action={ navigateToRegister}
                        pl={130}
                        pr={130}
                        textSize={27}
                    >
                        Tramitar ficha
                    </ButtonComponent>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col className="text-center">
                    <span className="selectable text-hover" style={{ fontSize: 19 }} onClick={ increaseComponent } >Iniciar sesión</span>
                </Col>
            </Row>
        </>
    )
}