function requireAdmin(req, res, next) {
  console.log(req.user, "******");
  try {
    if (!req.user || !req.user.is_admin) {
      next({
        name: "Admin required",
        message: "Must be Admin to access",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireAdmin };
