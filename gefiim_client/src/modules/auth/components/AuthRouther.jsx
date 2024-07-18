import { Route, Routes } from "react-router-dom"
import { Landing } from "../pages"
import { RegisterCandidate } from "../../guest/pages/register_candidate/RegisterCandidate"



export const AuthRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/registro" element={ <RegisterCandidate /> } />
        </Routes>
    )
}