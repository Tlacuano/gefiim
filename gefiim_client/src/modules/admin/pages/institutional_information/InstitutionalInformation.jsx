import { NavbarAdmin } from "../../components/NavbarAdmin"
import { LoadAlert, SweetAlert, ToastSuccess, ToastWarning } from "../../../../components/SweetAlertToast";
import { useEffect, useState } from "react";
import axios from "../../../../config/http-clientt.gateway";
import { Card, CardBody, Col, Row } from "react-bootstrap";
import { ButtonComponent, InputComponent } from "../../../../components";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";



export const InstitutionalInformation = () => {
    const [institutionalInformation, setInstitutionalInformation] = useState({
        name: '',
        primary_color: '',
        secondary_color: '',
        logo: '',
        main_image: '',
    });

    const [previewLogo, setPreviewLogo] = useState('');
    const [previewMainImage, setPreviewMainImage] = useState('');


    const getInstitutionalInformation = async () => {
        try {
            const response = await axios.doGet('/institutional-information/get-institutional-information')
            setInstitutionalInformation(response.data)
            setPreviewLogo('data:image/png;base64,' + response.data.logo)
            setPreviewMainImage('data:image/png;base64,' + response.data.main_image)
        } catch (error) {
            ToastWarning(error.response.data.message)
        }
    }

    const saveInstitutionalInformation = async () => {
        SweetAlert(
            'question',
            '¿Estás seguro de guardar los cambios?',
            'Una vez guardados se verán reflejados en la página',
            'Si, guardar',
            async () => {
                try {
                    const payload = { ...institutionalInformation }
                    payload.logo = `data:image/png;base64,${institutionalInformation.logo}`
                    payload.main_image = `data:image/png;base64,${institutionalInformation.main_image}`

                    LoadAlert(true)
                    const response = await axios.doPost('/institutional-information/update-institutional-information', payload)
                    LoadAlert(false)

                    if (response.data) {
                        ToastSuccess('Información institucional actualizada correctamente')

                        setTimeout(() => {
                            window.location.href = '/informacion-institucional'
                        }, 1500)
                    }
                    
                } catch (error) {
                    LoadAlert(false)
                    ToastWarning(error.response.data.message)
                }
            }
        )
    }


    useEffect(() => {
        getInstitutionalInformation()
    }, [])

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

        if (!validImageTypes.includes(file.type)) {
            ToastWarning('El archivo seleccionado no es una imagen');
            e.target.value = null;
            return;
        }

        reader.onloadend = () => {
            setPreviewLogo(reader.result);
            setInstitutionalInformation({ ...institutionalInformation, logo: reader.result.split(',')[1] });
        }
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

        if (!validImageTypes.includes(file.type)) {
            ToastWarning('El archivo seleccionado no es una imagen');
            e.target.value = null;
            return;
        }

        reader.onloadend = () => {
            setInstitutionalInformation({ ...institutionalInformation, main_image: reader.result.split(',')[1] });
        }
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    return (
        <>
            <NavbarAdmin title="Información institucional" />
            {
                institutionalInformation === null ?
                <div className="text-center">
                    <h1>Cargando...</h1>
                </div>
                :
                <Row
                    style={{
                        overflowY: 'auto',
                        height: 'calc(100vh - 110px)',
                    }}
                >
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col lg={6} md={6} sm={12} xs={12}>
                                        <Row>
                                            <Col lg={12} md={12} sm={12} xs={12}>
                                                <InputComponent
                                                    label="Nombre de la institución"
                                                    value={institutionalInformation.name}
                                                    onChange={(e) => setInstitutionalInformation({ ...institutionalInformation, name: e.target.value })}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mt-5">
                                            <Col lg={6} md={6} sm={6} xs={6}>
                                                <InputComponent
                                                    label="Color primario"
                                                    type="color"
                                                    value={institutionalInformation.primary_color}
                                                    onChange={(e) => setInstitutionalInformation({ ...institutionalInformation, primary_color: e.target.value })}
                                                />
                                            </Col>
                                            <Col lg={6} md={6} sm={6} xs={6}>
                                                <InputComponent
                                                    label="Color secundario"
                                                    type="color"
                                                    value={institutionalInformation.secondary_color}
                                                    onChange={(e) => setInstitutionalInformation({ ...institutionalInformation, secondary_color: e.target.value })}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} xs={12}>
                                        <InputComponent
                                            label="Logo de la institución"
                                            type="file"
                                            onChange={handleLogoChange}
                                        />

                                        <div className="text-center mt-5">
                                            <img src={'data:image/png;base64,'+ institutionalInformation.logo} alt="Logo"style={{maxHeight:'200px'}}/>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="mt-5">
                                    <Col lg={12} md={12} sm={12} xs={12}>
                                        <InputComponent
                                            style={{
                                                width: '50%',
                                            }}
                                            label="Imagen principal"
                                            type="file"
                                            onChange={handleMainImageChange}
                                        />
                                        <div className="text-center mt-5">
                                            <img src={'data:image/png;base64,'+ institutionalInformation.main_image} alt="Imagen principal"style={{maxHeight:'400px'}}/>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="mt-5">
                                    <Col lg={12} md={12} sm={12} xs={12} className="text-end">
                                        <ButtonComponent
                                            textSize={20}
                                            action={ saveInstitutionalInformation }
                                        >
                                            Guardar cambios
                                        </ButtonComponent>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            }
        </>
    )
}