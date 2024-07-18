import { Button } from "react-bootstrap"


export const ButtonComponent = ({ children, action, pl, pr, textSize }) => {
    return (
        <Button style={{ backgroundColor: 'var(--primary-color)', fontSize: textSize, paddingRight: pr, paddingLeft: pl }} onClick={action}>{children}</Button>
    )
}