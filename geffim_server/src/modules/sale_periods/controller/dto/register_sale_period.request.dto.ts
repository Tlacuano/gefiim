export type registerSalePeriodRequestDto = {
    id_period: number,
    start_date: Date,
    end_date: Date,
    status: string,
    speciality_by_period: {id_speciality: number, tokens_allowed: number}[]
}