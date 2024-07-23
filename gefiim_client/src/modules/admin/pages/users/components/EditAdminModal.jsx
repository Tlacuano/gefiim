import { useEffect, useState } from "react";
import { Alert, Col, Modal, Row } from "react-bootstrap";
import { ButtonComponent, InputComponent } from "../../../../../components";
import { SelectComponent } from "../../../../../components/SelectComponent";
import { LoadAlert, SweetAlert, ToastSuccess, ToastWarning } from "../../../../../components/SweetAlertToast";

import axios from '../../../../../config/http-clientt.gateway'


export const EditAdminModal = ({ show, handleClose, admin }) => {
    const errorObject = {
        username: {
            error: false,
            message: ''
        },
        email: {
            error: false,
            message: ''
        },
        status: {
            error: false,
            message: ''
        },
        password: {
            error: false,
            message: ''
        },
        password2: {
            error: false,
            message: ''
        },
        new_password: {
            error: false,
            message: ''
        },
        password_confirmation: {
            error: false,
            message: ''
        }
    }
    const [error, setError] = useState(errorObject);
    const [newAdmin, setNewAdmin] = useState({
        username: '',
        email: '',
        status: false,
        password: '',
        password2: '',
        new_password: '',
        password_confirmation: ''
    });

    const validateToChangeStatus = () => {
        let check = false;
        const errorObjectCopy = { ...errorObject };

        if (newAdmin.status === '') {
            errorObjectCopy.status.error = true;
            errorObjectCopy.status.message = 'El estado del usuario es requerido';
            check = true;
        }

        setError(errorObjectCopy);
        if(!check){
            SweetAlert(
                'question',
                '¿Estas seguro?',
                'El estado influye en el acceso del usuario al sistema',
                'Si, cambiar',
                async () => {
                    try {
                        LoadAlert(true);
                        const response = await axios.doPost('/user/change-status-user', newAdmin);
                        LoadAlert(false);

                        if(response.data){
                            ToastSuccess('Estado del usuario actualizado correctamente');

                            setTimeout(() => {
                                window.location.href = '/administradores'
                            }, 1500)
                        }
                    } catch (error) {
                        LoadAlert(false);
                        ToastWarning(error.response.data.message)
                    }
                }
            )
        }
    }

    const validateToChangeInformation = () => {
        let check = false;
        const errorObjectCopy = { ...errorObject };

        if (newAdmin.username === '') {
            errorObjectCopy.username.error = true;
            errorObjectCopy.username.message = 'El nombre de usuario es requerido';
            check = true;
        }else{
            if(/(<script)\b/g.test(newAdmin.username)){
                errorObjectCopy.username.error = true;
                errorObjectCopy.username.message = 'Caracteres no permitidos';
                check = true;
            }
        
            if(newAdmin.username.length < 5){
                errorObjectCopy.username.error = true;
                errorObjectCopy.username.message = 'El nombre de usuario debe tener al menos 5 caracteres';
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
            errorObjectCopy.password.message = 'La contraseña actual es requerida';
            check = true;
        }

        setError(errorObjectCopy);
        if(!check){
            SweetAlert(
                'question',
                '¿Estas seguro?',
                '¿Deseas cambiar la información del usuario?',
                'Si, cambiar',
                async () => {
                    try {
                        LoadAlert(true);
                        const response = await axios.doPost('/user/update-user', newAdmin);
                        LoadAlert(false);

                        if(response.data){
                            ToastSuccess('Información del usuario actualizada correctamente');

                            setTimeout(() => {
                                window.location.href = '/administradores'
                            }, 1500)
                        }
                    } catch (error) {
                        LoadAlert(false);
                        ToastWarning(error.response.data.message)
                    }
                }
            )
        }

    }

    const validateToChangePassword = () => {
        let check = false;
        const errorObjectCopy = { ...errorObject };

        if (newAdmin.new_password === '') {
            errorObjectCopy.new_password.error = true;
            errorObjectCopy.new_password.message = 'La nueva contraseña es requerida';
            check = true;
        }else{
            if(!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(newAdmin.new_password)){
                errorObjectCopy.new_password.error = true;
                errorObjectCopy.new_password.message = 'La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula y un numero';
                check = true;
            }
        }

        if (newAdmin.password_confirmation === '') {
            errorObjectCopy.password_confirmation.error = true;
            errorObjectCopy.password_confirmation.message = 'Confirmar contraseña es requerido';
            check = true;
        }else {
            if(newAdmin.new_password !== newAdmin.password_confirmation){
                errorObjectCopy.password_confirmation.error = true;
                errorObjectCopy.password_confirmation.message = 'Las contraseñas no coinciden';
                check = true;
            }
        }

        if (newAdmin.password2 === '') {
            errorObjectCopy.password2.error = true;
            errorObjectCopy.password2.message = 'La contraseña actual es requerida';
            check = true;
        }

        setError(errorObjectCopy);
        if(!check){
            SweetAlert(
                'question',
                '¿Estas seguro?',   
                '¿Deseas cambiar la contraseña del usuario?',
                'Si, cambiar',
                async () => {
                    try {
                        const payload = {
                            password: newAdmin.password2,
                            new_password: newAdmin.new_password,
                            id_admin: newAdmin.id_admin
                        }

                        LoadAlert(true);
                        const response = await axios.doPost('/user/change-password', payload);
                        LoadAlert(false);

                        if(response.data){
                            ToastSuccess('Contraseña del usuario actualizada correctamente');

                            setTimeout(() => {
                                window.location.href = '/administradores'
                            }, 1500)
                        }
                    } catch (error) {
                        LoadAlert(false);
                        ToastWarning(error.response.data.message)
                    }
                }
            )
        }
    }


    useEffect(() => {
        if(admin){
            const copy = { ...admin };
            copy.password2 = '';
            copy.new_password = '';
            copy.password_confirmation = '';

            setNewAdmin(copy);
        }
    }, [admin])

    return(
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Editar Administrador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Alert variant="light">
                        Para realizar algunos cambios, es necesario que ingreses tu contraseña actual
                    </Alert>

                    <Col lg='6' md='6' sm='12' xs='12'>
                        <Row>
                            <h5>Estato del usuario</h5>
                            <Col lg='8' md='8' sm='8' xs='8'>
                                <SelectComponent
                                    label='Estado actual del usuario'
                                    value={newAdmin.status}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, status: e.target.value })}
                                    error={error.status.error}
                                    errorMessage={error.status.message}
                                    options={[
                                        { value: 1, label: 'Activo' },
                                        { value: 0, label: 'Inactivo' }
                                    ]}
                                />
                            </Col>
                            <Col className="mt-auto" lg='auto' md='auto' sm='auto' xs='auto'>
                                <ButtonComponent
                                    action={ validateToChangeStatus }
                                >
                                    Actualizar
                                </ButtonComponent>
                            </Col>

                            <h5 className="mt-5">Información del usuario</h5>
                            <Col className="mb-3" lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label='Nombre de usuario'
                                    value={newAdmin.username}
                                    onChange={ (e) => setNewAdmin({ ...newAdmin, username: e.target.value }) }
                                    error={error.username.error}
                                    errorMessage={error.username.message}
                                />
                            </Col>
                            <Col className="mb-4" lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label='Correo electronico'
                                    value={newAdmin.email}
                                    onChange={ (e) => setNewAdmin({ ...newAdmin, email: e.target.value }) }
                                    error={error.email.error}
                                    errorMessage={error.email.message}
                                />
                            </Col>
                            <Col className="mb-4" lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label='Contraseña actual'
                                    value={newAdmin.password}
                                    type='password'
                                    onChange={ (e) => setNewAdmin({ ...newAdmin, password: e.target.value }) }
                                    error={error.password.error}
                                    errorMessage={error.password.message}
                                />
                            </Col>
                            <Col className="mb-3 text-end" lg='12' md='12' sm='12' xs='12'>
                                <ButtonComponent
                                    action={ validateToChangeInformation }
                                >
                                    Actualizar
                                </ButtonComponent>
                            </Col>

                        </Row>
                    </Col>
                    <Col lg='6' md='6' sm='12' xs='12'>
                        <Row>
                            <h5>Contraseña</h5>
                            <Col className="mb-3" lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label='Nueva contraseña'
                                    value={newAdmin.new_password}
                                    type='password'
                                    onChange={ (e) => setNewAdmin({ ...newAdmin, new_password: e.target.value }) }
                                    error={error.new_password.error}
                                    message={error.new_password.message}
                                />
                            </Col>
                            <Col className="mb-3" lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label='Confirmar contraseña'
                                    value={newAdmin.password_confirmation}
                                    type='password'
                                    onChange={ (e) => setNewAdmin({ ...newAdmin, password_confirmation: e.target.value }) }
                                    error={error.password_confirmation.error}
                                    message={error.password_confirmation.message}
                                />
                            </Col>
                            <Col className="mb-3" lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label='Contraseña actual'
                                    value={newAdmin.password2}
                                    type='password'
                                    onChange={ (e) => setNewAdmin({ ...newAdmin, password2: e.target.value }) }
                                    error={error.password2.error}
                                    message={error.password2.message}
                                />
                            </Col>

                            <Col className="mb-3 text-end" lg='12' md='12' sm='12' xs='12'>
                                <ButtonComponent
                                    action={ validateToChangePassword }
                                >
                                    Actualizar
                                </ButtonComponent>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}