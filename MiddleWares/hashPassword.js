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

// module.exports.ComparePassword = (request, response, next) => {
//     bcrypt.compare(request.body.password, hash)
//     .then(function(result) {
//         if(result == true){
//             next()
//         }
//         else{
//             next(new Error("password unmatched"))
//         }
//     });
// }