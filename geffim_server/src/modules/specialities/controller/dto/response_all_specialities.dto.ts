import { Speciality } from "../../model/speciality";

export type ResponseAllSpecialitiesDto = {
    specialitiesActive: Speciality[];
    specialitiesInactive: Speciality[];
}