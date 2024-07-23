export type RequestToGenerateListDto = {
    logo: string | Blob | Buffer;
    date: string,
    candidates: candidateToList[]
}

export type candidateToList = {
    full_name: string;
    no_ficha: string;
    speciality: string;
}