import { Col, Form, Row } from "react-bootstrap"
import { ButtonComponent, InputComponent } from "../../../../../components"
import { useContext, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AuthContext } from "../../../context"
import { LoadAlert, ToastWarning } from "../../../../../components/SweetAlertToast"
import axios from '../../../../../config/http-clientt.gateway'
import { base64ToFile } from "../../../../../utils/functions/base64ToFile"
import { ResetPassword } from "./ResetPassowrd"

export const Login = ({ decreaseComponent }) => {
    const { login } = useContext(AuthContext)

    const [showResetPassword, setShowResetPassword] = useState(false)

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

    const validateForm = async () => {
        let check = false
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
            check = true
        }

        if (form.password === '') {
            newError.password.error = true
            newError.password.message = 'Este campo es obligatorio'
            check = true
        }

        setError(newError)

        if (!check) {
            try {
                LoadAlert(true)
                const response = await axios.doPost('/auth/login', form)
                const { username, token, role, document } = response.data

                if(role === 'CANDIDATE'){
                    base64ToFile(document, 'Ficha de inscripción')
                    setForm({ username: '', password: '' })
                }else{
                    login( username, token, role )
                }

                
                LoadAlert(false)

            } catch (error) {
                ToastWarning(error.response.data.message)
            }
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
                        <span className="selectable text-hover" onClick={()=> setShowResetPassword(true)} style={{ fontSize: 17 }} >Recuperar contraseña</span>
                    </Col>
                </Row>
            </Form>

            <ResetPassword show={showResetPassword} handleClose={() => setShowResetPassword(false)} />
        </>
    )
}