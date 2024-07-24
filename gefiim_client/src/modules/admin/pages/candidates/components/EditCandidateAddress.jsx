import { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "react-bootstrap"
import axios from '../../../../../config/http-clientt.gateway'
import { ToastWarning, LoadAlert, ToastSuccess, SweetAlert } from "../../../../../components/SweetAlertToast";
import { ButtonComponent, InputComponent } from "../../../../../components";
import { SelectComponent } from "../../../../../components/SelectComponent";


export const EditCandidateAddress = ({ address }) => {
    const errorObject ={
        postal_code:{
            error: false,
            message: ''
        },
        id_state:{
            error: false,
            message: ''
        },
        id_municipality:{
            error: false,
            message: ''
        },
        neighborhood:{
            error: false,
            message: ''
        },
        street_and_number:{
            error: false,
            message: ''
        }
    }

    const [errors, setErrors] = useState(errorObject);
    const [addressInfo, setAddressInfo] = useState({
        id_address: 0,
        postal_code: '',
        id_state: 0,
        id_municipality: 0,
        neighborhood: '',
        street_and_number: '',
    });

    const [initialData, setInitialData] = useState({
        states: [],
        municipalities: []
    })

    const getInitialData = async () => {
        try {
            const responseStates = await axios.doGet('/state/get-states')
            const municipalities = await getMunicipalities(address.id_state)

            setInitialData({
                states: responseStates.data,
                municipalities: municipalities
            })
        } catch (error) {
            ToastWarning(error.response.data.message)
        }
    }
    const getMunicipalities = async (id_state = 1) => {
        if (id_state === 0 || id_state === undefined) {
            return []
        }

        const municipalities = await axios.doPost(`/municipality/get-municipalities-by-state-id`, { id_state: id_state })
        return municipalities.data
    }

    const validate = () => {
        let check = false;
        let newError = { ...errorObject };

        // Validar código postal
        if (addressInfo.postal_code === '' || addressInfo.postal_code === null) {
            newError.postal_code = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (!/^\d{5}$/.test(addressInfo.postal_code)) {
                newError.postal_code = { error: true, message: 'Código postal inválido' };
                check = true;
            }
        }

        // Validar estado
        if (addressInfo.id_state === 0) {
            newError.id_state = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        }

        // Validar municipio
        if (addressInfo.id_municipality === 0) {
            newError.id_municipality = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        }

        // Validar colonia
        if (addressInfo.neighborhood === '' || addressInfo.neighborhood === null) {
            newError.neighborhood = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (/(<script)\b/g.test(addressInfo.neighborhood)) {
                newError.neighborhood = { error: true, message: 'Campo inválido' };
                check = true;
            }
        }

        // Validar calle y número
        if (addressInfo.street_and_number === '' || addressInfo.street_and_number === null) {
            newError.street_and_number = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (/(<script)\b/g.test(addressInfo.street_and_number)) {
                newError.street_and_number = { error: true, message: 'Campo inválido' };
                check = true;
            }
        }

        setErrors(newError);

        if (!check) {
            SweetAlert(
                'question',
                '¿Estás seguro?',
                '¿Deseas editar la dirección del candidato?',
                'Aceptar',
                async () => {
                    try {
                        LoadAlert(true);
                        const response = await axios.doPost('/candidates/edit-candidate-address', addressInfo);
                        LoadAlert(false);

                        if (response.data) {
                            ToastSuccess('Dirección del candidato editada correctamente');
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        }
                    } catch (error) {
                        LoadAlert(false);
                        ToastWarning(error.response.data.message);
                    }
                }
            );
        }
    };
    

    useEffect(() => {
        if (address !== undefined && address !== null) {
            setAddressInfo(address)
            getInitialData()
        }
        
    }, [address])

    return (
        <Card>
            <CardBody>
                <h5>Dirección del candidato</h5>
                <Row>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <InputComponent
                            label='Código Postal'
                            value={addressInfo.postal_code}
                            onChange={(e) => setAddressInfo({ ...addressInfo, postal_code: e.target.value })}
                            error={errors.postal_code.error}
                            errorMessage={errors.postal_code.message}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <SelectComponent
                            label='Estado de nacimiento'
                            value={addressInfo.id_state}
                            onChange={async (e) => {
                                if (e.target.value === 0) {
                                    return
                                }
                                const id_state = parseInt(e.target.value)

                                // traer los municipios de la entidad seleccionada usando la funcion getMunicipalities
                                const municipalities = await getMunicipalities(id_state)

                                setInitialData({ ...initialData, municipalities: municipalities })
                                setAddressInfo({ ...addressInfo, id_state: id_state, id_municipality: 0 })
                            }}
                            error={errors.id_state.error}
                            errorMessage={errors.id_state.message}
                            options={initialData.states.map((state) => ({ value: state.id_state, label: state.name }))}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <SelectComponent
                            label='Municipio'
                            value={addressInfo.id_municipality}
                            onChange={(e) => setAddressInfo({ ...addressInfo, id_municipality: e.target.value })}
                            error={errors.id_municipality.error}
                            errorMessage={errors.id_municipality.message}
                            options={initialData.municipalities.map((municipality) => ({ value: municipality.id_municipality, label: municipality.name }))}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <InputComponent
                            label='Colonia'
                            value={addressInfo.neighborhood}
                            onChange={(e) => setAddressInfo({ ...addressInfo, neighborhood: e.target.value })}
                            error={errors.neighborhood.error}
                            errorMessage={errors.neighborhood.message}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <InputComponent
                            label='Calle y número'
                            value={addressInfo.street_and_number}
                            onChange={(e) => setAddressInfo({ ...addressInfo, street_and_number: e.target.value })}
                            error={errors.street_and_number.error}
                            errorMessage={errors.street_and_number.message}
                        />
                    </Col>

                    <Col xl='12' md='12' sm='12' xs='12' className='mt-4 text-end mb-3' >
                        <ButtonComponent
                            action={validate}
                            >
                            Guardar cambios
                        </ButtonComponent>
                    </Col>

                </Row>
            </CardBody>
        </Card>
    )
}