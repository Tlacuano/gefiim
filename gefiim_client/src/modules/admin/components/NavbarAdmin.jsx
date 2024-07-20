import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"


export const NavbarAdmin = ( {title = ''}) => {

    const [logo, setLogo] = useState('')

    useEffect(() => {
        const institutionalInformation = JSON.parse(localStorage.getItem('institutionalInformation'))
        if (institutionalInformation) {
            setLogo(institutionalInformation.logo)
        }
    }, [])



    return (
        <Row className='mt-3' >
            <Col className='d-flex align-items-center'>
                <h1>{ title }</h1>
            </Col>
            <Col lg="1" sm="3" xs="3">
                <div className="h-100 d-flex align-items-center justify-content-center mb-1" style={{ border: '1px solid #858585', borderRadius: '15px', maxHeight:'70px' }}>
                    <img className=' px-3 img-fluid' src={`data:image/png;base64,${logo}`} alt="logo" style={{ maxHeight: '75%'}}/>
                </div>
            </Col>
            <hr className="mt-3"/>
        </Row>
    )
}