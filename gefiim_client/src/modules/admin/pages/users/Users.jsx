import { useEffect, useState } from "react";
import { NavbarAdmin } from "../../components/NavbarAdmin"
import { ToastWarning } from "../../../../components/SweetAlertToast";

import axios from "../../../../config/http-clientt.gateway";
import { Card, Col, Pagination, Row } from "react-bootstrap";
import { ButtonComponent } from "../../../../components";
import { ButtonIconComponent } from "../../../../components/ButtonIconComponent";
import { RegisterAdminModal } from "./components/RegisterAdminModal";
import { EditAdminModal } from "./components/EditAdminModal";



export const Users = () => {
    const [users, setUsers] = useState(null);
    const [pageObject, setPageObject] = useState({
        page: 1,
        limit: 11
    });
    const [registerModal, setRegisterModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [user, setUser] = useState(null);

    const getUsers = async () => {
        try {
            const response = await axios.doGet(`user/get-page-user?page=${pageObject.page}&limit=${pageObject.limit}`);
            setUsers(response.data);
            console.log(response.data);
        } catch (error) {
            ToastWarning(error.response.data.message);
        }
    }
    const editUser = (user) => {
        setEditModal(true);
        setUser(user);
    }


    useEffect(() => {
        getUsers();
    }, [pageObject])

    const handlePrev = () => {
        if (pageObject.page > 1) {
            setPageObject({ ...pageObject, page: pageObject.page - 1 });
        }
    };

    const handleNext = () => {
        if (periods && pageObject.page < Math.ceil(periods.total / pageObject.limit)) {
            setPageObject({ ...pageObject, page: pageObject.page + 1 });
        }
    };

    return(
        <>
            <NavbarAdmin title="Administradores" />

            {
                users === null ?
                    <div className="text-center">
                        <h5>Cargando...</h5>
                    </div>
                :
                    <Row
                        style={{
                            overflowY: 'auto',
                            height: 'calc(100vh - 105px)',
                        }}
                    >
                        <Col className="text-end my-4" lg='12' md='12' sm='12' xs='12'>
                            <ButtonComponent
                                pl={40}
                                pr={40}
                                textSize={15}
                                action={ () => setRegisterModal(true) }
                            >
                                Registrar administrador
                            </ButtonComponent>
                        </Col>
                        <Col lg='12' md='12' sm='12' xs='12'>
                            <Card>
                                <div className="table-responsive" style={{ minHeight:'68vh'}}>
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Correo</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                users.content.map(user => (
                                                    <tr key={user.id_admin}>
                                                        <td>{user.username}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.status ? 'Activo' : 'Inactivo'}</td>
                                                        <td>
                                                            <ButtonIconComponent
                                                                icon='pen'
                                                                action={ () => editUser(user) }
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
                                        Array.from({ length: Math.ceil(users.total / pageObject.limit) }).map((_, index) => (
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
            <RegisterAdminModal show={registerModal} handleClose={() => setRegisterModal(false)} />
            <EditAdminModal show={editModal} handleClose={() => setEditModal(false)} admin={user} />
        </>
    )
}