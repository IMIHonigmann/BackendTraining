export function checkAuthentication(req, res, next) {
  if (!req.isAuthenticated()) {
    res.render("login", { message: "Login expired please log in again" });
    return;
  }
  next();
}
