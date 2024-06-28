export type ResponseApi<T> = {
    data: T;
    status: number;
    message : string;
    error : boolean;
};


export type Pagination<T> = {
    content: T;
    page: number;
    limit: number;
    total: number;
};