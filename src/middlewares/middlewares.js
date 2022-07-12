export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Jessie Cat";
    res.locals.login = req.session.login;
    res.locals.userDTO = req.session.userDTO;
    console.log(res.locals);
    next();
}