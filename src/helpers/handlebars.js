function ifEq(lhs, rhs, options) {
  return lhs === rhs ? options.fn(this) : options.inverse(this);
}

const registerHelpers = ({handlebars}) => {
  handlebars.registerHelper("ifEq", ifEq);
  handlebars.registerHelper("limit", (arr, limit) => {
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, limit);
  });
};

export default registerHelpers;
