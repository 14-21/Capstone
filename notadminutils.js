function requireNotAdmin(req, res, next) {
    console.log(req.user);
    try {
      if (req.user && req.user.is_admin) {
        next({
          name: "Unauthorized",
          message: "Admin users are not allowed to access this.",
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  }

  module.exports = { requireNotAdmin }