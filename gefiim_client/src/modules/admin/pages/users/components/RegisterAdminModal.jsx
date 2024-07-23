import { useState } from "react";
import { Alert, Col, Modal, Row } from "react-bootstrap";
import { ButtonComponent, InputComponent } from "../../../../../components";
import { LoadAlert, SweetAlert, ToastSuccess, ToastWarning } from "../../../../../components/SweetAlertToast";

import axios from '../../../../../config/http-clientt.gateway'


export const RegisterAdminModal = ({ show, handleClose }) => {
    const errorObject = {
        username: {
            error: false,
            message: ''
        },
        password: {
            error: false,
            message: ''
        },
        password_confirmation: {
            error: false,
            message: ''
        },
        email: {
            error: false,
            message: ''
        },
    }
    const [error, setError] = useState(errorObject);

    const [newAdmin, setNewAdmin] = useState({
        username: '',
        password: '',
        password_confirmation: '',
        email: ''
    });

    const validate = () => {
        let check = false;
        const errorObjectCopy = { ...errorObject };

        if (newAdmin.username === '') {
            errorObjectCopy.username.error = true;
            errorObjectCopy.username.message = 'El nombre de usuario es requerido';
            check = true;
        }else{
            if(newAdmin.username.length < 5){
                errorObjectCopy.username.error = true;
                errorObjectCopy.username.message = 'El nombre de usuario debe tener al menos 5 caracteres';
                check = true;
            }

            if(/(<script)\b/g.test(newAdmin.username)){
                errorObjectCopy.username.error = true;
                errorObjectCopy.username.message = 'Caracteres no permitidos';
                check = true;
            }

            if(newAdmin.username.length > 50){
                errorObjectCopy.username.error = true;
                errorObjectCopy.username.message = 'El nombre de usuario debe tener menos de 50 caracteres';
                check = true;
            }
        }

        if (newAdmin.email === '') {
            errorObjectCopy.email.error = true;
            errorObjectCopy.email.message = 'El correo electronico es requerido';
            check = true;
        }else{
            if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(newAdmin.email)){
                errorObjectCopy.email.error = true;
                errorObjectCopy.email.message = 'El correo electronico no es valido';
                check = true;
            }
        }

        if (newAdmin.password === '') {
            errorObjectCopy.password.error = true;
            errorObjectCopy.password.message = 'La contraseña es requerida';
            check = true;
        }else{
            if(!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(newAdmin.password)){
                errorObjectCopy.password.error = true;
                errorObjectCopy.password.message = 'La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula y un numero';
                check = true;
            }
        }

        if (newAdmin.password_confirmation === '') {
            errorObjectCopy.password_confirmation.error = true;
            errorObjectCopy.password_confirmation.message = 'Confirmar contraseña es requerido';
            check = true;
        }else {
            if(newAdmin.password !== newAdmin.password_confirmation){
                errorObjectCopy.password_confirmation.error = true;
                errorObjectCopy.password_confirmation.message = 'Las contraseñas no coinciden';
                check = true;
            }
        }

        setError(errorObjectCopy);
        if(!check){
            SweetAlert(
                'question',
                '¿Estás seguro?',
                '¿Deseas registrar al nuevo administrador?',
                'Aceptar',
                async () => {
                    try {
                        LoadAlert(true)
                        const response = await axios.doPost('/user/register-user', newAdmin)
                        LoadAlert(false)
                        
                        if(response.data){
                            ToastSuccess('Administrador registrado correctamente')
                            
                            setTimeout(() => {
                                window.location.href = '/administradores'
                            }, 1500)
                        }
                    } catch (error) {
                        LoadAlert(false)
                        ToastWarning(error.response.data.message)
                    }
                }
            )
        }
    }

    return(
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Registrar administrador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col lg='12' md='12' sm='12' xs='12'>
                        <Alert variant='light'>
                            La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula y un numero
                        </Alert>
                    </Col>
                    <Col className="mb-3" lg='12' md='12' sm='12' xs='12'>
                        <InputComponent
                            label='Nombre de usuario'
                            value={newAdmin.username}
                            onChange={ (e) => setNewAdmin({ ...newAdmin, username: e.target.value }) }
                            error={error.username.error}
                            errorMessage={error.username.message}
                        />
                    </Col>
                    <Col className="mb-3" lg='12' md='12' sm='12' xs='12'>
                        <InputComponent
                            label='Correo electronico'
                            value={newAdmin.email}
                            onChange={ (e) => setNewAdmin({ ...newAdmin, email: e.target.value }) }
                            error={error.email.error}
                            errorMessage={error.email.message}
                        />
                    </Col>
                    <Col className="mb-3" lg='12' md='12' sm='12' xs='12'>
                        <InputComponent
                            label='Contraseña'
                            value={newAdmin.password}
                            type='password'
                            onChange={ (e) => setNewAdmin({ ...newAdmin, password: e.target.value }) }
                            error={error.password.error}
                            errorMessage={error.password.message}
                        />
                    </Col>
                    <Col className="mb-5" lg='12' md='12' sm='12' xs='12'>
                        <InputComponent
                            label='Confirmar contraseña'
                            value={newAdmin.password_confirmation}
                            type='password'
                            onChange={ (e) => setNewAdmin({ ...newAdmin, password_confirmation: e.target.value }) }
                            error={error.password_confirmation.error}
                            errorMessage={error.password_confirmation.message}
                        />
                    </Col>
                    <Col className="mb-3 text-end" lg='12' md='12' sm='12' xs='12'>
                        <ButtonComponent
                            action={validate}
                        >
                            Registrar administrador
                        </ButtonComponent>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )

}