export type stadistics = {
    total_tokens_autorized: number,
    total_tokens_registered: number,
    stadistics_by_speciality: stadisticsBySpeciality[]
}

export type stadisticsBySpeciality = {
    speciality: string,
    total_tokens: number,
    not_payed_count: number,
    payed_count: number,
    percentage_payed: number,
    registered_count: number
}