import { useEffect, useState } from "react"
import {  Col, Container, Row } from "react-bootstrap"

import '../../utils/auth.css'
import { Home } from "./components/Home"
import { Login } from "./components/Login"



export const Landing = () => {
    // images
    const [data, setData] = useState({
        main_image: '',
        logo: '',
    })

    useEffect(() => {
        const institutionalInformation = JSON.parse(localStorage.getItem('institutionalInformation'))
        if (institutionalInformation) {
            setData(institutionalInformation)
        }
    }, [])

    // parte a mostrar
    const [component, setComponent] = useState(1)

    const increaseComponent = () => {
        console.log('aumentar')
        setComponent(component + 1)
    }

    const decreaseComponent = () => {
        setComponent(component - 1)
    }


    return (
        <div className="full-flex-screen">
            <div className="main-image-section">
                <img src={`data:image/png;base64,${data.main_image}`} alt="main-image" className="main-image" />
            </div>
            <div className="content-section">
                <Container style={{height:'100%'}}>
                    <Row>
                        <Col className="text-center">
                            <img style={{ maxWidth: '70%' }} src={`data:image/png;base64,${data.logo}`} alt="logo" className="logo p-5" />
                        </Col>
                    </Row>
                    {
                        component === 1 ?
                            <Home increaseComponent={ increaseComponent } />
                        :
                            <Login decreaseComponent={ decreaseComponent } />
                    }
                </Container>
            </div>
        </div>
    )
}

