export const http = {
  INVALID_REQUEST_ORIGIN: {
    message: "Invalid request origin",
    status: 403,
  },
  UNAUTHORIZED: {
    message: "Unauthorized",
    status: 401,
  },
  FORBIDDEN: {
    message: "Forbidden",
    status: 403,
  },
  NOT_FOUND: {
    message: "Not Found",
    status: 404,
  },
  BAD_REQUEST: {
    message: "Bad Request",
    status: 400,
  },
  INTERNAL_SERVER_ERROR: {
    message: "Internal Server Error",
    status: 500,
  },
  TOO_MANY_REQUESTS: {
    message: "Too Many Requests",
    status: 429,
  },
  UNPROCESSABLE_ENTITY: {
    message: "Unprocessable Entity",
    status: 422,
  },
  SUCCESS: {
    message: "Success",
    status: 200,
  },
  CONFLICT: {
    message: "Conflict",
    status: 409,
  },
};
