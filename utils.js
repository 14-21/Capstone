function requireUser(req, res, next) {
  console.log(req.user);
  try {
    if (!req.user) {
      next({
        name: "Authentication Required",
        message: "No Authorized Token Found",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireUser };
