import { Button } from "react-bootstrap"


export const ButtonComponent = ({ children, action, pl, pr, textSize, className }) => {
    return (
        <Button className={className} style={{ backgroundColor: 'var(--primary-color)', fontSize: textSize, paddingRight: pr, paddingLeft: pl }} onClick={action}>{children}</Button>
    )
}