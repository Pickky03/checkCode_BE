// utils/query.ts

export const getPagination = (
    pageValue?: string | number,
    limitValue?: string | number,
    defaultLimit = 10
) => {
    const page = Math.max(Number(pageValue) || 1, 1);
    const limit = Math.max(Number(limitValue) || defaultLimit, 1);

    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip,
    };
};

export const getPaginationMeta = (
    total: number,
    page: number,
    limit: number
) => {
    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

export const buildSearchFilter = (
    search: unknown,
    fields: string[]
) => {
    if (
        typeof search !== "string" ||
        !search.trim()
    ) {
        return {};
    }

    const keyword = search.trim();

    return {
        $or: fields.map((field) => ({
            [field]: {
                $regex: keyword,
                $options: "i",
            },
        })),
    };
};