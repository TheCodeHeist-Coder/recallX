

export const errorResponse = (res: any, statusCode: number, message: string) => {
    res.status(statusCode).json({ error: message });
};