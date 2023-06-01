const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/public\/restUploads(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/public\/userUploads(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS','POST'] },
            {url: /\/api\/v1\/restaurants(.*)/ , methods: ['GET', 'OPTIONS','POST'] },
            {url: /\/api\/v1\/riders(.*)/ , methods: ['GET', 'OPTIONS','POST'] },
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
            {url: /\/api\/v1\/users(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
            {url: /\/api\/v1\/trips(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
            `${api}/users/login`,
            `${api}/users/register`,
            `${api}/restaurants/register`,
            `${api}/riders/register`,
            // `${api}/resturants/`,
        ]
    })
}

async function isRevoked(req, payload, done) {
    if(!payload.isAdmin) {
        done(null, true)
    }

    done();
}



module.exports = authJwt