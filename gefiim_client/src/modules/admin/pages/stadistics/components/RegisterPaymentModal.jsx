import { Col, Modal, Row } from "react-bootstrap"
import { ButtonComponent, InputComponent } from "../../../../../components"
import { useEffect, useState } from "react"
import axios from '../../../../../config/http-clientt.gateway'
import { LoadAlert, SweetAlert, ToastWarning } from "../../../../../components/SweetAlertToast"


export const RegisterPaymentModal = ({show, handleClose, idPeriod}) => {
    const [token, setToken] = useState('')
    const [data, setData] = useState('')

    const searchToken = async () => {
        try{
            LoadAlert(true)
            const payload = {
                id_period: idPeriod,
                username: token
            }
            const response = await axios.doPost('/candidates/get-candidate-by-period-and-user', payload)
            setData(response.data)
            LoadAlert(false)
        }catch(error){
            LoadAlert(false)
            ToastWarning(error.response.data.message)
        }
    }

    const registerPayment = async () => {
        try{
            const payload = {
                username: token,
                payed: data.payment === 'Pendiente' ? true : false
            }

            const text = `¿Deseas ${data.payment === 'Pendiente' ? 'registrar' : 'cancelar'} el pago de ${data.name}?`

            SweetAlert(
                "question",
                "¿Estás seguro?",
                text,
                "Aceptar",
                async () => {
                    try {
                        LoadAlert(true)
                        const response = await axios.doPost('/candidates/register-payment', payload)
                        
                        if(response.data){
                            searchToken()
                        }
                        LoadAlert(false)
                    } catch (error) {
                        LoadAlert(false)
                        ToastWarning(error.response.data.message)
                    }
                }
            )
        }catch(error){
            ToastWarning(error.response.data.message)
        }
    }

    useEffect(() => {
        if(!show){
            setToken('')
            setData('')
        }
    }, [show])


    return(
        <Modal show={show} onHide={handleClose} centered >
            <Modal.Header closeButton>
                <Modal.Title>Registrar pago</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col >
                        <InputComponent
                            label="No. ficha"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                    </Col>
                    <Col className="mt-auto" lg='auto' md='auto' sm='auto' xs='auto'>
                        <ButtonComponent
                            action={searchToken}
                        >
                            Búscar
                        </ButtonComponent>
                    </Col>
                </Row>
                {
                    data && (
                        <Row className="mt-4 px-2">
                            <Col  lg='12' md='12' sm='12' xs='12' >
                                <b>Nombre:</b> {data.name} 
                            </Col>
                            <Col className="mt-3" lg='12' md='12' sm='12' xs='12' >
                                <b>CURP:</b> {data.curp}
                            </Col>
                            <Col className="mt-3"  lg='12' md='12' sm='12' xs='12' >
                                <b>Especiliadad:</b> {data.speciality_name}
                            </Col>
                            <Col className="mt-3"  lg='12' md='12' sm='12' xs='12' >
                                <b>No. Ficha:</b> {data.ficha}
                            </Col>
                            <Col className="mt-3"  lg='12' md='12' sm='12' xs='12' >
                                <b>Estado de pago:</b> {data.payment}
                            </Col>
                            <Col className="mt-5 mb-3 text-end" lg='12' md='12' sm='12' xs='12'>
                                <ButtonComponent
                                    action={registerPayment}
                                >
                                    {data.payment === 'Pendiente' ? 'Registrar pago' : 'Cancelar pago'}
                                </ButtonComponent>
                            </Col>
                        </Row>
                    )
                }
            </Modal.Body>
        </Modal>
    )
}