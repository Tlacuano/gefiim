import { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap"
import { SelectComponent } from "../../../../../components/SelectComponent";
import { ButtonComponent, InputComponent } from "../../../../../components";
import { LoadAlert, SweetAlert, ToastSuccess, ToastWarning } from "../../../../../components/SweetAlertToast";

import axios from '../../../../../config/http-clientt.gateway'

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
        amount: ''
    });

    const validate = async () => {
        let check = false;
        let errorObjectCopy = {...errorObject};

        // validar status
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
                "¿Deseas guardar los cambios?",
                "Aceptar",
                async () => {
                    try {
                        const payload = { ...salePeriodCopy }

                        const start_date = new Date(payload.start_date)
                        const end_date = new Date(payload.end_date)

                        payload.start_date = `${start_date.getFullYear()}-${start_date.getMonth() + 1}-${start_date.getDate()}`
                        payload.end_date = `${end_date.getFullYear()}-${end_date.getMonth() + 1}-${end_date.getDate()}`


                        LoadAlert(true)
                        const response = await axios.doPost('/sale-period/update-sale-period', payload)
                        LoadAlert(false)

                        if(response.data){
                            ToastSuccess('Cambios guardados', 'Los cambios se han guardado correctamente')
                            
                            // esperar 1.5 segundos para cerrar el modal
                            setTimeout(() => {
                                window.location.reload()
                            }, 1500)
                        }
                        
                    } catch (error) {
                        console.log(error)
                        LoadAlert(false)
                        ToastWarning(error.response.data.message)
                    }
                }
            )
        }
    }

    useEffect(() => {
        if(salePeriod){
            setSalePeriodCopy(salePeriod);
        }
    }, [show]);

    return(
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar periodo de venta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    {/* Estado y fechas */}
                    <h5>Estado y fechas</h5>
                    <Col className="mb-3 mt-2" lg='12' md='12' sm='12' xs='12'>
                        <SelectComponent
                            label="Estado"
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
                        <hr/>
                    </Col>
                    {/* Datos bancarios */}
                    <h5>Datos bancarios</h5>
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
                    <Col className="mb-2 mt-2 text-end" lg='12' md='12' sm='12' xs='12'>
                        <ButtonComponent
                            action={validate}
                        >
                            Guardar cambios
                        </ButtonComponent>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}