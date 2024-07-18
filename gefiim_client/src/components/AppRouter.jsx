import { Routes, Route } from "react-router-dom"
import { Stadistics } from "../modules"
import { ProfileCandidate } from "../modules"
import { AuthRoutes } from "../modules"

export const AppRouter = ({role}) => {

    if (role !== "admin" && role !== "candidate") {
        return <AuthRoutes/>
    }

    return (
        <Routes>
            <Route path="/*" element={role === "admin" ? <Stadistics/> : <ProfileCandidate/>} />
        </Routes>        
    )
}
