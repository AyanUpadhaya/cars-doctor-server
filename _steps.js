/**
 * ---------------------
 * JWT Workflow
 * ---------------------
 * CREATING JWT ON SERVER
 * 1. import jwt = require(jsonwebtoken)
 * 2. create a secret key = require('crypto').randomBytes(64).toString('hex')
 * 3. Add it .env as JWT_ACCESS_TOKEN
 * 4. Create a variable called secret = process.env.JWT_ACCESS_TOKEN
 * 5. Create a new route api /jwt to get token from api when user logins, 
 * it must be post request
 * 6. sign a token for the user const token = jwt.sign({},secret,expiration)
 * 7. send the token as a respond = res.json({token})
 * 
 * FROM CLIENT - GET THE TOKEN
 * 1. When user signs in call fetch() with jwt api, must be post request
 * 2. Then it will send current user email address in req body
 * 3. Then server will create token based on userinfo/payload,secret key,expiration time
 * 4. Server will send back the token as a json response
 * -------------------------------------
 *              VERIFY TOKEN
 * --------------------------------------
 * 
 * 1. Create a function called verifyJWT (middleware)
 * 2. this function will have three params: req, res, next 
 * 3. First check whether the authorization headers exists 
 * 4. if not send 401 
 * 5. get the token out of the authorization header
 * 6. call jwt.verify(token, secret, (err, decoded))
 * 7. if err => send 401
 * 8. set decoded to the req object so that we can retrieve it later
 * 9. call the next() to go to the next function 
 * 
 * -----------------------
 * 1. check wether token has the email that matches with the request email
*/
// vercel: https://car-doctor-server-sandy-nine.vercel.app
// client: https://cars-doctor-client-16acc.web.app/