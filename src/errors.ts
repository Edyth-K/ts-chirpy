export class BadRequestError extends Error {
    statusCode = 400;
}

export class UnauthorizedError extends Error {
    statusCode = 401;
}

export class ForbiddenError extends Error {
    statusCode = 403;
}

export class NotFoundError extends Error {
    statusCode = 404;
}

