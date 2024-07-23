export type CandidateInformationDto = {
    candidate_info:{}
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