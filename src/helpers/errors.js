export const RenderableError = class extends Error {
  constructor(message) {
    super(message);
    this.code = null;
  }
};

export const BadRequestError = class extends RenderableError {
  constructor(message = "Bad request.") {
    super(message);
    this.code = 400;
  }
};

export const UnauthorizedError = class extends RenderableError {
  constructor(message = "Unauthorized.") {
    super(message);
    this.code = 401;
  }
}

export const NotFoundError = class extends RenderableError {
  constructor(message = "Not found.") {
    super(message);
    this.code = 404;
  }
};

export const InternalServerError = class extends RenderableError {
  constructor(message = "Internal server error.") {
    super(message);
    this.code = 500;
  }
};

export const renderErrorPage = (res, error) => {
  let code = 500;
  let message = `Internal server error:\n${error.message}`;
  if (error instanceof RenderableError) {
    code = error.code;
    message = error.message;
  }
  return res.status(code).render("error", {message});
};
