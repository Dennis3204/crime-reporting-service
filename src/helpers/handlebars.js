const ifEq = (lhs, rhs, options) => {
  return lhs === rhs ? options.fn(this) : options.inverse(this);
};

const registerHelpers = ({handlebars}) => {
  handlebars.registerHelper("ifEq", ifEq);
};

export default registerHelpers;
