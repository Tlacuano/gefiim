import { Col, Form, Row } from "react-bootstrap"
import { ButtonComponent, InputComponent } from "../../../../../components"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Login = ({ decreaseComponent }) => {

    const [form, setForm] = useState({
        username: '',
        password: ''
    })

    const [error, setError] = useState({
        username: {
            error: false,
            message: ''
        },
        password: {
            error: false,
            message: ''
        }
    })

    const validateForm = () => {
        let error = false
        let newError = {
            username: {
                error: false,
                message: ''
            },
            password: {
                error: false,
                message: ''
            }
        }

        if (form.username === '') {
            newError.username.error = true
            newError.username.message = 'Este campo es obligatorio'
            error = true
        }

        if (form.password === '') {
            newError.password.error = true
            newError.password.message = 'Este campo es obligatorio'
            error = true
        }

        setError(newError)
        if (!error) {
            console.log(form)
        } 
    }

    return (
        <>
            <Row className="px-5">
                <Col>
                    <span className="text-muted selectable text-hover" onClick={ decreaseComponent }>
                        <FontAwesomeIcon icon={['fas', 'arrow-left']} style={{ fontSize: 13 }} />   Volver
                    </span>
                </Col>
            </Row>
            <Form className="px-5" style={{ marginTop: '4vh' }}>
                <Row>
                    <Col>
                        <InputComponent
                            label="Usuario"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            error={error.username.error}
                            errorMessage={error.username.message}
                        />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <InputComponent
                            label="Contraseña"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            error={error.password.error}
                            errorMessage={error.password.message}
                            type="password"
                        />
                    </Col>
                </Row>
                <Row className="mt-5 pt-5">
                    <Col className="text-center">
                        <ButtonComponent
                            action={ validateForm }
                            pl={120}
                            pr={120}
                            textSize={22}
                        >
                            Iniciar sesión
                        </ButtonComponent>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center mt-4">
                        <span className="selectable text-hover" style={{ fontSize: 17 }} >Recuperar contraseña</span>
                    </Col>
                </Row>
            </Form>
        </>
    )
}