module.exports = () => (req, res, next) => {
  console.log(req.user.roles);
  const role = req.user.roles;
  if(role.includes('admin')) {
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