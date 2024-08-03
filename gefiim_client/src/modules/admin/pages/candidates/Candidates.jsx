import { Card, Col, Pagination, Row } from "react-bootstrap";
import { NavbarAdmin } from "../../components/NavbarAdmin"
import { useEffect, useState } from "react";
import { InputComponent } from "../../../../components";
import { LoadAlert, ToastWarning } from "../../../../components/SweetAlertToast";
import axios from "../../../../config/http-clientt.gateway";
import { ButtonIconComponent } from "../../../../components/ButtonIconComponent";
import { useNavigate } from "react-router-dom";

export const Candidates = () => {
    const navigate = useNavigate();

    const [candidates, setCandidates] = useState(null);
    const [pageObject, setPageObject] = useState({
        page: 1,
        limit: 11
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
            LoadAlert(true)
            const response = await axios.doPost(`/candidates/get-candidate-to-edit`, { id_candidate: candidate.id_candidate });
            LoadAlert(false)

            if(response.data.status === 'active'){
                localStorage.setItem('candidate', JSON.stringify(response.data));
                navigate('/editar-candidato');
            }else{
                ToastWarning('El periodo de venta del candidato ha finalizado, ya no puede ser editado');
            }

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
                        <h5>Cargando...</h5>
                    </div>
                :
                    <Row
                        style={{
                            overflowY: 'auto',
                            height: 'calc(100vh - 105px)',
                        }}
                    >
                        <Col className="mb-2" lg='4' md='4' sm='12' xs='12'>
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
                                                    <tr key={candidate.id_candidate}>
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