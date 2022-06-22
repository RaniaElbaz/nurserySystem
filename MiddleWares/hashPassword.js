const bcrypt = require('bcrypt');

module.exports.hashPassword = (request, response, next) => {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(request.body.password, salt)
        .then(function(hash) {
            request.body.password = hash;
            next();
        })
        .catch(error => next(error))
    });
}
