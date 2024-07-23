import { Card, Col, Pagination, Row } from "react-bootstrap";
import { NavbarAdmin } from "../../components/NavbarAdmin"
import { useEffect, useState } from "react";
import { InputComponent } from "../../../../components";
import { ToastWarning } from "../../../../components/SweetAlertToast";
import axios from "../../../../config/http-clientt.gateway";
import { ButtonIconComponent } from "../../../../components/ButtonIconComponent";

export const Candidates = () => {
    const [candidates, setCandidates] = useState(null);
    const [pageObject, setPageObject] = useState({
        page: 1,
        limit: 14
    });
    const [search, setSearch] = useState('');

    const getCandidates = async () => {
        try {
            const response = await axios.doPost(`/candidates/get-candidates-page?page=${pageObject.page}&limit=${pageObject.limit}`, { value: search });
            setCandidates(response.data);

            console.log(response.data);
        } catch (error) {
            ToastWarning(error.response.data.message);
        }
    }

    const editCandidate = async (candidate) => {
        try {
            console.log(candidate);
            // const response = await axios.doPut(`/speciality/update-speciality/${speciality.id}`, speciality);
            // ToastSuccess(response.data.message);
            // getSpecialities();
        } catch (error) {
            ToastWarning(error.response.data.message);
        }
    }

    const handlePrev = () => {
        if (pageObject.page > 1) {
            setPageObject({ ...pageObject, page: pageObject.page - 1 });
        }
    };

    const handleNext = () => {
        if (specialities && pageObject.page < Math.ceil(candidates.total / pageObject.limit)) {
            setPageObject({ ...pageObject, page: pageObject.page + 1 });
        }
    };


    useEffect(() => {
        getCandidates();
    }, [search, pageObject])

    return(
        <>
            <NavbarAdmin title="Candidatos" />
            {
                candidates === null ?
                    <div className="text-center">
                        <h1>Cargando...</h1>
                    </div>
                :
                    <Row>
                        <Col className="mb-3" lg='4' md='4' sm='12' xs='12'>
                            <InputComponent
                                label='Buscar por CURP o No. de ficha'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Col>

                        <Col lg='12' md='12' sm='12' xs='12'>
                            <Card>
                                <div className="table-responsive" style={{ minHeight: '68vh' }}>
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>No. ficha</th>
                                                <th>Nombre Completo</th>
                                                <th>CURP</th>
                                                <th>Correo</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                candidates.content.map((candidate) => (
                                                    <tr key={candidate.id}>
                                                        <td>{candidate.username}</td>
                                                        <td>{candidate.name} {candidate.first_last_name} {candidate.second_last_name}</td>
                                                        <td>{candidate.curp}</td>
                                                        <td>{candidate.email}</td>
                                                        <td>
                                                            <ButtonIconComponent
                                                                icon='pen'
                                                                action={() => editCandidate(candidate)}
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
                                        Array.from({ length: Math.ceil(candidates.total / pageObject.limit) }).map((_, index) => (
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
        </>
    )
}