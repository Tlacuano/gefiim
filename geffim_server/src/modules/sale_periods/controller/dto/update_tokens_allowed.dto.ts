

export type UpdateTokensAllowedDto = {
    id_period: number;
    speciality_by_period: SpecialityByPeriod []
}

type SpecialityByPeriod = {
    id_speciality: number;
    tokens_allowed: number;
}