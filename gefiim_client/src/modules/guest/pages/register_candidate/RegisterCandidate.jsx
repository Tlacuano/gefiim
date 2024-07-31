import { Button, Col, Container, Row } from 'react-bootstrap'
import axios from '../../../../config/http-clientt.gateway'
import { useEffect, useState } from 'react'
import { Stepper } from './components/Stepper'
import { useNavigate } from 'react-router-dom'
import { LoadAlert, ToastWarning } from '../../../../components/SweetAlertToast'
import { ButtonComponent, InputComponent } from '../../../../components'
import { SelectComponent } from '../../../../components/SelectComponent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { base64ToFile } from '../../../../utils/functions/base64ToFile'

export const RegisterCandidate = () => {
    const navigate = useNavigate()  

    // estados del componente
    const [logo, setLogo] = useState('')
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        const institutionalInformation = JSON.parse(localStorage.getItem('institutionalInformation'))
        if (institutionalInformation) {
            setLogo(institutionalInformation.logo)
        }
    }, [])


    // traer la informacion inicial
    const [initialData, setInitialData] = useState({
        specialities: [],
        specialitiesSeled: [],
        currentSalePeriod: 0,
        states: [],
        municipalities: [],
    })

    const getCurrentPeriod = async () => {
        try {
            // traer el periodo actual
            const response = await axios.doGet('/sale-period/get-current-period')
            
            // si no hay especialidades, redirigir a la pagina principal
            if (response.data.specialities.length === 0) {
                navigate('/')
            }

            // traer los estados
            const responseStates = await axios.doGet('/state/get-states')
            // juntar los dos arreglos de especialidades

            // setear la informacion inicial para el formulario
            setInitialData({
                specialities: response.data.specialities,
                specialitiesSeled: [...response.data.specialities, ...response.data.specialities_saled],
                currentSalePeriod: response.data.currentSalePeriod,
                states: responseStates.data,
                municipalities: []
            })

            // setear el periodo actual
            setForm({...form, id_period: response.data.currentSalePeriod.id_period})

        } catch (error) {
            ToastWarning(error.response.data.message)
        }
    }

    useEffect(() => {
        getCurrentPeriod()
    }, [])


     /* FORMULARIO */
    const [form, setForm] = useState({ 
        name: '',
        first_last_name: '',
        second_last_name: '',
        curp: '',
        birth: '',
        gender: '',
        email: '',
        id_birth_state: 0,
        id_birth_municipality: 0,
        phone_number: '',
        secondary_phone_number: '',

        // address
        candidate_postal_code: '',
        candidate_id_state: 0,
        candidate_id_municipality: 0,
        candidate_neighborhood: '',
        candidate_street_and_number: '',

        // tutors
        tutor_name: '',
        tutor_first_last_name: '',
        tutor_second_last_name: '',
        tutor_phone_number: '',
        tutor_secondary_phone_number: '',
        tutor_live_separated: false,

        // tutor address
        tutor_postal_code: '',
        tutor_id_state: 0,
        tutor_id_municipality: 0,
        tutor_neighborhood: '',
        tutor_street_and_number: '',

        // highschool information
        school_key: '',
        school_type: '',
        school_name: '',
        school_id_state: 0,
        school_id_municipality: 0,
        average_grade: 0,
        has_debts: false,
        scholarship_type: '',

        specialities_by_period: [
            {
                id_speciality: 0,
                hierarchy: 1,
                name: '',
            },
            {
                id_speciality: 0,
                hierarchy: 2,
                name: '',
            },
            {
                id_speciality: 0,
                hierarchy: 3,
                name: '',
            }
        ],

        id_period: 0,
    })

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
        curp: {
            error: false,
            message: ''
        },
        birthdate: {
            error: false,
            message: ''
        },
        gender: {
            error: false,
            message: ''
        },
        email: {
            error: false,
            message: ''
        },
        id_birth_state: {
            error: false,
            message: ''
        },
        id_birth_municipality: {
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
        candidate_postal_code: {
            error: false,
            message: ''
        },
        candidate_id_state: {
            error: false,
            message: ''
        },
        candidate_id_municipality: {
            error: false,
            message: ''
        },
        candidate_neighborhood: {
            error: false,
            message: ''
        },
        candidate_street_and_number: {
            error: false,
            message: ''
        },
        tutor_name: {
            error: false,
            message: ''
        },
        tutor_first_last_name: {
            error: false,
            message: ''
        },
        tutor_second_last_name: {
            error: false,
            message: ''
        },
        tutor_phone_number: {
            error: false,
            message: ''
        },
        tutor_secondary_phone_number: {
            error: false,
            message: ''
        },
        tutor_postal_code: {
            error: false,
            message: ''
        },
        tutor_id_state: {
            error: false,
            message: ''
        },
        tutor_id_municipality: {
            error: false,
            message: ''
        },
        tutor_neighborhood: {
            error: false,
            message: ''
        },
        tutor_street_and_number: {
            error: false,
            message: ''
        },
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
        school_id_state: {
            error: false,
            message: ''
        },
        school_id_municipality: {
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
        },
        speciality1: {
            error: false,
            message: ''
        },
        speciality2: {
            error: false,
            message: ''
        },
        speciality3: {
            error: false,
            message: ''
        },
        
    }

    const [error, setError] = useState(errorObject)

    const [token, setToken] = useState('')

    // validar pasos
    const validateStep0 = async () => {
        let check = false
        let newError = { ...errorObject }

        // validar nombre
        if (form.name === '' || form.name === null) {
            newError.name = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(form.name)){
                newError.name = { error: true, message: 'Nombre inválido' }
                check = true
            }
        }
        

        // validar primer apellido
        if (form.first_last_name === '' || form.first_last_name === null) {
            newError.first_last_name = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(form.first_last_name)){
                newError.first_last_name = { error: true, message: 'Apellido inválido' }
                check = true
            }
        }

        // validar segundo apellido (no obligatorio)
        if (form.second_last_name !== '' && form.second_last_name !== null) {
            if(!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(form.second_last_name)){
                newError.second_last_name = { error: true, message: 'Apellido inválido' }
                check = true
            }
        }

        // validar curp
        if (form.curp === '' || form.curp === null) {
            newError.curp = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/.test(form.curp)){   
                newError.curp = { error: true, message: 'CURP inválida' }
                check = true
            }

            const validateCurp = {
                curp: form.curp,
                id_period: initialData.currentSalePeriod
            }

            try {
                await axios.doPost('/candidates/validate-curp-on-period', validateCurp)
            } catch (error) {
                ToastWarning(error.response.data.message)
            }
        }

        // validar fecha de nacimiento
        if (form.birth === '' || form.birth === null) {
            newError.birthdate = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            const date = new Date()
            const year = date.getFullYear()
            const birth = new Date(form.birth)
            if(year - birth.getFullYear() < 13){
                newError.birthdate = { error: true, message: 'Edad mínima permitida 13 años' }
                check = true
            }
        }

        // validar correo electronico
        if (form.email === '' || form.email === null) {
            newError.email = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(form.email)){
                newError.email = { error: true, message: 'Correo inválido' }
                check = true
            }
        }
        
        // validar genero
        if(form.gender === '' || form.gender === null){
            newError.gender = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(form.gender !== 'M' && form.gender !== 'F'){
                newError.gender = { error: true, message: 'Género inválido' }
                check = true
            }
        }

        // validar el municipio de nacimiento
        if(form.id_birth_municipality === 0){
            newError.id_birth_municipality = { error: true, message: 'Este campo es obligatorio' }
            newError.id_birth_state = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }
        
        setError(newError)
        if (!check) {
            setInitialData({ ...initialData, municipalities: [] })
            setCurrentStep(1)
        }
    }
    const validateStep1 = async () => {
        let check = false
        let newError = { ...errorObject }

        // validar codigo postal
        if(form.candidate_postal_code === '' || form.candidate_postal_code === null){
            newError.candidate_postal_code = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!/^\d{5}$/.test(form.candidate_postal_code)){
                newError.candidate_postal_code = { error: true, message: 'Código postal inválido' }
                check = true
            }
        }

        // validar municipio
        if(form.candidate_id_municipality === 0){
            newError.candidate_id_municipality = { error: true, message: 'Este campo es obligatorio' }
            newError.candidate_id_state = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }

        // validar colonia
        if(form.candidate_neighborhood === '' || form.candidate_neighborhood === null){
            newError.candidate_neighborhood = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(/(<script)\b/g.test(form.candidate_neighborhood)){
                newError.candidate_neighborhood = { error: true, message: 'Campo inválido' }
                check = true
            }
        }

        // validar calle y número
        if(form.candidate_street_and_number === '' || form.candidate_street_and_number === null){
            newError.candidate_street_and_number = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(/(<script)\b/g.test(form.candidate_street_and_number)){
                newError.candidate_street_and_number = { error: true, message: 'Campo inválido' }
                check = true
            }
        }

        // validar telefono
        if(form.phone_number === '' || form.phone_number === null){
            newError.phone_number = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!/^\d{10}$/.test(form.phone_number)){
                newError.phone_number = { error: true, message: 'Teléfono inválido' }
                check = true
            }
        }

        // validar telefono secundario
        if(form.secondary_phone_number === '' || form.secondary_phone_number === null){
            newError.secondary_phone_number = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!/^\d{10}$/.test(form.secondary_phone_number)){
                newError.secondary_phone_number = { error: true, message: 'Teléfono inválido' }
                check = true
            }
        }

        setError(newError)
        if (!check) {
            setInitialData({ ...initialData, municipalities: [] })
            setCurrentStep(2)
        }
    }
    const validateStep2 = async () => {
        let check = false
        let newError = { ...errorObject }

        // validar nombre del tutor
        if(form.tutor_name === '' || form.tutor_name === null){
            newError.tutor_name = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(form.tutor_name)){
                newError.tutor_name = { error: true, message: 'Nombre inválido' }
                check = true
            }
        }

        // validar primer apellido del tutor
        if(form.tutor_first_last_name === '' || form.tutor_first_last_name === null){
            newError.tutor_first_last_name = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(form.tutor_first_last_name)){
                newError.tutor_first_last_name = { error: true, message: 'Apellido inválido' }
                check = true
            }
        }

        // validar segundo apellido del tutor
        if(form.tutor_second_last_name !== '' && form.tutor_second_last_name !== null ){
            if(!/^([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del))(\s([A-ZÁÉÍÓÚÄËÏÖÜ][a-záéíóúäëïöü]{2,}|(de|la|del)))*$/.test(form.tutor_second_last_name)){
                newError.tutor_second_last_name = { error: true, message: 'Apellido inválido' }
                check = true
            }
        }

        // validar telefono del tutor
        if(form.tutor_phone_number === '' || form.tutor_phone_number === null){
            newError.tutor_phone_number = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!/^\d{10}$/.test(form.tutor_phone_number)){
                newError.tutor_phone_number = { error: true, message: 'Teléfono inválido' }
                check = true
            }
        }

        // validar telefono secundario del tutor
        if(form.tutor_secondary_phone_number === '' || form.tutor_secondary_phone_number === null){
            newError.tutor_secondary_phone_number = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!/^\d{10}$/.test(form.tutor_secondary_phone_number)){
                newError.tutor_secondary_phone_number = { error: true, message: 'Teléfono inválido' }
                check = true
            }
        }

        if(form.tutor_live_separated){
            // validar codigo postal del tutor
            if(form.tutor_postal_code === '' || form.tutor_postal_code === null){
                newError.tutor_postal_code = { error: true, message: 'Este campo es obligatorio' }
                check = true
            }else{
                if(!/^\d{5}$/.test(form.tutor_postal_code)){
                    newError.tutor_postal_code = { error: true, message: 'Código postal inválido' }
                    check = true
                }
            }

            // validar municipio del tutor
            if(form.tutor_id_municipality === 0){
                newError.tutor_id_municipality = { error: true, message: 'Este campo es obligatorio' }
                newError.tutor_id_state = { error: true, message: 'Este campo es obligatorio' }
                check = true
            }

            // validar colonia del tutor
            if(form.tutor_neighborhood === '' || form.tutor_neighborhood === null){
                newError.tutor_neighborhood = { error: true, message: 'Este campo es obligatorio' }
                check = true
            }else{
                if(/(<script)\b/g.test(form.tutor_neighborhood)){
                    newError.tutor_neighborhood = { error: true, message: 'Campo inválido' }
                    check = true
                }
            }

            // validar calle y número del tutor
            if(form.tutor_street_and_number === '' || form.tutor_street_and_number === null){
                newError.tutor_street_and_number = { error: true, message: 'Este campo es obligatorio' }
                check = true
            }else{
                if(/(<script)\b/g.test(form.tutor_street_and_number)){
                    newError.tutor_street_and_number = { error: true, message: 'Campo inválido' }
                    check = true
                }
            }
        }

        setError(newError)
        if (!check) {
            setInitialData({ ...initialData, municipalities: [] })
            setCurrentStep(3)
        }
    }
    const validateStep3 = async () => {
        let check = false
        let newError = { ...errorObject }

        // validar clave de la escuela
        if(form.school_key === '' || form.school_key === null){
            newError.school_key = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!/^[A-Za-z0-9]{1,10}$/.test(form.school_key)){
                newError.school_key = { error: true, message: 'Clave inválida' }
                check = true
            }
        }

        // validar tipo de escuela
        if(form.school_type === '' || form.school_type === null){
            newError.school_type = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!/^(SECUNDARIA GENERAL|SECUNDARIA TECNICA|SECUNDARIA PRIVADA|TELESECUNDARIA)$/.test(form.school_type)){
                newError.school_type = { error: true, message: 'Tipo de escuela inválido' }
                check = true
            }
        }

        // validar nombre de la escuela
        if(form.school_name === '' || form.school_name === null){
            newError.school_name = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(/(<script)\b/g.test(form.school_name)){
                newError.school_name = { error: true, message: 'Campo inválido' }
                check = true
            }
        }

        // validar municipio de la escuela
        if(form.school_id_municipality === 0){
            newError.school_id_municipality = { error: true, message: 'Este campo es obligatorio' }
            newError.school_id_state = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }

        // validar promedio
        if(form.average_grade === 0){
            newError.average_grade = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(isNaN(form.average_grade)){
                newError.average_grade = { error: true, message: 'Promedio inválido' }
                check = true
            }

            if(form.average_grade < 0 || form.average_grade > 10){
                newError.average_grade = { error: true, message: 'Promedio inválido' }
                check = true
            }
        }

        // validar tipo de beca
        if(form.scholarship_type === '' || form.scholarship_type === null){
            newError.scholarship_type = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!/^(Ninguna|Propia institución|Intercambio|Oportunidades|Continuación de estudios|Contra el abandono escolar|Desarrollo de competencias|Estudiantes con Alguna Discapacidad|Probems|Salario|Otra beca federal|Beca estatal|Beca particular|Beca internacional|Otra)$/.test(form.scholarship_type)){
                newError.scholarship_type = { error: true, message: 'Tipo de beca inválido' }
                check = true
            }
        }

        setError(newError)
        if (!check) {
            setInitialData({ ...initialData, municipalities: [] })
            setCurrentStep(4)
        }
    }
    const validateStep4 = async () => {
        let check = false
        let newError = { ...errorObject }

        // validar que la especialidad 1 este dentro del arreglo de especialidades
        if(form.specialities_by_period[0].id_speciality === 0){
            newError.speciality1 = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!initialData.specialities.some(speciality => speciality.id_speciality === form.specialities_by_period[0].id_speciality)){
                newError.speciality1 = { error: true, message: 'Especialidad inválida' }
                check = true
            }
        }

        // validar que la especialidad 2 este dentro del arreglo de especialidades
        if(form.specialities_by_period[1].id_speciality === 0){
            newError.speciality2 = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!initialData.specialitiesSeled.some(speciality => speciality.id_speciality === form.specialities_by_period[1].id_speciality)){
                newError.speciality2 = { error: true, message: 'Especialidad inválida' }
                check = true
            }
        }

        // validar que la especialidad 3 este dentro del arreglo de especialidades
        if(form.specialities_by_period[2].id_speciality === 0){
            newError.speciality3 = { error: true, message: 'Este campo es obligatorio' }
            check = true
        }else{
            if(!initialData.specialitiesSeled.some(speciality => speciality.id_speciality === form.specialities_by_period[2].id_speciality)){
                newError.speciality3 = { error: true, message: 'Especialidad inválida' }
                check = true
            }
        }

        setError(newError)
        if (!check) {
            setInitialData({ ...initialData, municipalities: [] })
            registerCandidate()

        }
    }

    const registerCandidate = async () => {
        try {
            LoadAlert(true)
            

            const data = {...form}
            data.average_grade = parseFloat( parseFloat(data.average_grade).toFixed(1) )
            data.id_period = initialData.currentSalePeriod
            data.birthdate = data.birth

            const response = await axios.doPost('/candidates/register-candidate', data)

            setCurrentStep(5)
            
            setToken(response.data)
            base64ToFile(response.data.token, data.curp)

            LoadAlert(false)
        }catch(error){
            ToastWarning(error.response.data.message)
        }
    }

    const getMunicipalities = async (id_state) => {
        const municipalities = await axios.doPost(`/municipality/get-municipalities-by-state-id`, { id_state: id_state })
        return municipalities.data
    }



    return (
        <Container>
            <Row className='mt-3'>
                <Col className='d-flex align-items-center'>
                    <h1>Registro de candidato</h1>
                </Col>
                <Col lg="2" sm="3" xs="3" >
                    <img className='selectable' src={`data:image/png;base64,${logo}`} alt="logo" style={{ maxHeight: '8vh' }} onClick={() => navigate("/")}  />
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col>
                    <Stepper steps={[
                        'Información general del aspirante',
                        'Datos del domicilio actual',
                        'Información del padre, madre o tutor ',
                        'Secundaria de procedencia',
                        'Selección de carrera',
                        'Registro completo!',
                    ]} 
                    currentStep={currentStep}
                    />
                </Col>
            </Row>
            <Row >
                <Col>
                    {
                        currentStep === 0 ? 
                        <Row>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Nombre(s) *"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    error={error.name.error}
                                    errorMessage={error.name.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Primer apellido *"
                                    value={form.first_last_name}
                                    onChange={(e) => setForm({ ...form, first_last_name: e.target.value })}
                                    error={error.first_last_name.error}
                                    errorMessage={error.first_last_name.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Segundo apellido"
                                    value={form.second_last_name}
                                    onChange={(e) => setForm({ ...form, second_last_name: e.target.value })}
                                    error={error.second_last_name.error}
                                    errorMessage={error.second_last_name.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="CURP *"
                                    value={form.curp}
                                    onChange={(e) => setForm({ ...form, curp: e.target.value })}
                                    error={error.curp.error}
                                    errorMessage={error.curp.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Fecha de nacimiento *"
                                    value={form.birth}
                                    onChange={(e) => setForm({ ...form, birth: e.target.value })}
                                    error={error.birthdate.error}
                                    errorMessage={error.birthdate.message}
                                    type='date'
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <SelectComponent
                                    label="Género *"
                                    value={form.gender}
                                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                    options={[
                                        { value: 'M', label: 'Masculino' },
                                        { value: 'F', label: 'Femenino' },
                                    ]}
                                    error={error.gender.error}
                                    errorMessage={error.gender.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Correo electrónico *"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    error={error.email.error}
                                    errorMessage={error.email.message}
                                    type='email'
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <SelectComponent
                                    label="Entidad de nacimiento *"
                                    value={form.id_birth_state}
                                    onChange={ async (e) => {
                                        // si no hay valor, no hacer nada
                                        if (e.target.value === '') {
                                            return
                                        }
                                        const id_state = parseInt(e.target.value)

                                        // traer los municipios de la entidad seleccionada usando la funcion getMunicipalities
                                        const municipalities = await getMunicipalities(id_state)
                                        // setear los municipios
                                        setInitialData({ ...initialData, municipalities: municipalities })
                                        
                                        // setear el valor seleccionado
                                        setForm({ ...form, id_birth_state: id_state, id_birth_municipality: 0 })
                                    }}
                                    options={initialData.states.map(state => ({ value: state.id_state, label: state.name }))}
                                    error={error.id_birth_municipality.error}
                                    errorMessage={error.id_birth_municipality.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <SelectComponent
                                    label="Municipio de nacimiento *"
                                    value={form.id_birth_municipality}
                                    onChange={(e) => setForm({ ...form, id_birth_municipality: parseInt(e.target.value) })}
                                    options={initialData.municipalities.map(municipality => ({ value: municipality.id_municipality, label: municipality.name }))}
                                    error={error.id_birth_municipality.error}
                                    errorMessage={error.id_birth_municipality.message}
                                    isDisable={initialData.municipalities.length === 0}
                                />
                            </Col>
                            <Col lg='12' md='12' sm='12' xs='12' className='my-5'>
                                <Row>
                                    <Col className="text-end">
                                        <ButtonComponent
                                            action={validateStep0}
                                            pl={25}
                                            pr={25}
                                            textSize={20}
                                            mt={5}
                                        >
                                            Siguiente
                                        </ButtonComponent>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        : 
                        currentStep === 1 ?
                        <Row>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Código postal *"
                                    value={form.candidate_postal_code}
                                    onChange={(e) => setForm({ ...form, candidate_postal_code: e.target.value })}
                                    error={error.candidate_postal_code.error}
                                    errorMessage={error.candidate_postal_code.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <SelectComponent
                                    label="Entidad *"
                                    value={form.candidate_id_state}
                                    onChange={ async (e) => {
                                        // si no hay valor, no hacer nada
                                        if (e.target.value === '') {
                                            return
                                        }
                                        const id_state = parseInt(e.target.value)

                                        // traer los municipios de la entidad seleccionada usando la funcion getMunicipalities
                                        const municipalities = await getMunicipalities(id_state)
                                        // setear los municipios
                                        setInitialData({ ...initialData, municipalities: municipalities })

                                        // setear el valor seleccionado
                                        setForm({ ...form, candidate_id_state: id_state, candidate_id_municipality: 0 })
                                    }}
                                    options={initialData.states.map(state => ({ value: state.id_state, label: state.name }))}
                                    error={error.candidate_id_state.error}
                                    errorMessage={error.candidate_id_state.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <SelectComponent
                                    label="Municipio *"
                                    value={form.candidate_id_municipality}
                                    onChange={(e) => setForm({ ...form, candidate_id_municipality: parseInt(e.target.value) })}
                                    options={initialData.municipalities.map(municipality => ({ value: municipality.id_municipality, label: municipality.name }))}
                                    error={error.candidate_id_municipality.error}
                                    errorMessage={error.candidate_id_municipality.message}
                                    isDisable={initialData.municipalities.length === 0}
                                />
                            </Col>
                            <Col xl='6' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Colonia *"
                                    value={form.candidate_neighborhood}
                                    onChange={(e) => setForm({ ...form, candidate_neighborhood: e.target.value })}
                                    error={error.candidate_neighborhood.error}
                                    errorMessage={error.candidate_neighborhood.message}
                                />
                            </Col>
                            <Col xl='6' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Calle y número *"
                                    value={form.candidate_street_and_number}
                                    onChange={(e) => setForm({ ...form, candidate_street_and_number: e.target.value })}
                                    error={error.candidate_street_and_number.error}
                                    errorMessage={error.candidate_street_and_number.message}
                                />
                            </Col>
                            <Col  xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Teléfono *"
                                    value={form.phone_number}
                                    onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                                    error={error.phone_number.error}
                                    errorMessage={error.phone_number.message}
                                />                            
                            </Col>
                            <Col  xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Teléfono secundario *"
                                    value={form.secondary_phone_number}
                                    onChange={(e) => setForm({ ...form, secondary_phone_number: e.target.value })}
                                    error={error.secondary_phone_number.error}
                                    errorMessage={error.secondary_phone_number.message}
                                />
                            </Col>
                            <Col lg='12' md='12' sm='12' xs='12' className='my-5'>
                                <Row>
                                    <Col className="text-end">
                                        <span className="text-muted selectable text-hover mx-3" onClick={ () => setCurrentStep(0) } >
                                            <FontAwesomeIcon icon={['fas', 'arrow-left']} style={{ fontSize: 13 }} />   Volver
                                        </span>
                                        <ButtonComponent
                                            action={validateStep1}
                                            pl={25}
                                            pr={25}
                                            textSize={20}
                                            mt={5}
                                        >
                                            Siguiente
                                        </ButtonComponent>
                                    </Col>
                                </Row>
                            </Col>

                        </Row>
                        :
                        currentStep === 2 ?
                        <Row>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Nombre *"
                                    value={form.tutor_name}
                                    onChange={(e) => setForm({ ...form, tutor_name: e.target.value })}
                                    error={error.tutor_name.error}
                                    errorMessage={error.tutor_name.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Primer apellido *"
                                    value={form.tutor_first_last_name}
                                    onChange={(e) => setForm({ ...form, tutor_first_last_name: e.target.value })}
                                    error={error.tutor_first_last_name.error}
                                    errorMessage={error.tutor_first_last_name.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Segundo apellido"
                                    value={form.tutor_second_last_name}
                                    onChange={(e) => setForm({ ...form, tutor_second_last_name: e.target.value })}
                                    error={error.tutor_second_last_name.error}
                                    errorMessage={error.tutor_second_last_name.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Teléfono *"
                                    value={form.tutor_phone_number}
                                    onChange={(e) => setForm({ ...form, tutor_phone_number: e.target.value })}
                                    error={error.tutor_phone_number.error}
                                    errorMessage={error.tutor_phone_number.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Teléfono secundario *"
                                    value={form.tutor_secondary_phone_number}
                                    onChange={(e) => setForm({ ...form, tutor_secondary_phone_number: e.target.value })}
                                    error={error.tutor_secondary_phone_number.error}
                                    errorMessage={error.tutor_secondary_phone_number.message}
                                />
                            </Col>
                            <Col xl='12' md='12' sm='12' xs='12' className='mt-4' style={{backgroundColor: '#F7F7F7'}} >
                                <Row className='p-4'>
                                    <Col>
                                        <h5>Marcar en caso de que tu padre, madre o tutor viva separado de tí</h5>
                                    </Col>
                                    <Col className='text-end'>
                                        <input className='mt-2 custom-checkbox' style={{width: '20px', height: '20px' }} type="checkbox" onChange={(e) => setForm({ ...form, tutor_live_separated: e.target.checked })} />
                                    </Col>
                                </Row>
                            </Col>
                            {
                                form.tutor_live_separated &&
                                <>
                                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                        <InputComponent
                                            label="Código postal *"
                                            value={form.tutor_postal_code}
                                            onChange={(e) => setForm({ ...form, tutor_postal_code: e.target.value })}
                                            error={error.tutor_postal_code.error}
                                            errorMessage={error.tutor_postal_code.message}
                                        />
                                    </Col>
                                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                        <SelectComponent
                                            label="Entidad *"
                                            value={form.tutor_id_state}
                                            onChange={ async (e) => {
                                                // si no hay valor, no hacer nada
                                                if (e.target.value === '') {
                                                    return
                                                }
                                                const id_state = parseInt(e.target.value)

                                                // traer los municipios de la entidad seleccionada usando la funcion getMunicipalities
                                                const municipalities = await getMunicipalities(id_state)
                                                // setear los municipios
                                                setInitialData({ ...initialData, municipalities: municipalities })

                                                // setear el valor seleccionado
                                                setForm({ ...form, tutor_id_state: id_state, tutor_id_municipality: 0 })
                                            }}
                                            options={initialData.states.map(state => ({ value: state.id_state, label: state.name }))}
                                            error={error.tutor_id_state.error}
                                            errorMessage={error.tutor_id_state.message}
                                        />
                                    </Col>
                                    <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                        <SelectComponent
                                            label="Municipio *"
                                            value={form.tutor_id_municipality}
                                            onChange={(e) => setForm({ ...form, tutor_id_municipality: parseInt(e.target.value) })}
                                            options={initialData.municipalities.map(municipality => ({ value: municipality.id_municipality, label: municipality.name }))}
                                            error={error.tutor_id_municipality.error}
                                            errorMessage={error.tutor_id_municipality.message}
                                            isDisable={initialData.municipalities.length === 0}
                                        />
                                    </Col>
                                    <Col xl='6' md='6' sm='12' xs='12' className='mt-4' >
                                        <InputComponent
                                            label="Colonia *"
                                            value={form.tutor_neighborhood}
                                            onChange={(e) => setForm({ ...form, tutor_neighborhood: e.target.value })}
                                            error={error.tutor_neighborhood.error}
                                            errorMessage={error.tutor_neighborhood.message}
                                        />
                                    </Col>
                                    <Col xl='6' md='6' sm='12' xs='12' className='mt-4' >
                                        <InputComponent
                                            label="Calle y número *"
                                            value={form.tutor_street_and_number}
                                            onChange={(e) => setForm({ ...form, tutor_street_and_number: e.target.value })}
                                            error={error.tutor_street_and_number.error}
                                            errorMessage={error.tutor_street_and_number.message}
                                        />
                                    </Col>
                                </>
                            }
                            <Col lg='12' md='12' sm='12' xs='12' className='my-5'>
                                <Row>
                                    <Col className="text-end">
                                        <span className="text-muted selectable text-hover mx-3" onClick={ () => setCurrentStep(1) } >
                                            <FontAwesomeIcon icon={['fas', 'arrow-left']} style={{ fontSize: 13 }} />   Volver
                                        </span>
                                        <ButtonComponent
                                            action={validateStep2}
                                            pl={25}
                                            pr={25}
                                            textSize={20}
                                            mt={5}
                                        >
                                            Siguiente
                                        </ButtonComponent>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        :
                        currentStep === 3 ?
                        <Row>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Clave de la secundaria"
                                    value={form.school_key}
                                    onChange={(e) => setForm({ ...form, school_key: e.target.value })}
                                    error={error.school_key.error}
                                    errorMessage={error.school_key.message}
                                />                            
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <SelectComponent
                                    label="Tipo de secundaria *"
                                    value={form.school_type}
                                    onChange={(e) => setForm({ ...form, school_type: e.target.value })}
                                    options={[
                                        { value: 'SECUNDARIA GENERAL', label: 'SECUNDARIA GENERAL' },
                                        { value: 'SECUNDARIA TECNICA', label: 'SECUNDARIA TECNICA' },
                                        { value: 'SECUNDARIA PRIVADA', label: 'SECUNDARIA PRIVADA' },
                                        { value: 'TELESECUNDARIA', label: 'TELESECUNDARIA' },
                                    ]}
                                    error={error.school_type.error}
                                    errorMessage={error.school_type.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Nombre de la secundaria *"
                                    value={form.school_name}
                                    onChange={(e) => setForm({ ...form, school_name: e.target.value })}
                                    error={error.school_name.error}
                                    errorMessage={error.school_name.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <SelectComponent
                                    label="Entidad *"
                                    value={form.school_id_state}
                                    onChange={ async (e) => {
                                        // si no hay valor, no hacer nada
                                        if (e.target.value === '') {
                                            return
                                        }
                                        const id_state = parseInt(e.target.value)

                                        // traer los municipios de la entidad seleccionada usando la funcion getMunicipalities
                                        const municipalities = await getMunicipalities(id_state)
                                        // setear los municipios
                                        setInitialData({ ...initialData, municipalities: municipalities })

                                        // setear el valor seleccionado
                                        setForm({ ...form, school_id_state: id_state, school_id_municipality: 0 })
                                    }}
                                    options={initialData.states.map(state => ({ value: state.id_state, label: state.name }))}
                                    error={error.school_id_state.error}
                                    errorMessage={error.school_id_state.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <SelectComponent
                                    label="Municipio *"
                                    value={form.school_id_municipality}
                                    onChange={(e) => setForm({ ...form, school_id_municipality: parseInt(e.target.value) })}
                                    options={initialData.municipalities.map(municipality => ({ value: municipality.id_municipality, label: municipality.name }))}
                                    error={error.school_id_municipality.error}
                                    errorMessage={error.school_id_municipality.message}
                                    isDisable={initialData.municipalities.length === 0}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <InputComponent
                                    label="Promedio *"
                                    value={form.average_grade}
                                    onChange={(e) => setForm({ ...form, average_grade: e.target.value })}
                                    error={error.average_grade.error}
                                    errorMessage={error.average_grade.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                
                                <label>¿Adeudas materias? *</label>
                                <br/>
                                <input className='mt-4 custom-checkbox' style={{width: '20px', height: '20px' }} type="checkbox" onChange={(e) => setForm({ ...form, has_debts: e.target.checked })} />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <SelectComponent
                                    label="¿Que tipo de beca recibes? *"
                                    value={form.scholarship_type}
                                    onChange={(e) => setForm({ ...form, scholarship_type: e.target.value })}
                                    options={[
                                        { label: 'Ninguna', value: 'Ninguna' },
                                        { label: 'Propia institución', value: 'Propia institución' },
                                        { label: 'Intercambio', value: 'Intercambio' },
                                        { label: 'Oportunidades', value: 'Oportunidades' },
                                        { label: 'Continuación de estudios', value: 'Continuación de estudios' },
                                        { label: 'Contra el abandono escolar', value: 'Contra el abandono escolar' },
                                        { label: 'Desarrollo de competencias', value: 'Desarrollo de competencias' },
                                        { label: 'Estudiantes con Alguna Discapacidad', value: 'Estudiantes con Alguna Discapacidad' },
                                        { label: 'Probems', value: 'Probems' },
                                        { label: 'Salario', value: 'Salario' },
                                        { label: 'Otra beca federal', value: 'Otra beca federal' },
                                        { label: 'Beca estatal', value: 'Beca estatal' },
                                        { label: 'Beca particular', value: 'Beca particular' },
                                        { label: 'Beca internacional', value: 'Beca internacional' },
                                        { label: 'Otra', value: 'Otra' }
                                    ]}
                                    error={error.scholarship_type.error}
                                    errorMessage={error.scholarship_type.message}
                                />
                            </Col>

                            <Col lg='12' md='12' sm='12' xs='12' className='my-5'>
                                <Row>
                                    <Col className="text-end">
                                        <span className="text-muted selectable text-hover mx-3" onClick={ () => setCurrentStep(2) } >
                                            <FontAwesomeIcon icon={['fas', 'arrow-left']} style={{ fontSize: 13 }} />   Volver
                                        </span>
                                        <ButtonComponent
                                            action={validateStep3}
                                            pl={25}
                                            pr={25}
                                            textSize={20}
                                            mt={5}
                                        >
                                            Siguiente
                                        </ButtonComponent>
                                    </Col>
                                </Row>
                            </Col> 
                        </Row>
                        :
                        currentStep === 4 ?
                        <Row>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <SelectComponent
                                    label="Primera opción"
                                    value={form.specialities_by_period[0].id_speciality}
                                    onChange={(e) => {
                                        const id_speciality = parseInt(e.target.value)
                                        const newForm = { ...form }

                                        newForm.specialities_by_period[0] = {
                                            id_speciality: parseInt(e.target.value),
                                            hierarchy: 1,
                                            name: initialData.specialities.find(speciality => speciality.id_speciality === id_speciality).name
                                        }

                                        setForm(newForm)
                                    }}
                                    options={initialData.specialities.map(speciality => ({ value: speciality.id_speciality, label: speciality.name }))}
                                    error={error.speciality1.error}
                                    errorMessage={error.speciality1.message}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <SelectComponent
                                    label="Segunda opción"
                                    value={form.specialities_by_period[1].id_speciality}
                                    onChange={(e) => {
                                        const id_speciality = parseInt(e.target.value)
                                        const newForm = { ...form }

                                        newForm.specialities_by_period[1] = {
                                            id_speciality: parseInt(e.target.value),
                                            hierarchy: 2,
                                            name: initialData.specialitiesSeled.find(speciality => speciality.id_speciality === id_speciality).name
                                        }

                                        setForm(newForm)
                                    }}
                                    options={initialData.specialitiesSeled.filter(speciality => speciality.id_speciality !== form.specialities_by_period[0].id_speciality).map(speciality => ({ value: speciality.id_speciality, label: speciality.name }))}
                                    error={error.speciality2.error}
                                    errorMessage={error.speciality2.message}
                                    isDisable={form.specialities_by_period[0].id_speciality === 0}
                                />
                            </Col>
                            <Col xl='4' md='6' sm='12' xs='12' className='mt-4' >
                                <SelectComponent
                                    label="Tercera opción"
                                    value={form.specialities_by_period[2].id_speciality}
                                    onChange={(e) => {
                                        const id_speciality = parseInt(e.target.value)
                                        const newForm = { ...form }

                                        newForm.specialities_by_period[2] = {
                                            id_speciality: parseInt(e.target.value),
                                            hierarchy: 3,
                                            name: initialData.specialitiesSeled.find(speciality => speciality.id_speciality === id_speciality).name
                                        }

                                        setForm(newForm)
                                    }}
                                    options={initialData.specialitiesSeled.filter(speciality => speciality.id_speciality !== form.specialities_by_period[0].id_speciality && speciality.id_speciality !== form.specialities_by_period[1].id_speciality).map(speciality => ({ value: speciality.id_speciality, label: speciality.name }))}
                                    error={error.speciality3.error}
                                    errorMessage={error.speciality3.message}
                                    isDisable={form.specialities_by_period[0].id_speciality === 0 || form.specialities_by_period[1].id_speciality === 0}
                                />
                            </Col>
                            <Col lg='12' md='12' sm='12' xs='12' className='my-5'>
                                <Row>
                                    <Col className="text-end">
                                        <span className="text-muted selectable text-hover mx-3" onClick={ () => setCurrentStep(3) } >
                                            <FontAwesomeIcon icon={['fas', 'arrow-left']} style={{ fontSize: 13 }} />   Volver
                                        </span>
                                        <ButtonComponent
                                            action={validateStep4}
                                            pl={25}
                                            pr={25}
                                            textSize={20}
                                            mt={5}
                                        >
                                            Siguiente
                                        </ButtonComponent>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        :
                        <Row className='mt-3'>
                            <h4>¡Atención!</h4>
                            <p>
                            Su registro ha sido completado con éxito. A continuación, se le proporcionan su número de ficha y una contraseña, los cuales son esenciales para poder volver  a descargar su ficha en caso de necesitarlo. Por favor, asegúrese de guardar estos datos en un lugar seguro.
                            </p>
                            <b>
                                <p>Numero de ficha: {token.token_number}</p>
                                <p>Contraseña: {token.password}</p>
                            </b>
                            <Row>
                                <Col className='mt-5 text-center'>
                                    <span className="text-muted selectable text-hover pr-5" onClick={ () => {
                                        base64ToFile(token.token, form.curp)
                                    } } >Volver a descargar ficha
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='mt-5 text-center'>
                                    <ButtonComponent
                                        action={ () => navigate('/') }
                                        pl={25}
                                        pr={25}
                                        textSize={20}
                                        mt={5}
                                    >
                                        Regresar al inicio
                                    </ButtonComponent>
                                </Col>
                            </Row>
                        </Row>
                    }
                </Col>
            </Row>
        </Container>
    )
}