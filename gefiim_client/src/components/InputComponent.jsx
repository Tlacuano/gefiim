import { Form } from "react-bootstrap"


export const InputComponent = ({ label, name, value, onChange, type, error, errorMessage }) => {
    return (
        <>
            <Form.Group>
                <Form.Label>{label}</Form.Label>
                <Form.Control 
                    name={name}
                    value={value}
                    onChange={onChange}
                    type={type}
                    isInvalid={error}
                />
                <Form.Control.Feedback type="invalid">
                    {errorMessage}
                </Form.Control.Feedback> 
            </Form.Group> 
        </>
    )
}