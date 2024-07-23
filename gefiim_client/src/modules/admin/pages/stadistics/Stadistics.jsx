import { NavbarAdmin } from "../../components/NavbarAdmin"
import axios from "../../../../config/http-clientt.gateway"
import { useEffect, useState } from "react"
import { Loanding } from "./components/Loanding"
import { NoPeriod } from "./components/NoPeriod"
import { Card, Row, Col, CardBody, ProgressBar } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { LoadAlert, ToastWarning } from "../../../../components/SweetAlertToast"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { RegisterPaymentModal } from "./components/RegisterPaymentModal"
import { base64ToFile } from "../../../../utils/functions/base64ToFile"

export const Stadistics = () => {
    const [data, setData] = useState('')
    const [stadistics, setStadistics] = useState('')
    const [showModalPayment, setShowModalPayment] = useState(false)

    const getCurrentPeriod = async () => {
        try {
            // traer el periodo actual
            const response = await axios.doGet('/sale-period/get-current-period')
            // setear el periodo actual
            setData(response.data)
        } catch (error) {
            setData('No hay ningún periodo de venta activo')
            ToastWarning(error.response.data.message)
        }
    }

    const getStadistics = async () => {
        try {
            const response = await axios.doPost('/stadistics/get-stadistics', { id_period: data.currentSalePeriod })
            setStadistics(response.data)
        } catch (error) {
            ToastWarning(error.response.data.message)
        }
    }

    const generateList = async () => {
        try {
            LoadAlert(true)
            const response = await axios.doPost('/candidates/generate-list', { id_period: data.currentSalePeriod })
            LoadAlert(false)
            base64ToFile(response.data, 'Lista de candidatos generada el ')
        } catch (error) {
            ToastWarning(error.response.data.message)
        }
    }

    useEffect(() => {
        getCurrentPeriod()
    }, [])

    useEffect(() => {
        if (data !== '') {
            getStadistics()
        }
    }, [data])



    return (
        <>
            <NavbarAdmin title="Inicio" />
            {
                data === 'No hay ningún periodo de venta activo' ?
                    <NoPeriod />
                    :
                    data === '' ?
                        <Loanding />
                        :
                        data !== '' && stadistics !== '' &&
                        <Row>
                            <Col lg='6' className="mb-3" >
                                <Card style={{ height: '130px' }}>
                                    <CardBody>
                                        <Row className="d-flex align-items-center justify-content-center h-100">
                                            <Col style={{
                                                borderRight: '1px solid #e9ecef'
                                            }}>
                                                <h4>Periodo de venta actual</h4>
                                                <span className="text-muted">{data.start_date} - {data.end_date}</span>
                                            </Col>
                                            <Col>
                                                <Row className="h-100">
                                                    <Col >
                                                        <div className="text-center h-100 selectable" onClick={() => setShowModalPayment(!showModalPayment)}>
                                                            <FontAwesomeIcon icon='dollar-sign' size='3x' />
                                                            <p className="text-muted m-0 mt-2">Registrar pago</p>
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div className="text-center h-100 selectable"  onClick={generateList}>
                                                            <FontAwesomeIcon icon='download' size='3x' />
                                                            <p className="text-muted m-0 mt-2">Generar lista</p>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg='3' className="mb-3">
                                <Card style={{ height: '130px' }}>
                                    <CardBody>
                                        <Row className="d-flex align-items-center justify-content-center h-100">
                                            <Col className="text-center">
                                                <h2>{stadistics.total_tokens_autorized}</h2>
                                                <span className="text-muted">Total de fichas autorizadas</span>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg='3' className="mb-3">
                                <Card style={{ height: '130px' }}>
                                    <CardBody>
                                        <Row className="d-flex align-items-center justify-content-center h-100">
                                            <Col className="text-center">
                                                <h2>{stadistics.total_tokens_registered}</h2>
                                                <span className="text-muted">Total de fichas registradas</span>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg='9'>
                                <Row>
                                    <Col>
                                        <Card>
                                            <CardBody>
                                                <ResponsiveContainer width="100%" height={600}>
                                                    <BarChart
                                                        data={stadistics.stadistics_by_speciality}
                                                        margin={{
                                                            top: 20, right: 30, left: 20, bottom: 5,
                                                        }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="speciality_name" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="registered_count" fill="var(--secondary-color)" name="Fichas registradas" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg='3'>
                                <Card>
                                    <CardBody>
                                        <div style={{height:'600px', overflowY:'auto', overflowX:'hidden'}}>
                                            <h5 className="mb-4">Fichas pagadas / sin pagar</h5>
                                            {
                                                stadistics.stadistics_by_speciality.map((speciality, index) => {
                                                    return (
                                                        <Row key={index} className="mb-3">
                                                            
                                                            <Col>
                                                                <h6>{speciality.speciality_name} </h6>
                                                                <ProgressBar now={speciality.percentage_payed}  />
                                                                <Row>
                                                                    <Col>
                                                                        <span style={{ fontSize: 12}} className="text-muted">Fichas pagadas ({speciality.payed_count}) </span>
                                                                    </Col>
                                                                    <Col className="text-end">
                                                                        <span style={{ fontSize: 12}} className="text-muted">Fichas sin pagar ({speciality.not_payed_count})</span>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    )
                                                })
                                            }
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
            }
            <RegisterPaymentModal show={showModalPayment} handleClose={()=> setShowModalPayment(false)} idPeriod={data.currentSalePeriod} />
        </>
    )
}