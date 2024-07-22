import { NavbarAdmin } from "../../components/NavbarAdmin"
import { ToastWarning } from "../../../../components/SweetAlertToast";
import { useEffect, useState } from "react";
import axios from "../../../../config/http-clientt.gateway";
import { Row } from "react-bootstrap";



export const InstitutionalInformation = () => {

    const [institutionalInformation, setInstitutionalInformation] = useState(null);

    const getInstitutionalInformation = async () => {
        try {
            const response = await axios.doGet('/institutional-information/get-institutional-information')

            setInstitutionalInformation(response.data)
        } catch (error) {
            ToastWarning(error.response.data.message)
        }
    }

    useEffect(() => {
        getInstitutionalInformation()
    }, [])

    return (
        <>
            <NavbarAdmin title="Información institucional" />
            {
                institutionalInformation === null ?
                <div className="text-center">
                    <h1>Cargando...</h1>
                </div>
                :
                <Row>
                    
                </Row>
            }
        </>
    )
}