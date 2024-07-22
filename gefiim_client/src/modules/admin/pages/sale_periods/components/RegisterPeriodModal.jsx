import { useEffect, useState } from "react";
import { Alert, Col, Modal, Row } from "react-bootstrap"
import { ButtonComponent, InputComponent } from "../../../../../components";
import { LoadAlert, SweetAlert, ToastSuccess, ToastWarning } from "../../../../../components/SweetAlertToast";

import axios from '../../../../../config/http-clientt.gateway'

export const RegisterPeriodModal = ({ show, handleClose }) => {
    const errorObject = {
        start_date:{
            error: false,
            message: ''
        },
        end_date:{
            error: false,
            message: ''
        },
        bank_account:{
            error: false,
            message: ''
        },
        bank_name:{
            error: false,
            message: ''
        },
        bank_clabe:{
            error: false,
            message: ''
        },
        concept:{
            error: false,
            message: ''
        },
        amount:{
            error: false,
            message: ''
        }
    }
    const [error, setError] = useState(errorObject);
    const [salePeriodCopy, setSalePeriodCopy] = useState({
        start_date: '11/11/1111',
        end_date: '11/11/1111',
        bank_account: '',
        bank_name: '',
        bank_clabe: '',
        concept: '',
        amount: '',
        speciality_by_period:[]
    });

    const validate = () => {
        let check = false;
        let errorObjectCopy = {...errorObject};

         // validar fechas
        if(salePeriodCopy.start_date === ''){
            errorObjectCopy.start_date.error = true;
            errorObjectCopy.start_date.message = 'La fecha de inicio es requerida';
            check = true;
        }else{
            if(new Date(salePeriodCopy.start_date) < new Date()){
                errorObjectCopy.start_date.error = true;
                errorObjectCopy.start_date.message = 'La fecha de inicio no puede ser menor a la fecha actual';
                check = true;
            }
        }

        if(salePeriodCopy.end_date === ''){
            errorObjectCopy.end_date.error = true;
            errorObjectCopy.end_date.message = 'La fecha de fin es requerida';
            check = true;
        }else{
            if(new Date(salePeriodCopy.end_date) < new Date(salePeriodCopy.start_date)){
                errorObjectCopy.end_date.error = true;
                errorObjectCopy.end_date.message = 'La fecha de fin no puede ser menor a la fecha de inicio';
                check = true;
            }
        }
        
        // validar cuenta bancaria
        if(salePeriodCopy.bank_account === ''){
            errorObjectCopy.bank_account.error = true;
            errorObjectCopy.bank_account.message = 'La cuenta bancaria es requerida';
            check = true;
        }else{
            // validar que sea numero
            if(isNaN(salePeriodCopy.bank_account)){
                errorObjectCopy.bank_account.error = true;
                errorObjectCopy.bank_account.message = 'La cuenta bancaria debe ser un número';
                check = true;
            }
        }

        // validar nombre del banco
        if(salePeriodCopy.bank_name === ''){
            errorObjectCopy.bank_name.error = true;
            errorObjectCopy.bank_name.message = 'El nombre del banco es requerido';
            check = true;
        }else{
            if(/(<script)\b/g.test(salePeriodCopy.bank_name)){
                errorObjectCopy.bank_name.error = true;
                errorObjectCopy.bank_name.message = 'Caracteres no permitidos';
                check = true;
            }
        }

        // validar clabe
        if(salePeriodCopy.bank_clabe === ''){
            errorObjectCopy.bank_clabe.error = true;
            errorObjectCopy.bank_clabe.message = 'La CLABE es requerida';
            check = true;
        }else{
            // validar que sea numero
            if(isNaN(salePeriodCopy.bank_clabe)){
                errorObjectCopy.bank_clabe.error = true;
                errorObjectCopy.bank_clabe.message = 'La CLABE debe ser un número';
                check = true;
            }
        }

        // validar concepto
        if(salePeriodCopy.concept === ''){
            errorObjectCopy.concept.error = true;
            errorObjectCopy.concept.message = 'El concepto es requerido';
            check = true;
        }else{
            if(/(<script)\b/g.test(salePeriodCopy.concept)){
                errorObjectCopy.concept.error = true;
                errorObjectCopy.concept.message = 'Caracteres no permitidos';
                check = true;
            }
        }

        // validar monto
        if(salePeriodCopy.amount === ''){
            errorObjectCopy.amount.error = true;
            errorObjectCopy.amount.message = 'El monto es requerido';
            check = true;
        }else{
            // validar que sea numero
            if(isNaN(salePeriodCopy.amount)){
                errorObjectCopy.amount.error = true;
                errorObjectCopy.amount.message = 'El monto debe ser un número';
                check = true;
            }

            if(salePeriodCopy.amount <= 0){
                errorObjectCopy.amount.error = true;
                errorObjectCopy.amount.message = 'El monto no puede ser menor o igual a 0';
                check = true;
            }
        }

        setError(errorObjectCopy);

        if(!check){
            SweetAlert(
                'question',
                '¿Estás seguro?',
                '¿Deseas registrar este periodo de venta?',
                'Aceptar',
                async () => {
                    try {
                        const payload = { ...salePeriodCopy }

                        if(payload.start_date.includes('T')){
                            payload.start_date = payload.start_date.split('T')[0]
                        }

                        if(payload.end_date.includes('T')){
                            payload.end_date = payload.end_date.split('T')[0]
                        }

                        //parsear a entero los tokens permitidos
                        payload.speciality_by_period = payload.speciality_by_period.map((speciality) => {
                            
                            return {
                                id_speciality: speciality.id_speciality,
                                tokens_allowed: parseInt(speciality.tokens_allowed)
                            }
                        })

                        LoadAlert(true)
                        const response = await axios.doPost('/sale-period/register-sale-period', payload)
                        LoadAlert(false)

                        if(response.data){
                            ToastSuccess('Cambios guardados', 'Los cambios se han guardado correctamente')
                            
                            // esperar 1.5 segundos para cerrar el modal
                            setTimeout(() => {
                                window.location.reload()
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

    const getSpecialities = async () => {
        try {
            LoadAlert(true)
            const response = await axios.doGet('/speciality/get-all-specialities')
            LoadAlert(false)

            if(response.data){
                const speciality_by_period = response.data.specialitiesActive.map((speciality) => {
                    return {
                        id_speciality: speciality.id_speciality,
                        tokens_allowed: 0,
                        name: speciality.name
                    }
                })

                setSalePeriodCopy({...salePeriodCopy, speciality_by_period})
            }
        } catch (error) {
            LoadAlert(false)
            ToastWarning(error.response.data.message)
        }
    }

    useEffect(() => {
        getSpecialities()
    }, [show])

    return(
        <Modal show={show} onHide={handleClose} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Registrar periodo de venta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col lg='6' md='6' sm='12' xs='12'>
                        <Row>
                            <Col className="mb-3" lg='6' md='6' sm='6' xs='6'>
                                <InputComponent
                                    label="Fecha de inicio"
                                    value={salePeriodCopy.start_date}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, start_date: e.target.value})}
                                    error={error.start_date.error}
                                    errorMessage={error.start_date.message}
                                    type={'date'}
                                />
                            </Col>
                            <Col className="mb-3"  lg='6' md='6' sm='6' xs='6'>
                                <InputComponent
                                    label="Fecha de fin"
                                    value={salePeriodCopy.end_date}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, end_date: e.target.value})}
                                    error={error.end_date.error}
                                    errorMessage={error.end_date.message}
                                    type={'date'}
                                />
                            </Col>
                            <Col className="mb-1" lg='12' md='12' sm='12' xs='12'>
                                <hr/>
                            </Col>
                            {/* Datos bancarios */}
                            <h5 className="mb-3">Datos bancarios</h5>
                            <Col className="mb-3"  lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label="Cuenta bancaria"
                                    value={salePeriodCopy.bank_account}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, bank_account: e.target.value})}
                                    error={error.bank_account.error}
                                    errorMessage={error.bank_account.message}
                                />
                            </Col>
                            <Col className="mb-3"  lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label="Nombre del banco"
                                    value={salePeriodCopy.bank_name}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, bank_name: e.target.value})}
                                    error={error.bank_name.error}
                                    errorMessage={error.bank_name.message}
                                />
                            </Col>
                            <Col className="mb-3"  lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label="Cuenta CLABE"
                                    value={salePeriodCopy.bank_clabe}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, bank_clabe: e.target.value})}
                                    error={error.bank_clabe.error}
                                    errorMessage={error.bank_clabe.message}
                                />
                            </Col>
                            <Col className="mb-3"  lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label="Concepto"
                                    value={salePeriodCopy.concept}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, concept: e.target.value})}
                                    error={error.concept.error}
                                    errorMessage={error.concept.message}
                                />
                            </Col>
                            <Col className="mb-3"  lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label="Monto"
                                    value={salePeriodCopy.amount}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, amount: e.target.value})}
                                    error={error.amount.error}
                                    errorMessage={error.amount.message}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col  lg='6' md='6' sm='12' xs='12'>
                        <Row
                            style={{
                                maxHeight: '70vh',
                                overflowY: 'auto'
                            }}
                        >
                            <Col className="mb-3" lg='12' md='12' sm='12' xs='12'>
                                <h5>Fichas autorizadas por especialidad</h5>
                                <Alert variant="warning">
                                    Las especialidades activas se consideran para el registro de fichas autorizadas
                                </Alert>
                            </Col>
                            {
                                salePeriodCopy.speciality_by_period.map((speciality, index) => (
                                    <Col className="mb-3" key={index} lg='12' md='12' sm='12' xs='12'>
                                        <InputComponent
                                            label={speciality.name}
                                            value={speciality.tokens_allowed}
                                            onChange={(e) => {
                                                const speciality_by_period = [...salePeriodCopy.speciality_by_period]
                                                speciality_by_period[index].tokens_allowed = e.target.value
                                                setSalePeriodCopy({...salePeriodCopy, speciality_by_period})
                                            }}
                                            type={'number'}
                                        />
                                    </Col>
                                ))
                            }
                        </Row>
                    </Col>
                    <Col className="mb-2 mt-2 text-end" lg='12' md='12' sm='12' xs='12'>
                        <ButtonComponent
                            action={validate}
                        >
                            Registrar periodo
                        </ButtonComponent>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}