export const RenderableError = class extends Error {
  constructor(message) {
    super(message);
    this.code = 500;
  }
};

export const BadRequestError = class extends RenderableError {
  constructor(message = "Bad request.") {
    super(message);
    this.code = 400;
  }
};

export const NotFoundError = class extends RenderableError {
  constructor(message = "Not found.") {
    super(message);
    this.code = 404;
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
