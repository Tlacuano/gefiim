import { useState } from "react";
import { Modal, Row, Col, Alert } from "react-bootstrap";
import { ButtonComponent, InputComponent } from "../../../../../components";
import { ToastWarning, ToastSuccess, LoadAlert } from "../../../../../components/SweetAlertToast";
import axios from '../../../../../config/http-clientt.gateway'

export const ResetPassword = ({ show, handleClose }) => {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState({
        username: { error: false, message: '' },
        code: { error: false, message: '' },
        newPassword: { error: false, message: '' },
        confirmPassword: { error: false, message: '' }
    });

    const validateStep1 = async () => {
        let newErrors = { ...errors };
        let valid = true;

        if (!username) {
            newErrors.username = { error: true, message: 'El nombre de usuario no puede estar vacío' };
            valid = false;
        }

        setErrors(newErrors);
        if (!valid) return;

        try {
            LoadAlert(true);
            const response = await axios.doPost('/auth/send-code', { username });
            LoadAlert(false);
            if (response.data) {
                ToastSuccess("Código de verificación enviado con éxito");
                setStep(2);
            }
        } catch (error) {
            LoadAlert(false);
            ToastWarning(error.response.data.message);
        }
    };

    const validateStep2 = async () => {
        let newErrors = { ...errors };
        let valid = true;

        if (!code) {
            newErrors.code = { error: true, message: 'El código no puede estar vacío' };
            valid = false;
        }

        setErrors(newErrors);
        if (!valid) return;

        try {
            LoadAlert(true);
            const response = await axios.doPost('/auth/check-code', { username, code });
            LoadAlert(false);
            if (response.data) {
                ToastSuccess("Código verificado con éxito");
                setStep(3);
            }
        } catch (error) {
            LoadAlert(false);
            ToastWarning(error.response.data.message);
        }
    };

    const validateStep3 = async () => {
        let newErrors = { ...errors };
        let valid = true;

        if (!newPassword) {
            newErrors.newPassword = { error: true, message: 'La contraseña no puede estar vacía' };
            valid = false;
        } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(newPassword)) {
            newErrors.newPassword = { error: true, message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número' };
            valid = false;
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = { error: true, message: 'Las contraseñas no coinciden' };
            valid = false;
        }

        setErrors(newErrors);
        if (!valid) return;

        try {
            LoadAlert(true);
            const response = await axios.doPost('/auth/change-password', { username, newPassword });
            LoadAlert(false);
            if (response.data) {
                ToastSuccess("Contraseña actualizada con éxito");
                handleClose();
            }
        } catch (error) {
            LoadAlert(false);
            ToastWarning(error.response.data.message);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Recuperar contraseña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 && (
                    <Row>
                        <Col>
                            <InputComponent
                                label="Nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                error={errors.username.error}
                                errorMessage={errors.username.message}
                            />
                        </Col>
                    </Row>
                )}
                {step === 2 && (
                    <Row>
                        <Col>
                            <InputComponent
                                label="Código de verificación"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                error={errors.code.error}
                                errorMessage={errors.code.message}
                            />
                        </Col>
                    </Row>
                )}
                {step === 3 && (
                    <Row>
                        <Col xs={12} lg={12} md={12} sm={12}>
                            <Alert variant='light'>
                                La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula y un numero
                            </Alert>
                        </Col>
                        <Col>
                            <InputComponent
                                label="Nueva contraseña"
                                value={newPassword}
                                type="password"
                                onChange={(e) => setNewPassword(e.target.value)}
                                error={errors.newPassword.error}
                                errorMessage={errors.newPassword.message}
                            />
                        </Col>
                        <Col>
                            <InputComponent
                                label="Confirmar contraseña"
                                value={confirmPassword}
                                type="password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={errors.confirmPassword.error}
                                errorMessage={errors.confirmPassword.message}
                            />
                        </Col>
                    </Row>
                )}
            </Modal.Body>
            <Modal.Footer>
                <ButtonComponent action={() => {
                    if (step === 1) validateStep1();
                    else if (step === 2) validateStep2();
                    else if (step === 3) validateStep3();
                }}>
                    {step === 1 && "Enviar código"}
                    {step === 2 && "Verificar código"}
                    {step === 3 && "Cambiar contraseña"}
                </ButtonComponent>
            </Modal.Footer>
        </Modal>
    );
};
