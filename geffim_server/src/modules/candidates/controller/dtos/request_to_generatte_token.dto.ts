export type requestToGenarateTokenDTO = {
    token: string;
    speciality_1: string;
    speciality_2: string;
    speciality_3: string;

    name: string;
    first_last_name: string;
    second_last_name: string;
    curp: string;
    birthdate: string;
    gender: string;
    email: string;

    phone_number: string;
    secondary_phone_number: string;

    candidate_postal_code: string;
    candidate_state: string;
    candidate_municipality: string;
    candidate_neighborhood: string;
    candidate_street_and_number: string;

    // tutors
    
    tutor_name: string;
    tutor_first_last_name: string;
    tutor_second_last_name: string;
    tutor_live_separated: boolean,

    tutor_phone_number: string;
    tutor_secondary_phone_number: string;

    // tutor address
    tutor_postal_code?: string;
    tutor_municipality?: string;
    tutor_state?: string;
    tutor_neighborhood?: string;
    tutor_street_and_number?: string;

    
    // highschool information
    school_key: string;
    school_type: string;
    school_name: string;
    school_state: string;
    school_municipality: string;
    average_grade: string;
    has_debts: boolean,
    scholarship_type: string;
    

    // bank information
    bank_name: string;
    bank_account: string;
    bank_clabe: string;
    concept: string;
    amount: string;
}