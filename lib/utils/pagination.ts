import { PaginatedData } from "../types/paginated-data";

export const getOffset = (page: number, pageSize: number) => {
    return (page - 1) * pageSize;
};

export const getPagination = <T>(
    data: T[],
    page: number,
    pageSize: number,
    total: number
): PaginatedData<T> => {
    const totalPages = Math.ceil(total / pageSize);
    return {
        data,
        page,
        pageSize,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        totalPages: totalPages,
    };
};
