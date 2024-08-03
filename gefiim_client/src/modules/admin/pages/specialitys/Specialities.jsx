import { useEffect, useState } from "react";
import { NavbarAdmin } from "../../components/NavbarAdmin"
import { LoadAlert, ToastWarning } from "../../../../components/SweetAlertToast";

import axios from "../../../../config/http-clientt.gateway";
import { Card, Col, Pagination, Row } from "react-bootstrap";
import { ButtonComponent, InputComponent } from "../../../../components";
import { ButtonIconComponent } from "../../../../components/ButtonIconComponent";
import { RegisterSpecialityModal } from "./components/RegisterSpecialityModal";
import { EditEspecialityModal } from "./components/EditEspecialityModal";


export const Specialities = () => {
    const [specialities, setSpecialities] = useState(null);
    const [pageObject, setPageObject] = useState({
        page: 1,
        limit: 11
    });
    const [search, setSearch] = useState('');

    const [registerModal, setRegisterModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [speciality, setSpeciality] = useState(null);


    const getSpecialities = async () => {
        try {
            const response = await axios.doPost(`/speciality/get-specialities-page?page=${pageObject.page}&limit=${pageObject.limit}`, { value: search });
            setSpecialities(response.data);

        } catch (error) {
            ToastWarning(error.response.data.message);
        }
    }

    const editSpeciality = (speciality) => {
        setSpeciality(speciality);
        setEditModal(true);
    }


    const handlePrev = () => {
        if (pageObject.page > 1) {
            setPageObject({ ...pageObject, page: pageObject.page - 1 });
        }
    };

    const handleNext = () => {
        if (specialities && pageObject.page < Math.ceil(specialities.total / pageObject.limit)) {
            setPageObject({ ...pageObject, page: pageObject.page + 1 });
        }
    };


    useEffect(() => {
        getSpecialities();
    }, [])

    useEffect(() => {
        getSpecialities();
    }, [pageObject, search])

    return (
        <>
            <NavbarAdmin title="Especialidades" />
            {
                specialities === null ?
                    <div className="text-center">
                        <h5>Cargando...</h5>
                    </div>
                    :
                    <Row
                        style={{
                            overflowY: 'auto',
                            height: 'calc(100vh - 110px)',
                        }}
                    >
                        <Col lg='4' md='4' sm='12' xs='12'>
                            <InputComponent
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Col>
                        <Col className="text-end mb-3">
                            <ButtonComponent
                                className="mt-3"
                                action={() => setRegisterModal(true)}
                                pl={40}
                                pr={40}
                                textSize={15}
                            >
                                Registrar especialidad
                            </ButtonComponent>
                        </Col>

                        <Col lg='12' md='12' sm='12' xs='12'>
                            <Card>
                                <div className="table-responsive" style={{ minHeight: '68vh' }}>
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Acronimo</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                specialities.content.map((speciality, index) => (
                                                    <tr key={index}>
                                                        <td>{speciality.name}</td>
                                                        <td>{speciality.acronym}</td>
                                                        <td>{speciality.status ? 'Activo' : 'Inactivo'}</td>
                                                        <td>
                                                            <ButtonIconComponent
                                                                icon='pen'
                                                                action={() => editSpeciality(speciality)}
                                                                size='20'
                                                                className='mx-2'
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination className="mx-5">
                                    <Pagination.Prev onClick={handlePrev} />
                                    {
                                        Array.from({ length: Math.ceil(specialities.total / pageObject.limit) }).map((_, index) => (
                                            <Pagination.Item
                                                key={index + 1}
                                                active={index + 1 === pageObject.page}
                                                onClick={() => setPageObject({ ...pageObject, page: index + 1 })}
                                            >
                                                {index + 1}
                                            </Pagination.Item>
                                        ))
                                    }
                                    <Pagination.Next onClick={handleNext} />
                                </Pagination>
                            </Card>
                        </Col>
                    </Row>
            }
            <RegisterSpecialityModal show={registerModal} handleClose={() => setRegisterModal(false)} />
            <EditEspecialityModal show={editModal} handleClose={() => setEditModal(false)} speciality={speciality} />
        </>
    )
}