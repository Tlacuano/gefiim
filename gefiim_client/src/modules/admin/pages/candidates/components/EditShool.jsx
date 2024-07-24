import { useEffect, useState } from "react"
import { Card, CardBody, Col, Row } from "react-bootstrap"
import { ButtonComponent, InputComponent } from "../../../../../components"
import axios from '../../../../../config/http-clientt.gateway'
import { LoadAlert, SweetAlert, ToastSuccess, ToastWarning } from "../../../../../components/SweetAlertToast"
import { SelectComponent } from "../../../../../components/SelectComponent"

export const EditSchool = ({ school }) => {
    const errorObject = {
        school_key: {
            error: false,
            message: ''
        },
        school_type: {
            error: false,
            message: ''
        },
        school_name: {
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
        average_grade: {
            error: false,
            message: ''
        },
        has_debts: {
            error: false,
            message: ''
        },
        scholarship_type: {
            error: false,
            message: ''
        }
    }

    const [error, setError] = useState(errorObject)
    const [schoolInfo, setSchoolInfo] = useState({
        id_highschool: 0,
        school_key: '',
        school_type: '',
        school_name: '',
        id_state: 0,
        id_municipality: 0,
        average_grade: 0,
        has_debts: false,
        scholarship_type: ''
    })
    const [initialData, setInitialData] = useState({
        states: [],
        municipalities: []
    })

    const getInitialData = async () => {
        try {
            const responseStates = await axios.doGet('/state/get-states')
            const municipalities = await getMunicipalities(school.id_state)

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

        // Validar clave de la escuela
        if (schoolInfo.school_key === '' || schoolInfo.school_key === null) {
            newError.school_key = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (!/^[A-Za-z0-9]{1,10}$/.test(schoolInfo.school_key)) {
                newError.school_key = { error: true, message: 'Clave inválida' };
                check = true;
            }
        }

        // Validar tipo de escuela
        if (schoolInfo.school_type === '' || schoolInfo.school_type === null) {
            newError.school_type = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (!/^(SECUNDARIA GENERAL|SECUNDARIA TECNICA|SECUNDARIA PRIVADA|TELESECUNDARIA)$/.test(schoolInfo.school_type)) {
                newError.school_type = { error: true, message: 'Tipo inválido' };
                check = true;
            }
        }

        // Validar nombre de la escuela
        if (schoolInfo.school_name === '' || schoolInfo.school_name === null) {
            newError.school_name = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        }

        // Validar estado
        if (schoolInfo.id_state === 0) {
            newError.id_state = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        }

        // Validar municipio
        if (schoolInfo.id_municipality === 0) {
            newError.id_municipality = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        }

        // Validar promedio
        if (schoolInfo.average_grade === 0) {
            newError.average_grade = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (schoolInfo.average_grade < 0 || schoolInfo.average_grade > 10) {
                newError.average_grade = { error: true, message: 'Promedio inválido' };
                check = true;
            }
        }

        // Validar tipo de beca
        if (schoolInfo.scholarship_type === '' || schoolInfo.scholarship_type === null) {
            newError.scholarship_type = { error: true, message: 'Este campo es obligatorio' };
            check = true;
        } else {
            if (!/^(Ninguna|Propia institución|Intercambio|Oportunidades|Continuación de estudios|Contra el abandono escolar|Desarrollo de competencias|Estudiantes con Alguna Discapacidad|Probems|Salario|Otra beca federal|Beca estatal|Beca particular|Beca internacional|Otra)$/.test(schoolInfo.scholarship_type)) {
                newError.scholarship_type = { error: true, message: 'Tipo de beca inválido' };
                check = true;
            }
        }

        setError(newError);

        if (!check) {
            SweetAlert(
                'question',
                '¿Estás seguro?',
                '¿Deseas editar la información de la escuela?',
                'Aceptar',
                async () => {
                    const payload = { ...schoolInfo }
                    payload.average_grade = parseFloat(parseFloat(payload.average_grade).toFixed(1))

                    try {
                        LoadAlert(true);
                        const response = await axios.doPost('/candidates/edit-highschool-information', payload);
                        LoadAlert(false);

                        if (response.data) {
                            ToastSuccess('Información de la escuela editada correctamente');
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

        if (school !== undefined){
            setSchoolInfo(school)
            getInitialData()
        }
        
    }, [school])

    return (
        <Card>
            <CardBody>
                <h5>Información de la escuela de procedencia</h5>
                <Row>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <InputComponent
                            label='Clave de la escuela'
                            value={schoolInfo.school_key}
                            onChange={(e) => setSchoolInfo({ ...schoolInfo, school_key: e.target.value })}
                            error={error.school_key.error}
                            errorMessage={error.school_key.message}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <SelectComponent
                            label='Tipo de escuela'
                            value={schoolInfo.school_type}
                            onChange={(e) => setSchoolInfo({ ...schoolInfo, school_type: e.target.value })}
                            error={error.school_type.error}
                            errorMessage={error.school_type.message}
                            options={[
                                { value: 'SECUNDARIA GENERAL', label: 'Secundaria General' },
                                { value: 'SECUNDARIA TECNICA', label: 'Secundaria Técnica' },
                                { value: 'SECUNDARIA PRIVADA', label: 'Secundaria Privada' },
                                { value: 'TELESECUNDARIA', label: 'Telesecundaria' }
                            ]}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <InputComponent
                            label='Nombre de la escuela'
                            value={schoolInfo.school_name}
                            onChange={(e) => setSchoolInfo({ ...schoolInfo, school_name: e.target.value })}
                            error={error.school_name.error}
                            errorMessage={error.school_name.message}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <SelectComponent
                            label='Estado'
                            value={schoolInfo.id_state}
                            onChange={async (e) => {
                                if (e.target.value === '') {
                                    return
                                }
                                const id_state = parseInt(e.target.value)

                                const municipalities = await getMunicipalities(id_state)

                                setInitialData({ ...initialData, municipalities: municipalities })
                                setSchoolInfo({ ...schoolInfo, id_state: id_state, id_municipality: 0 })
                            }}
                            error={error.id_state.error}
                            errorMessage={error.id_state.message}
                            options={initialData.states.map((state) => ({ value: state.id_state, label: state.name }))}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <SelectComponent
                            label='Municipio'
                            value={schoolInfo.id_municipality}
                            onChange={(e) => setSchoolInfo({ ...schoolInfo, id_municipality: e.target.value })}
                            error={error.id_municipality.error}
                            errorMessage={error.id_municipality.message}
                            options={initialData.municipalities.map((municipality) => ({ value: municipality.id_municipality, label: municipality.name }))}
                            isDisable={initialData.municipalities.length === 0}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <InputComponent
                            label='Promedio'
                            value={schoolInfo.average_grade}
                            onChange={(e) => setSchoolInfo({ ...schoolInfo, average_grade: e.target.value })}
                            error={error.average_grade.error}
                            errorMessage={error.average_grade.message}
                            type='number'
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <SelectComponent
                            label='¿Tiene adeudos?'
                            value={schoolInfo.has_debts}
                            onChange={(e) => setSchoolInfo({ ...schoolInfo, has_debts: e.target.value })}
                            error={error.has_debts.error}
                            errorMessage={error.has_debts.message}
                            options={[
                                { value: 1, label: 'Sí' },
                                { value: 0, label: 'No' }
                            ]}
                        />
                    </Col>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <SelectComponent
                            label='Tipo de beca'
                            value={schoolInfo.scholarship_type}
                            onChange={(e) => setSchoolInfo({ ...schoolInfo, scholarship_type: e.target.value })}
                            error={error.scholarship_type.error}
                            errorMessage={error.scholarship_type.message}
                            options={[
                                { value: 'Ninguna', label: 'Ninguna' },
                                { value: 'Propia institución', label: 'Propia institución' },
                                { value: 'Intercambio', label: 'Intercambio' },
                                { value: 'Oportunidades', label: 'Oportunidades' },
                                { value: 'Continuación de estudios', label: 'Continuación de estudios' },
                                { value: 'Contra el abandono escolar', label: 'Contra el abandono escolar' },
                                { value: 'Desarrollo de competencias', label: 'Desarrollo de competencias' },
                                { value: 'Estudiantes con Alguna Discapacidad', label: 'Estudiantes con Alguna Discapacidad' },
                                { value: 'Probems', label: 'Probems' },
                                { value: 'Salario', label: 'Salario' },
                                { value: 'Otra beca federal', label: 'Otra beca federal' },
                                { value: 'Beca estatal', label: 'Beca estatal' },
                                { value: 'Beca particular', label: 'Beca particular' },
                                { value: 'Beca internacional', label: 'Beca internacional' },
                                { value: 'Otra', label: 'Otra' }
                            ]}
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
