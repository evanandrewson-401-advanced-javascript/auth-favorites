module.exports = () => (req, res, next) => {
  const role = payload.roles;
  if(role === 'admin') {
    next();
  } else {
    throw new Error(
      {
         statusCode: 401,
         error: 'Need admin access'
       }
    )
    .catch(next)
  }
};