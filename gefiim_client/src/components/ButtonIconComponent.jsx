import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


export const ButtonIconComponent = ({ icon, action, size, color, className }) => {
    return (
        <FontAwesomeIcon style={{ fontSize: `${size}px` }} icon={icon} onClick={action} color={color} className={`selectable ${className}`} />
    )
}