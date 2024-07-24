import { useEffect, useState } from "react"
import { NavbarAdmin } from "../../components/NavbarAdmin";
import { useNavigate } from "react-router-dom";
import { EditInfoCandidate } from "./components/EditInfoCandidate";
import { EditCandidateAddress } from "./components/EditCandidateAddress";
import { Col, Row, Toast } from "react-bootstrap";
import { EditTutor } from "./components/EditTutor";
import { EditSchool } from "./components/EditShool";
import { ToastWarning } from "../../../../components/SweetAlertToast";
import { EditSelectedSpecialities } from "./components/EditSelectedSpecialities";


export const EditCandidate = () => {
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState({
        status: 'active',
        address_info: {},
        candidate_info: {},
        school_info: {},
        speciality_selected: [],
        tutor_info: {}
    });

    useEffect(() => {
        const candidate = JSON.parse(localStorage.getItem('candidate'));
        if(candidate){
            if(candidate.status === 'active'){
                setCandidate(candidate);
            }else{
                navigate('/candidatos');
                ToastWarning('El periodo de venta del candidato ha finalizado, ya no puede ser editado');
            }
        }else{
            navigate('/candidatos');
        }
    }, [])

    return(
        <>
            <NavbarAdmin title="Editar Candidato" />
            <Row
                style={{
                    maxHeight: 'calc(100vh - 110px)',
                    overflowY: 'auto',
                }}
            >
                <Col xl='12' md='12' sm='12' xs='12'>
                    <EditInfoCandidate candidate={candidate.candidate_info} />
                </Col>
                <Col xl='12' md='12' sm='12' xs='12' className='mt-3' >
                    <EditCandidateAddress address={candidate.address_info} />
                </Col>
                <Col xl='12' md='12' sm='12' xs='12' className='mt-3' >
                    <EditTutor tutor={candidate.tutor_info} />
                </Col>
                <Col xl='12' md='12' sm='12' xs='12' className='mt-3' >
                    <EditSchool school={candidate.school_info} />
                </Col>
                <Col xl='12' md='12' sm='12' xs='12' className='mt-3' >
                    <EditSelectedSpecialities selectedSpecialities={candidate.speciality_selected} />
                </Col>
            </Row>
        </>
    )
}