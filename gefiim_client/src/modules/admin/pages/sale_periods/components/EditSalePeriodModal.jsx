import { useEffect, useState } from "react";
import { Alert, Col, Modal, Row } from "react-bootstrap"
import { SelectComponent } from "../../../../../components/SelectComponent";
import { ButtonComponent, InputComponent } from "../../../../../components";
import { LoadAlert, SweetAlert, ToastSuccess, ToastWarning } from "../../../../../components/SweetAlertToast";

import axios from '../../../../../config/http-clientt.gateway'
import { formatDate } from "../../../../../utils/functions/formatDate";

export const EditSalePeriodModal = ({ show, handleClose, salePeriod }) => {
    const errorObject = {
        status:{
            error: false,
            message: ''
        },
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
        status: '',
        start_date: '11/11/1111',
        end_date: '11/11/1111',
        bank_account: '',
        bank_name: '',
        bank_clabe: '',
        concept: '',
        amount: '',
        speciality_by_period:[]
    });

    const getSpecialities = async () => {
        try {
            const response = await axios.doPost('/sale-period/get-specialities-by-sale-period', {id_period: salePeriod.id_period});
            const salePeriodInfo = { ...salePeriod, speciality_by_period: response.data };
            setSalePeriodCopy(salePeriodInfo);
        } catch (error) {
            ToastWarning(error.response.data.message);
        }
    }


    const validateStatus = () => {
        let check = false
        const errorObjectCopy = {...error}

        if(salePeriodCopy.status === ''){
            errorObjectCopy.status.error = true;
            errorObjectCopy.status.message = 'El estado es requerido';
            check = true;
        }else{
            if(salePeriod.status === 'active'){
                if(salePeriodCopy.status !== 'finalized' && salePeriodCopy.status !== 'active'){
                    errorObjectCopy.status.error = true;
                    errorObjectCopy.status.message = 'Un periodo activo solo puede ser finalizado';
                    check = true;
                }
            }

            if(salePeriod.status === 'pending'){
                if(salePeriodCopy.status !== 'canceled' && salePeriodCopy.status !== 'pending'){
                    errorObjectCopy.status.error = true;
                    errorObjectCopy.status.message = 'Un periodo pendiente solo puede ser cancelado';
                    check = true;
                }
            }

            if(salePeriod.status === 'canceled'){
                if(salePeriodCopy.status !== 'canceled'){
                    errorObjectCopy.status.error = true;
                    errorObjectCopy.status.message = 'Un periodo cancelado no puede ser modificado';
                    check = true;
                }
            }

            if(salePeriod.status === 'finalized'){
                if(salePeriodCopy.status !== 'finalized'){
                    errorObjectCopy.status.error = true;
                    errorObjectCopy.status.message = 'Un periodo finalizado no puede ser modificado';
                    check = true;
                }
            }
        }

        setError(errorObjectCopy);
        if(!check){
            SweetAlert(
                "question",
                "¿Estás seguro de cambiar el estado del periodo?",
                "La acción no se puede deshacer",
                "Aceptar",
                async () => {
                    try {
                        LoadAlert(true);
                        const response = await axios.doPost('/sale-period/change-status-sale-period', {id_period: salePeriod.id_period, status: salePeriodCopy.status});
                        LoadAlert(false);
        
                        if(response.data){
                            ToastSuccess('Estado actualizado correctamente');
        
                            setTimeout(() => {
                                window.location.reload()
                            }, 1500)
                        }
        
                    } catch (error) {
                        LoadAlert(false);
                        ToastWarning(error.response.data.message);
                    }
            });
        }
    }

    const validateDates = () => {
        let check = false
        const errorObjectCopy = {...error}

        // validar fechas
        if(salePeriodCopy.start_date === ''){
            errorObjectCopy.start_date.error = true;
            errorObjectCopy.start_date.message = 'La fecha de inicio es requerida';
            check = true;
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
                "question",
                "¿Estás seguro?",
                "La información se actualizará",
                "Aceptar",
                async () => {
                    try {
                        const payload = { ...salePeriodCopy}

                        if(payload.start_date.includes('T')){
                            payload.start_date = payload.start_date.split('T')[0]
                        }

                        if(payload.end_date.includes('T')){
                            payload.end_date = payload.end_date.split('T')[0]
                        }

                        LoadAlert(true);
                        const response = await axios.doPost('/sale-period/update-sale-period', payload);
                        LoadAlert(false);
        
                        if(response.data){
                            ToastSuccess('Periodo actualizado correctamente');
        
                            setTimeout(() => {
                                window.location.reload()
                            }, 1500)
                        }
        
                    } catch (error) {
                        LoadAlert(false);
                        ToastWarning(error.response.data.message);
                    }
            });
        }
    }

    const validateSpecialities = () => {
        // transformar a numero
        for (let i = 0; i < salePeriodCopy.speciality_by_period.length; i++) {
            // validar que sea entero
            if(isNaN(salePeriodCopy.speciality_by_period[i].tokens_allowed)){
                ToastWarning('Los tokens permitidos deben ser números enteros');
                return;
            }

            if(!Number.isInteger(parseInt(salePeriodCopy.speciality_by_period[i].tokens_allowed))){
                ToastWarning('Los tokens permitidos deben ser números enteros');
                return;
            }

            salePeriodCopy.speciality_by_period[i].tokens_allowed = parseInt(salePeriodCopy.speciality_by_period[i].tokens_allowed);
        }

        const payload = {
            id_period: salePeriod.id_period,
            speciality_by_period: salePeriodCopy.speciality_by_period
        }

        SweetAlert(
            "question",
            "¿Estás seguro?",
            "La información se actualizará",
            "Aceptar",
            async () => {
                try {
                    LoadAlert(true);
                    const response = await axios.doPost('/sale-period/update-tokens-allowed', payload);
                    LoadAlert(false);
    
                    if(response.data){
                        ToastSuccess('Especialidades actualizadas correctamente');
    
                        setTimeout(() => {
                            window.location.reload()
                        }, 1500)
                    }
    
                } catch (error) {
                    LoadAlert(false);
                    ToastWarning(error.response.data.message);
                }
            });

        
    }



    useEffect(() => {
        if(salePeriod != null ){
            if(salePeriod.status === 'finalized' || salePeriod.status === 'canceled'){
                handleClose();
                ToastWarning('No se puede editar un periodo finalizado o cancelado');
            }else{
                getSpecialities();
            }
        }
    }, [show]);

    return(
        <Modal show={show} onHide={handleClose} centered size='xl'>
            <Modal.Header closeButton>
                <Modal.Title>Editar periodo de venta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col lg='6' md='6' sm='12' xs='12'>
                    {/* ESTADO DEL PERIODO */}
                        <Row>
                            <h5>Estado del periodo</h5>
                            <Col lg='6' md='6' sm='6' xs='6'>
                                <SelectComponent
                                    label=""
                                    value={salePeriodCopy.status}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, status: e.target.value})}
                                    options={
                                            salePeriod === null || salePeriod === undefined ?
                                            []
                                            :
                                            salePeriod.status === 'active' ?
                                            [
                                                { value: 'finalized', label: 'Finalizado' },
                                                { value: 'active', label: 'Activo' }
                                            ]
                                            :
                                            salePeriod.status === 'pending' ?
                                            [
                                                { value: 'canceled', label: 'Cancelado' },
                                                { value: 'pending', label: 'Pendiente' }
                                            ]
                                            :
                                            salePeriod.status === 'canceled' ?
                                            [
                                                { value: 'canceled', label: 'Cancelado' }
                                            ]
                                            :
                                            salePeriod.status === 'finalized' &&
                                            [
                                                { value: 'finalized', label: 'Finalizado' }
                                            ]
                                            
                                        }
                                    error={error.status.error}
                                    errorMessage={error.status.message}
                                    />
                            </Col>
                            <Col className="mt-auto text-end" lg='6' md='6' sm='6' xs='6'>
                                <ButtonComponent
                                    pl={10}
                                    pr={10}
                                    textSize={15}
                                    action={ validateStatus }
                                >
                                    Actualizar estado
                                </ButtonComponent>
                            </Col>
                            <Col lg='12' md='12' sm='12' xs='12'>
                                <hr /> 
                            </Col>
                        </Row>
                    {/* iNFORMACION */}
                        <Row>
                            <h5 className="mb-4">Información del periodo</h5>
                            <Col className="mb-3" lg='6' md='6' sm='6' xs='6'>
                                <InputComponent
                                    label="Fecha de inicio"
                                    value={new Date(salePeriodCopy.start_date).toISOString().split('T')[0]}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, start_date: e.target.value})}
                                    type="date"
                                    error={error.start_date.error}
                                    errorMessage={error.start_date.message}
                                />
                            </Col>
                            <Col className="mb-3" lg='6' md='6' sm='6' xs='6'>
                                <InputComponent
                                    label="Fecha de fin"
                                    value={new Date(salePeriodCopy.end_date).toISOString().split('T')[0]}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, end_date: e.target.value})}
                                    type="date"
                                    error={error.end_date.error}
                                    errorMessage={error.end_date.message}
                                />
                            </Col>
                            <Col className="mb-3" lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label="Cuenta bancaria"
                                    value={salePeriodCopy.bank_account}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, bank_account: e.target.value})}
                                    error={error.bank_account.error}
                                    errorMessage={error.bank_account.message}
                                />
                            </Col>
                            <Col className="mb-3" lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label="Nombre del banco"
                                    value={salePeriodCopy.bank_name}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, bank_name: e.target.value})}
                                    error={error.bank_name.error}
                                    errorMessage={error.bank_name.message}
                                />
                            </Col>
                            <Col className="mb-3" lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label="CLABE"
                                    value={salePeriodCopy.bank_clabe}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, bank_clabe: e.target.value})}
                                    error={error.bank_clabe.error}
                                    errorMessage={error.bank_clabe.message}
                                />
                            </Col>
                            <Col className="mb-3" lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label="Concepto"
                                    value={salePeriodCopy.concept}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, concept: e.target.value})}
                                    error={error.concept.error}
                                    errorMessage={error.concept.message}
                                />
                            </Col>
                            <Col className="mb-3" lg='12' md='12' sm='12' xs='12'>
                                <InputComponent
                                    label="Monto"
                                    value={salePeriodCopy.amount}
                                    onChange={(e) => setSalePeriodCopy({...salePeriodCopy, amount: e.target.value})}
                                    error={error.amount.error}
                                    errorMessage={error.amount.message}
                                />
                            </Col>
                            <Col className="text-end" lg='12' md='12' sm='12' xs='12'>
                                <ButtonComponent
                                    pl={10}
                                    pr={10}
                                    textSize={15}
                                    action={ validateDates }
                                >
                                    Actualizar periodo
                                </ButtonComponent>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg='6' md='6' sm='12' xs='12'>
                        <Row
                            style={{
                                maxHeight: '80vh',
                                overflowY: 'auto'
                            }}
                        >
                            {/* ESPECIALIDADES */}
                            <h5>Fichas autorizadas por especialidad</h5>
                            <Col lg='12' md='12' sm='12' xs='12'>
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
                            <Col className="text-end" lg='12' md='12' sm='12' xs='12'>
                                <ButtonComponent
                                    pl={10}
                                    pr={10}
                                    textSize={15}
                                    action={ validateSpecialities }
                                >
                                    Actualizar especialidades
                                </ButtonComponent>
                            </Col>
                        </Row>
                        
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}