export const RenderableError = class extends Error {
  constructor(message) { super(message); }
  getMessage() { throw new Error("getMessage not implemented"); }
  getCode() { throw new Error("getCode not implemented"); }
};

export const InvalidInputError = class extends RenderableError {
  getMessage() { return "Invalid input provided."; }
  getCode() { return 400; }
};

export const NotFoundError = class extends RenderableError {
  constructor(message = "Not found.") {
    super();
    this.message = message;
  }
  getMessage() { return this.message; }
  getCode() { return 404; }
};

export const renderError = (res, error) => {
  let code = 500;
  let message = "Internal server error.";
  if (error instanceof RenderableError) {
    code = error.getCode();
    message = error.getMessage();
  }
  return res.status(code).render("error", {message});
};
