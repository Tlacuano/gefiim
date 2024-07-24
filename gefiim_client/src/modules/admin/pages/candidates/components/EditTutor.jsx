import { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "react-bootstrap"
import { LoadAlert, SweetAlert, ToastSuccess, ToastWarning } from "../../../../../components/SweetAlertToast"
import { ButtonComponent, InputComponent } from "../../../../../components";
import { SelectComponent } from "../../../../../components/SelectComponent";
import axios from '../../../../../config/http-clientt.gateway'


export const EditTutor = ({ tutor }) => {

    const errorObject = {
        name: {
            error: false,
            message: ''
        },
        first_last_name: {
            error: false,
            message: ''
        },
        second_last_name: {
            error: false,
            message: ''
        },
        phone_number: {
            error: false,
            message: ''
        },
        secondary_phone_number: {
            error: false,
            message: ''
        },
        live_separated: {
            error: false,
            message: ''
        },
        postal_code: {
            error: false,
            message: ''
        },
        id_state: {
            error: false,
            message: ''
        },
        id_municipality: {
            error: false,
            message: ''
        },
        neighborhood: {
            error: false,
            message: ''
        },
        street_and_number: {
            error: false,
            message: ''
        }
    }

    const [errors, setErrors] = useState(errorObject);
    const [tutorInfo, setTutorInfo] = useState({
        id_tutor: 0,
        name: '',
        first_last_name: '',
        second_last_name: '',
        phone_number: '',
        secondary_phone_number: '',
        live_separated: false,
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
            const municipalities = await getMunicipalities(tutor.tutor_address.id_state)
            
            setInitialData({
                states: responseStates.data,
                municipalities: municipalities
            })
        } catch (error) {
            ToastWarning(error.response.data.message)
        }
    }

    const getMunicipalities = async (id_state = 0) => {
        if (id_state === 0) {
            return []
        }
        const municipalities = await axios.doPost(`/municipality/get-municipalities-by-state-id`, { id_state: id_state })
        return municipalities.data
    }


    const validate = () => {
        let check = false;
        let newError = { ...errorObject };

        // Validar nombre
        if (tutorInfo.name === '' || tutorInfo.name === null) {
            newError.name = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(tutorInfo.name)) {
                newError.name = { error: true, message: 'Nombre inválido' };
                check = true;
            }
        }

        // Validar primer apellido
        if (tutorInfo.first_last_name === '' || tutorInfo.first_last_name === null) {
            newError.first_last_name = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(tutorInfo.first_last_name)) {
                newError.first_last_name = { error: true, message: 'Apellido inválido' };
                check = true;
            }
        }

        // Validar segundo apellido (opcional)
        if (tutorInfo.second_last_name !== '' && tutorInfo.second_last_name !== null) {
            if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(tutorInfo.second_last_name)) {
                newError.second_last_name = { error: true, message: 'Apellido inválido' };
                check = true;
            }
        }

        // Validar teléfono
        if (tutorInfo.phone_number === '' || tutorInfo.phone_number === null) {
            newError.phone_number = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (!/^\d{10}$/.test(tutorInfo.phone_number)) {
                newError.phone_number = { error: true, message: 'Teléfono inválido' };
                check = true;
            }
        }

        // Validar teléfono secundario (opcional)
        if (tutorInfo.secondary_phone_number !== '' && tutorInfo.secondary_phone_number !== null) {
            if (!/^\d{10}$/.test(tutorInfo.secondary_phone_number)) {
                newError.secondary_phone_number = { error: true, message: 'Teléfono secundario inválido' };
                check = true;
            }
        }

        // Validar dirección si vive separado
        if (tutorInfo.live_separated) {
            if (tutorInfo.postal_code === '' || tutorInfo.postal_code === null) {
                newError.postal_code = { error: true, message: 'Este campo es obligatorio' };
                check = true;
            } else {
                if (!/^\d{5}$/.test(tutorInfo.postal_code)) {
                    newError.postal_code = { error: true, message: 'Código postal inválido' };
                    check = true;
                }
            }

            if (tutorInfo.id_state === 0) {
                newError.id_state = { error: true, message: 'Este campo es obligatorio' };
                check = true;
            }

            if (tutorInfo.id_municipality === 0) {
                newError.id_municipality = { error: true, message: 'Este campo es obligatorio' };
                check = true;
            }

            if (tutorInfo.neighborhood === '' || tutorInfo.neighborhood === null) {
                newError.neighborhood = { error: true, message: 'Este campo es obligatorio' };
                check = true;
            } else {
                if (/(<script)\b/g.test(tutorInfo.neighborhood)) {
                    newError.neighborhood = { error: true, message: 'Campo inválido' };
                    check = true;
                }
            }

            if (tutorInfo.street_and_number === '' || tutorInfo.street_and_number === null) {
                newError.street_and_number = { error: true, message: 'Este campo es obligatorio' };
                check = true;
            } else {
                if (/(<script)\b/g.test(tutorInfo.street_and_number)) {
                    newError.street_and_number = { error: true, message: 'Campo inválido' };
                    check = true;
                }
            }
        }

        setErrors(newError);

        if (!check) {
            SweetAlert(
                'question',
                '¿Estás seguro?',
                '¿Deseas editar la información del tutor?',
                'Aceptar',
                async () => {
                    try {
                        const tutor_address = tutorInfo.live_separated ? {
                            id_address: tutorInfo.id_address,
                            postal_code: tutorInfo.postal_code,
                            id_state: tutorInfo.id_state,
                            id_municipality: tutorInfo.id_municipality,
                            neighborhood: tutorInfo.neighborhood,
                            street_and_number: tutorInfo.street_and_number
                        } : null;

                        const payload = { ...tutorInfo, tutor_address: tutor_address }

                        LoadAlert(true);
                        const response = await axios.doPost('/candidates/edit-tutor', payload);
                        LoadAlert(false);

                        if (response.data) {
                            ToastSuccess('Información del tutor editada correctamente');
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
        if (tutor !== undefined && tutor !== null && tutor.tutor_address !== undefined) {
            setTutorInfo({
                id_tutor: tutor.id_tutor,
                name: tutor.name,
                first_last_name: tutor.first_last_name,
                second_last_name: tutor.second_last_name,
                phone_number: tutor.phone_number,
                secondary_phone_number: tutor.secondary_phone_number,
                live_separated: tutor.live_separated,
                id_address: tutor.tutor_address.id_address ? tutor.tutor_address.id_address : 0,
                postal_code: tutor.tutor_address.postal_code ? tutor.tutor_address.postal_code : '',
                id_state: tutor.tutor_address.id_state ? tutor.tutor_address.id_state : 0,
                id_municipality: tutor.tutor_address.id_municipality ? tutor.tutor_address.id_municipality : 0,
                neighborhood: tutor.tutor_address.neighborhood ? tutor.tutor_address.neighborhood : '',
                street_and_number: tutor.tutor_address.street_and_number ? tutor.tutor_address.street_and_number : '',
            })

            getInitialData()
        }
    }
        , [tutor])

    return (
        <Card>
            <CardBody>
                <h5>Información del tutor</h5>
                <Col>
                </Col>
                
                <Row>
                    <Col xl='4' md='4' sm='12' xs='12' className='mt-4'>
                        <InputComponent
                            label='Nombre'
                            value={tutorInfo.name}
                            onChange={(e) => setTutorInfo({ ...tutorInfo, name: e.target.value })}
                            error={errors.name.error}
                            errorMessage={errors.name.message}
                        />
                    </Col>
                    <Col xl='4' md='4' sm='12' xs='12' className='mt-4'>
                        <InputComponent
                            label='Apellido paterno'
                            value={tutorInfo.first_last_name}
                            onChange={(e) => setTutorInfo({ ...tutorInfo, first_last_name: e.target.value })}
                            error={errors.first_last_name.error}
                            errorMessage={errors.first_last_name.message}
                        />
                    </Col>
                    <Col xl='4' md='4' sm='12' xs='12' className='mt-4'>
                        <InputComponent
                            label='Apellido materno'
                            value={tutorInfo.second_last_name}
                            onChange={(e) => setTutorInfo({ ...tutorInfo, second_last_name: e.target.value })}
                            error={errors.second_last_name.error}
                            errorMessage={errors.second_last_name.message}
                        />
                    </Col>

                    <Col xl='4' md='4' sm='12' xs='12' className='mt-4'>
                        <InputComponent
                            label='Teléfono'
                            value={tutorInfo.phone_number}
                            onChange={(e) => setTutorInfo({ ...tutorInfo, phone_number: e.target.value })}
                            error={errors.phone_number.error}
                            errorMessage={errors.phone_number.message}
                        />
                    </Col>
                    <Col xl='4' md='4' sm='12' xs='12' className='mt-4'>
                        <InputComponent
                            label='Teléfono secundario'
                            value={tutorInfo.secondary_phone_number}
                            onChange={(e) => setTutorInfo({ ...tutorInfo, secondary_phone_number: e.target.value })}
                            error={errors.secondary_phone_number.error}
                            errorMessage={errors.secondary_phone_number.message}
                        />
                    </Col>
                    <Col xl='12' md='12' sm='12' xs='12' className='mt-4' style={{ backgroundColor: '#F7F7F7' }} >
                        <Row className='p-4'>
                            <Col>
                                <h5>El tutor vive separado?</h5>
                            </Col>
                            <Col className='text-end'>
                                <input className='mt-2 custom-checkbox' style={{ width: '20px', height: '20px' }} type="checkbox" onChange={(e) => setTutorInfo({ ...tutorInfo, live_separate: e.target.checked })} checked={tutorInfo.live_separated} />
                            </Col>
                        </Row>
                    </Col>
                    {
                        tutorInfo.live_separated === true || tutorInfo.live_separated === 1  &&
                        <>
                            <Col xl='4' md='4' sm='12' xs='12' className='mt-4'>
                                <InputComponent
                                    label='Código Postal'
                                    value={tutorInfo.postal_code}
                                    onChange={(e) => setTutorInfo({ ...tutorInfo, postal_code: e.target.value })}
                                    error={errors.postal_code.error}
                                    errorMessage={errors.postal_code.message}
                                />
                            </Col>
                            <Col xl='4' md='4' sm='12' xs='12' className='mt-4'>
                                <SelectComponent
                                    label='Estado'
                                    value={tutorInfo.id_state}
                                    onChange={async (e) => {
                                        if (e.target.value === 0) {
                                            return
                                        }
                                        const id_state = parseInt(e.target.value)

                                        // traer los municipios de la entidad seleccionada usando la funcion getMunicipalities
                                        const municipalities = await getMunicipalities(id_state)

                                        setInitialData({ ...initialData, municipalities: municipalities })
                                        setTutorInfo({ ...tutorInfo, id_state: id_state, id_municipality: 0 })
                                    }}
                                    error={errors.id_state.error}
                                    errorMessage={errors.id_state.message}
                                    options={initialData.states.map((state) => ({ value: state.id_state, label: state.name }))}
                                />
                            </Col>
                            <Col xl='4' md='4' sm='12' xs='12' className='mt-4'>
                                <SelectComponent
                                    label='Municipio'
                                    value={tutorInfo.id_municipality}
                                    onChange={(e) => setTutorInfo({ ...tutorInfo, id_municipality: e.target.value })}
                                    error={errors.id_municipality.error}
                                    errorMessage={errors.id_municipality.message}
                                    options={initialData.municipalities.map((municipality) => ({ value: municipality.id_municipality, label: municipality.name }))}
                                />
                            </Col>
                            <Col xl='4' md='4' sm='12' xs='12' className='mt-4'>
                                <InputComponent
                                    label='Colonia'
                                    value={tutorInfo.neighborhood}
                                    onChange={(e) => setTutorInfo({ ...tutorInfo, neighborhood: e.target.value })}
                                    error={errors.neighborhood.error}
                                    errorMessage={errors.neighborhood.message}
                                />
                            </Col>
                            <Col xl='4' md='4' sm='12' xs='12' className='mt-4'>
                                <InputComponent
                                    label='Calle y número'
                                    value={tutorInfo.street_and_number}
                                    onChange={(e) => setTutorInfo({ ...tutorInfo, street_and_number: e.target.value })}
                                    error={errors.street_and_number.error}
                                    errorMessage={errors.street_and_number.message}
                                />
                            </Col>
                        </>
                    }

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