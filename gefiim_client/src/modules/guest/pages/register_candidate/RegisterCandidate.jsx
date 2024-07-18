import { Col, Container, Row } from 'react-bootstrap'
import axios from '../../../../config/http-clientt.gateway'
import { useEffect, useState } from 'react'
import { Stepper } from './components/Stepper'
import { useNavigate } from 'react-router-dom'

export const RegisterCandidate = () => {
    const navigate = useNavigate()  

    const [logo, setLogo] = useState('')
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        const institutionalInformation = JSON.parse(localStorage.getItem('institutionalInformation'))
        if (institutionalInformation) {
            setLogo(institutionalInformation.logo)
        }
    }, [])

    // traer la informacion inicial
    const [initialData, setInitialData] = useState({
        specialities: [],
        specialitiesSeled: [],
        currentSalePeriod: 0
    })


    const getCurrentPeriod = async () => {
        try {
            const response = await axios.doGet('/sale-period/get-current-period')
            
            if (response.data.specialities.length === 0) {
                navigate('/')
            }

            setInitialData({
                specialities: response.data.specialities,
                specialitiesSeled: response.data.specialities_saled,
                currentSalePeriod: response.data.currentSalePeriod
            })

        } catch (error) {

        }
    }

    useEffect(() => {
        getCurrentPeriod()

    }, [])

    return (
        <Container>
            <Row className='mt-3'>
                <Col className='d-flex align-items-center'>
                    <h1>Registro de candidato</h1>
                </Col>
                <Col lg="2" sm="3" xs="3" >
                    <img className='selectable' src={`data:image/png;base64,${logo}`} alt="logo" style={{ maxWidth: '90%' }} onClick={() => navigate("/")}  />
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col>
                    <Stepper steps={[
                        'Información general del aspirante',
                        'Datos del domicilio actual',
                        'Información del padre, madre o tutor ',
                        'Secundaria de procedencia',
                        'Selección de carrera',
                    ]} 
                    currentStep={currentStep}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                </Col>
            </Row>
        </Container>
    )
}