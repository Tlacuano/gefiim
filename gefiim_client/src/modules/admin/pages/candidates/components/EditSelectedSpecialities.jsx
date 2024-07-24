import { Card, CardBody, Col, Row } from "react-bootstrap"
import axios from '../../../../../config/http-clientt.gateway'
import { LoadAlert, SweetAlert, ToastSuccess, ToastWarning } from "../../../../../components/SweetAlertToast"
import { useEffect, useState } from "react"
import { SelectComponent } from "../../../../../components/SelectComponent"
import { ButtonComponent } from "../../../../../components"


export const EditSelectedSpecialities = ({ selectedSpecialities }) => {

    const errorObject ={
        speciality1:{
            error: false,
            message: ''
        },
        speciality2:{
            error: false,
            message: ''
        },
        speciality3:{
            error: false,
            message: ''
        }
    }

    const [errors, setErrors] = useState(errorObject)
    const [specialities, setSpecialities] = useState({
        specialities: [],
        specialitiesSeled: [],
        currentSalePeriod: 0,
    })
    const [selectedSpecialitiesInfo, setSelectedSpecialitiesInfo] = useState([
        {
            herarchy : 1,
            id_selected_speciality : 0,
            id_speciality : 0,
        },
        {
            herarchy : 2,
            id_selected_speciality : 0,
            id_speciality : 0,
        },
        {
            herarchy : 3,
            id_selected_speciality : 0,
            id_speciality : 0,
        },
    ])

    const getCurrentPerion = async () => {
        try {
            const response = await axios.doGet('/sale-period/get-current-period')
            
            setSpecialities({
                specialities: response.data.specialities,
                specialitiesSeled: [...response.data.specialities, ...response.data.specialities_saled],
                currentSalePeriod: response.data.currentSalePeriod,
            })

        } catch (error) {
            ToastWarning(error.response.data.message)
        }
    }

    const validate = () => {
        let check = false;
        let newError = { ...errorObject };

        // Validar especialidad 1
        if (selectedSpecialitiesInfo[0].id_speciality === 0) {
            newError.speciality1 = { error: true, message: 'Seleccione una especialidad' };
            check = true;
        }

        // Validar especialidad 2
        if (selectedSpecialitiesInfo[1].id_speciality === 0) {
            newError.speciality2 = { error: true, message: 'Seleccione una especialidad' };
            check = true;
        }

        // Validar especialidad 3
        if (selectedSpecialitiesInfo[2].id_speciality === 0) {
            newError.speciality3 = { error: true, message: 'Seleccione una especialidad' };
            check = true;
        }

        setErrors(newError);

        if (!check) {
            SweetAlert(
                'question',
                '¿Estás seguro?',
                '¿Deseas editar las especialidades seleccionadas?',
                'Aceptar',
                async () => {
                    try {
                        const payload = {
                            id_period: specialities.currentSalePeriod,
                            specialities_by_period: selectedSpecialitiesInfo
                        }

                        LoadAlert(true);
                        const response = await axios.doPost('/candidates/edit-specialities-selected', payload);
                        LoadAlert(false);

                        if (response.data) {
                            ToastSuccess('Especialidades seleccionadas editadas correctamente');
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
        if(selectedSpecialities.length > 0){
            setSelectedSpecialitiesInfo(selectedSpecialities)
        }
        getCurrentPerion()
    }, [selectedSpecialities])

    return(
        <Card>
            <CardBody>
                <h5>Especialidades seleccionadas</h5>
                <Row>
                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <SelectComponent
                            label='Opción 1'
                            value={selectedSpecialitiesInfo[0].id_speciality}
                            onChange={(e) => {
                                const id_speciality = parseInt(e.target.value)
                                const sepecialitiesSelected = [...selectedSpecialitiesInfo]

                                sepecialitiesSelected[0] = {
                                    id_speciality : id_speciality,
                                    herarchy : 1,
                                    id_selected_speciality:  selectedSpecialitiesInfo[0].id_selected_speciality
                                }

                                setSelectedSpecialitiesInfo(sepecialitiesSelected)
                            }}
                            error={errors.speciality1.error}
                            errorMessage={errors.speciality1.message}
                            options={specialities.specialitiesSeled.map((speciality) => { return { value: speciality.id_speciality, label: speciality.name } })}
                            
                        />
                    </Col>

                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <SelectComponent
                            label='Opción 2'
                            value={selectedSpecialitiesInfo[1].id_speciality}
                            onChange={(e) => {
                                const id_speciality = parseInt(e.target.value)
                                const sepecialitiesSelected = [...selectedSpecialitiesInfo]

                                sepecialitiesSelected[1] = {
                                    id_speciality : id_speciality,
                                    herarchy : 2,
                                    id_selected_speciality:  selectedSpecialitiesInfo[1].id_selected_speciality
                                }

                                setSelectedSpecialitiesInfo(sepecialitiesSelected)
                            }}
                            error={errors.speciality2.error}
                            errorMessage={errors.speciality2.message}
                            options={specialities.specialitiesSeled.filter((speciality) => speciality.id_speciality !== selectedSpecialitiesInfo[0].id_speciality).map((speciality) => { return { value: speciality.id_speciality, label: speciality.name } })}
                        />
                    </Col>

                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                        <SelectComponent
                            label='Opción 3'
                            value={selectedSpecialitiesInfo[2].id_speciality}
                            onChange={(e) => {
                                const id_speciality = parseInt(e.target.value)
                                const sepecialitiesSelected = [...selectedSpecialitiesInfo]

                                sepecialitiesSelected[2] = {
                                    id_speciality : id_speciality,
                                    herarchy : 3,
                                    id_selected_speciality:  selectedSpecialitiesInfo[2].id_selected_speciality
                                }

                                setSelectedSpecialitiesInfo(sepecialitiesSelected)
                            }}
                            error={errors.speciality3.error}
                            errorMessage={errors.speciality3.message}
                            options={specialities.specialitiesSeled.filter((speciality) => speciality.id_speciality !== selectedSpecialitiesInfo[0].id_speciality && speciality.id_speciality !== selectedSpecialitiesInfo[1].id_speciality).map((speciality) => { return { value: speciality.id_speciality, label: speciality.name } })}
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