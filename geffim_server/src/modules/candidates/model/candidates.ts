export type Candidate = {
    id_candidate: number,
    name: string,
    first_last_name: string,
    second_last_name: string,
    curp: string,
    birthdate: Date,
    gender: string,
    email: string,
    id_birth_municipality: number,
    phone_number: string,
    secondary_phone_number: string,
    
    // address
    candidate_id_address: number,
    candidate_postal_code: string,
    candidate_id_municipality: number,
    candidate_neighborhood: string,
    candidate_street_and_number: string,

    // tutorsñ
    tutor_id_tutor: number,
    tutor_name: string,
    tutor_first_last_name: string,
    tutor_second_last_name: string,
    tutor_phone_number: string,
    tutor_secondary_phone_number: string,
    tutor_live_separated: boolean,

    // tutor address
    tutor_id_address: number,
    tutor_postal_code: string,
    tutor_id_municipality: number,
    tutor_neighborhood: string,
    tutor_street_and_number: string,

    // highschool information
    id_highschool: number,
    school_key: string,
    school_type: string,
    school_name: string,
    school_id_municipality: number,
    average_grade: number,
    has_debts: boolean,
    scholarship_type: string,

    // user
    username: string,
    password: string,

    specialities_by_period:[
        {
            id_speciality: number,
            hierarchy: number,
            name: string,
        },
        {
            id_speciality: number,
            hierarchy: number,
            name: string,
        },
        {
            id_speciality: number,
            hierarchy: number,
            name: string,
        }
    ],
    id_period: number,
};