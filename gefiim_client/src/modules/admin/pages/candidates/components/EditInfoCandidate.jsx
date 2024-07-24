import { useEffect, useState } from "react"
import { Card, CardBody, Col, Row } from "react-bootstrap"
import { ButtonComponent, InputComponent } from "../../../../../components"
import axios from '../../../../../config/http-clientt.gateway'
import { LoadAlert, SweetAlert, ToastSuccess, ToastWarning } from "../../../../../components/SweetAlertToast"
import { SelectComponent } from "../../../../../components/SelectComponent"

export const EditInfoCandidate = ({ candidate }) => {
    const errorObject = {
        name:{
            error: false,
            message: ''
        },
        first_last_name:{
            error: false,
            message: ''
        },
        second_last_name:{
            error: false,
            message: ''
        },
        birthdate:{
            error: false,
            message: ''
        },
        curp:{
            error: false,
            message: ''
        },
        email:{
            error: false,
            message: ''
        },
        phone_number:{
            error: false,
            message: ''
        },
        secondary_phone_number:{
            error: false,
            message: ''
        },
        birth_state:{
            error: false,
            message: ''
        },
        birth_municipality:{
            error: false,
            message: ''
        },
        gender:{
            error: false,
            message: ''
        }
    }

    const [error, setError] = useState(errorObject)
    const [candidateInfo, setCandidateInfo] = useState({
        birthdate: '',
        curp: '',
        email: '',
        first_last_name: '',
        second_last_name: '',
        name: '',
        gender: '',
        id_birth_municipality: 0,
        id_birth_state: 0,
        phone_number: '',
        secondary_phone_number: '',
    })
    const [initialData, setInitialData] = useState({
        states: [],
        municipalities: []
    })

    const getInitialData = async () => {
        try {
            const responseStates = await axios.doGet('/state/get-states')
            const municipalities = await getMunicipalities(candidate.id_birth_state)

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
        if (candidateInfo.name === '' || candidateInfo.name === null) {
            newError.name = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(candidateInfo.name)) {
                newError.name = { error: true, message: 'Nombre inválido' };
                check = true;
            }
        }
    
        // Validar primer apellido
        if (candidateInfo.first_last_name === '' || candidateInfo.first_last_name === null) {
            newError.first_last_name = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(candidateInfo.first_last_name)) {
                newError.first_last_name = { error: true, message: 'Apellido inválido' };
                check = true;
            }
        }
    
        // Validar segundo apellido (opcional)
        if (candidateInfo.second_last_name !== '' && candidateInfo.second_last_name !== null) {
            if (!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(candidateInfo.second_last_name)) {
                newError.second_last_name = { error: true, message: 'Apellido inválido' };
                check = true;
            }
        }
    
        // Validar CURP
        if (candidateInfo.curp === '' || candidateInfo.curp === null) {
            newError.curp = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (!/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/.test(candidateInfo.curp)) {
                newError.curp = { error: true, message: 'CURP inválida' };
                check = true;
            }
        }
    
        // Validar fecha de nacimiento
        if (candidateInfo.birthdate === '' || candidateInfo.birthdate === null) {
            newError.birthdate = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        }
    
        // Validar correo electrónico
        if (candidateInfo.email === '' || candidateInfo.email === null) {
            newError.email = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(candidateInfo.email)) {
                newError.email = { error: true, message: 'Correo inválido' };
                check = true;
            }
        }
    
        // Validar teléfono
        if (candidateInfo.phone_number === '' || candidateInfo.phone_number === null) {
            newError.phone_number = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (!/^\d{10}$/.test(candidateInfo.phone_number)) {
                newError.phone_number = { error: true, message: 'Teléfono inválido' };
                check = true;
            }
        }
    
        // Validar teléfono secundario (opcional)
        if (candidateInfo.secondary_phone_number !== '' && candidateInfo.secondary_phone_number !== null) {
            if (!/^\d{10}$/.test(candidateInfo.secondary_phone_number)) {
                newError.secondary_phone_number = { error: true, message: 'Teléfono secundario inválido' };
                check = true;
            }
        }
    
        // Validar género
        if (candidateInfo.gender === '' || candidateInfo.gender === null) {
            newError.gender = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (candidateInfo.gender !== 'M' && candidateInfo.gender !== 'F') {
                newError.gender = { error: true, message: 'Género inválido' };
                check = true;
            }
        }
    
        // Validar estado de nacimiento
        if (candidateInfo.id_birth_state === 0) {
            newError.birth_state = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        }
    
        // Validar municipio de nacimiento
        if (candidateInfo.id_birth_municipality === 0) {
            newError.birth_municipality = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        }
    
        setError(newError);
    
        if (!check) {
            SweetAlert(
                'question',
                '¿Estás seguro?',
                '¿Deseas editar la información del candidato?',
                'Aceptar',
                async () => {
                    try {
                        const payload = {...candidateInfo}

                        if(candidateInfo.birthdate.includes('T')){
                            payload.birthdate = candidateInfo.birthdate.split('T')[0]
                        }

                        LoadAlert(true);
                        const response = await axios.doPost('/candidates/edit-candidate', candidateInfo);
                        LoadAlert(false);
    
                        if (response.data) {
                            ToastSuccess('Información del candidato editada correctamente');
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
    }

    useEffect(() => {

        if (candidate !== undefined){
            setCandidateInfo(candidate)
            getInitialData()
        }
        
    }, [candidate])

    return (
        <Card>
            <CardBody>
                <h5>Información del Candidato</h5>
                <Row>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <InputComponent
                            label='Nombre'
                            value={candidateInfo.name}
                            onChange={(e) => setCandidateInfo({ ...candidateInfo, name: e.target.value })}
                            error={error.name.error}
                            errorMessage={error.name.message}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <InputComponent
                            label='Primer apellido'
                            value={candidateInfo.first_last_name}
                            onChange={(e) => setCandidateInfo({ ...candidateInfo, first_last_name: e.target.value })}
                            error={error.first_last_name.error}
                            errorMessage={error.first_last_name.message}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <InputComponent
                            label='Segundo apellido'
                            value={candidateInfo.second_last_name}
                            onChange={(e) => setCandidateInfo({ ...candidateInfo, second_last_name: e.target.value })}
                            error={error.second_last_name.error}
                            errorMessage={error.second_last_name.message}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <InputComponent
                            label='Fecha de nacimiento'
                            value={candidateInfo.birthdate}
                            type='date'
                            onChange={(e) => setCandidateInfo({ ...candidateInfo, birthdate: e.target.value })}
                            error={error.birthdate.error}
                            errorMessage={error.birthdate.message}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <InputComponent
                            label='CURP'
                            value={candidateInfo.curp}
                            onChange={(e) => setCandidateInfo({ ...candidateInfo, curp: e.target.value })}
                            error={error.curp.error}
                            errorMessage={error.curp.message}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <InputComponent
                            label='Correo'
                            value={candidateInfo.email}
                            onChange={(e) => setCandidateInfo({ ...candidateInfo, email: e.target.value })}
                            error={error.email.error}
                            errorMessage={error.email.message}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <InputComponent
                            label='Teléfono'
                            value={candidateInfo.phone_number}
                            onChange={(e) => setCandidateInfo({ ...candidateInfo, phone_number: e.target.value })}
                            error={error.phone_number.error}
                            errorMessage={error.phone_number.message}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <InputComponent
                            label='Teléfono secundario'
                            value={candidateInfo.secondary_phone_number}
                            onChange={(e) => setCandidateInfo({ ...candidateInfo, secondary_phone_number: e.target.value })}
                            error={error.secondary_phone_number.error}
                            errorMessage={error.secondary_phone_number.message}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <SelectComponent
                            label='Sexo'
                            value={candidateInfo.gender}
                            onChange={(e) => setCandidateInfo({ ...candidateInfo.gender })}
                            error={error.gender.error}
                            errorMessage={error.gender.message}
                            options={[
                                { value: 'M', label: 'Masculino' },
                                { value: 'F', label: 'Femenino' }
                            ]}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <SelectComponent
                            label='Estado de nacimiento'
                            value={candidateInfo.id_birth_state}
                            onChange={async (e) => {
                                if (e.target.value === '') {
                                    return
                                }
                                const id_state = parseInt(e.target.value)

                                // traer los municipios de la entidad seleccionada usando la funcion getMunicipalities
                                const municipalities = await getMunicipalities(id_state)

                                setInitialData({ ...initialData, municipalities: municipalities })
                                setCandidateInfo({ ...candidateInfo, id_birth_state: id_state, id_birth_municipality: 0 })
                            }}
                            error={error.birth_state.error}
                            errorMessage={error.birth_state.message}
                            options={initialData.states.map((state) => ({ value: state.id_state, label: state.name }))}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <SelectComponent
                            label='Municipio de nacimiento'
                            value={candidateInfo.id_birth_municipality}
                            onChange={(e) => setCandidateInfo({ ...candidateInfo, id_birth_municipality: e.target.value })}
                            error={error.birth_municipality.error}
                            errorMessage={error.birth_municipality.message}
                            options={initialData.municipalities.map((municipality) => ({ value: municipality.id_municipality, label: municipality.name }))}
                            isDisable={initialData.municipalities.length === 0}
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