import React from 'react';
import { Form } from 'react-bootstrap';

export const SelectComponent = ({ label, name, value, onChange, options, error, errorMessage, isDisable }) => {
    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                as="select"
                name={name}
                value={value}
                onChange={onChange}
                isInvalid={error}
                disabled={isDisable}
            >
                <option value="">Seleccione una opción</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                {errorMessage}
            </Form.Control.Feedback>
        </Form.Group>
    );
};
