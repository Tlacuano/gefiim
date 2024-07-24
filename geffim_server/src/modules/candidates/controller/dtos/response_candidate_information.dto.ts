export type CandidateInformationDto = {
    status: string;
    candidate_info: CandidateDTO;
    address_info: AddressDTO;
    tutor_info: tutorDTO;
    school_info: SchoolDTO;
    speciality_selected: specialitySelectedDTO[];
}


export type CandidateDTO = {
    id_candidate: number;
    name: string;
    first_last_name: string;
    second_last_name: string;
    curp: string;
    birthdate: string;
    gender: string;
    email: string;
    id_birth_state: number;
    id_birth_municipality: number;
    phone_number: string;
    secondary_phone_number: string;
    username: string;
    id_address: number;
}

export type AddressDTO = {
    id_address: number;
    postal_code: string;
    id_state: number;
    id_municipality: number;
    neighborhood: string;
    street_and_number: string;
}

export type tutorDTO = {
    id_tutor: number;
    name: string;
    first_last_name: string;
    second_last_name: string;
    phone_number: string;
    secondary_phone_number: string;
    live_separated: boolean;
    id_address: number;
    tutor_address: AddressDTO;
}

export type SchoolDTO = {
    id_highschool: number;
    school_key: string;
    school_type: string;
    school_name: string;
    id_state: number;
    id_municipality: number;
    average_grade: number;
    has_debts: boolean;
    scholarship_type: string;
}

export type specialitySelectedDTO = {
    id_selected_speciality: number;
    id_speciality: number;
    herarchy: number;
}