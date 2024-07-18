import { Col, Row } from "react-bootstrap"


export const Stepper = ({ steps, currentStep }) => {
    return (
        <>
            <Row className="justify-content-center my-2">
                <Col xs={12} className="d-flex py-4" style={{ backgroundColor: '#F7F7F7', padding: '10px', borderRadius: '5px' }}>
                    {steps.map((step, index) => (
                        <div key={index} className="d-flex align-items-center ">
                            <div
                                className={`step-circle ${index <= currentStep ? 'active' : ''}`}
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    backgroundColor: index <= currentStep ? 'var(--primary-color)' : '#fff',
                                    border: '2px solid var(--primary-color)',
                                    color: index <= currentStep ? 'var(--text-color-primary)' : 'var(--primary-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}
                            >
                                {index + 1}
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className="step-line"
                                    style={{
                                        width: '50px',
                                        height: '2px',
                                        backgroundColor: '#000',
                                        margin: '0 10px'
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <h3>
                        {steps[currentStep]}
                    </h3>
                </Col>
            </Row>
        </>
    )
}