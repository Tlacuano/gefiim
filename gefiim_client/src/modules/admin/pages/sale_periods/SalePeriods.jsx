import { useEffect, useState } from "react";
import { NavbarAdmin } from "../../components/NavbarAdmin";
import { LoadAlert, ToastWarning } from "../../../../components/SweetAlertToast";
import axios from "../../../../config/http-clientt.gateway";
import { Card, Col, Pagination, Row } from "react-bootstrap";
import { ButtonComponent } from "../../../../components";
import { ButtonIconComponent } from "../../../../components/ButtonIconComponent";
import { EditSalePeriodModal } from "./components/EditSalePeriodModal";
import { RegisterPeriodModal } from "./components/RegisterPeriodModal";

export const SalePeriods = () => {
    const [periods, setPeriods] = useState(null);
    const [pageObject, setPageObject] = useState({
        page: 1,
        limit: 10
    });
    
    const [EditModal, setEditModal] = useState(false);
    const [period, setPeriod] = useState(null);

    const [registerModal, setRegisterModal] = useState(false);


    const editSalePeriod = (period) => {
        setEditModal(true);
        setPeriod(period);
    };

    const getPeriods = async (page = 1, limit = 10) => {
        try {
            LoadAlert(true);
            const response = await axios.doGet(`/sale-period/get-sale-period-page?page=${page}&limit=${limit}`);
            setPeriods(response.data);
            LoadAlert(false);

            console.log(response.data);
        } catch (error) {
            LoadAlert(false);
            ToastWarning(error.response.data.message);
        }
    };

    useEffect(() => {
        getPeriods(pageObject.page, pageObject.limit);
    }, [pageObject]);

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

    return (
        <>
            <NavbarAdmin title="Periodos de venta" />
            {
                periods === null ? (
                    <div className="text-center">
                        <h1>Cargando...</h1>
                    </div>
                ) : (
                    <Row>
                        <Col className="text-end my-4" lg='12' md='12' sm='12' xs='12'>
                            <ButtonComponent
                                pl={40}
                                pr={40}
                                textSize={20}
                                action={ () => setRegisterModal(true) }
                            >
                                Registrar periodo
                            </ButtonComponent>
                        </Col>
                        <Col lg='12' md='12' sm='12' xs='12'>
                            <Card>
                                <div className="table-responsive" style={{ minHeight:'68vh'}}>
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Fecha de inicio</th>
                                                <th>Fecha de fin</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                periods.content.map((period, index) => (
                                                    <tr key={index}>
                                                        <td>{period.start_date_string}</td>
                                                        <td>{period.end_date_string}</td>
                                                        <td>{period.status === 'active' ? 'Activo' 
                                                                : period.status === 'pending' ? 'Pendiente'
                                                                : period.status === 'canceled' ? 'Cancelado'
                                                                : period.status === 'finalized' && 'Finalizado'}</td>
                                                        <td>
                                                            <ButtonIconComponent
                                                                icon='pen'
                                                                action={ () => editSalePeriod(period) }
                                                                size='20'
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
                                        Array.from({ length: Math.ceil(periods.total / pageObject.limit) }).map((_, index) => (
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
                )
            }

            <EditSalePeriodModal show={EditModal} handleClose={() => setEditModal(false) } salePeriod={period}/>
            <RegisterPeriodModal show={registerModal} handleClose={() => setRegisterModal(false)} />
        </>
    );
};
