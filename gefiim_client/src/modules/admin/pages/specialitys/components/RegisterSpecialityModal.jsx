import { Alert, Col, Modal, Row } from "react-bootstrap"
import { ButtonComponent, InputComponent } from "../../../../../components";
import { useState } from "react";
import { LoadAlert, SweetAlert, ToastSuccess, ToastWarning } from "../../../../../components/SweetAlertToast";

import axios from '../../../../../config/http-clientt.gateway'


export const RegisterSpecialityModal = ({ show, handleClose, speciality}) => {

    const errorObject = {
        name: {
            error: false,
            message: ''
        },
        acronym: {
            error: false,
            message: ''
        }
    }

    const [newSpeciality, setNewSpeciality] = useState({
        name: '',
        acronym: ''
    });
    const [error, setError] = useState(errorObject);

    const validate = () => {
        let check = false;
        const errorObjectCopy = { ...errorObject };

        if (newSpeciality.name === '') {
            errorObjectCopy.name.error = true;
            errorObjectCopy.name.message = 'El nombre de la especialidad es requerido';
            check = true;
        }else{
            if(/(<script)\b/g.test(newSpeciality.name)){
                errorObjectCopy.name.error = true;
                errorObjectCopy.name.message = 'No se permiten scripts';
                check = true;
            }
        }

        if (newSpeciality.acronym === '') {
            errorObjectCopy.acronym.error = true;
            errorObjectCopy.acronym.message = 'El acronimo de la especialidad es requerido';
            check = true;
        }else{
            if(/(<script)\b/g.test(newSpeciality.acronym)){
                errorObjectCopy.acronym.error = true;
                errorObjectCopy.acronym.message = 'No se permiten scripts';
                check = true;
            }
        }

        setError(errorObjectCopy);

        if (!check){
            SweetAlert(
                'question',
                '¿Estás seguro?',
                '¿Deseas registrar la especialidad?',
                'Aceptar',
                async () => {
                    try {
                        LoadAlert(true);
                        const response = await axios.doPost('/speciality/register-speciality', newSpeciality);
                        LoadAlert(false);

                        if( response.data ){
                            ToastSuccess('Especialidades actualizadas correctamente');
    
                            setTimeout(() => {
                                window.location.reload()
                            }, 1500)
                        }
                    } catch (error) {
                        LoadAlert(false);
                        ToastWarning(error.response.data.message);
                    }
                }
            );
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Registrar especialidad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col className="mb-3" lg={12} md={12} sm={12} xs={12}>
                        <InputComponent
                            label="Nombre"
                            value={newSpeciality.name}
                            onChange={(e) => setNewSpeciality({ ...newSpeciality, name: e.target.value })}
                            error={error.name.error}
                            message={error.name.message}
                        />
                    </Col>
                    <Col className="mb-5" lg={12} md={12} sm={12} xs={12}>
                        <InputComponent
                            label="Acronimo"
                            value={newSpeciality.acronym}
                            onChange={(e) => setNewSpeciality({ ...newSpeciality, acronym: e.target.value })}
                            error={error.acronym.error}
                            message={error.acronym.message}
                        />
                    </Col>
                    <Col className="text-end mb-2" lg={12} md={12} sm={12} xs={12}>
                        <ButtonComponent
                            action={validate}
                        >
                            Registrar especialidad
                        </ButtonComponent>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}