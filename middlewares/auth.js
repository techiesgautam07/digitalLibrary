const jwt = require('jsonwebtoken');



//Authorisation Middleware
function authorize(req, res, next) {
    const { token } = req.headers;
    if (!token) {
        return res.status(401).json({ error: "Please Signin first" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Signin Expired" });
        }
        req.user = decoded;
        next();
    });
}

module.exports = { authorize }
