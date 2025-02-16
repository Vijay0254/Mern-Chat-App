import jwt from 'jsonwebtoken'

const jwtToken = (id, res) =>{
    const token = jwt.sign({id: id}, process.env.JWT_SECRET_KEY, {expiresIn: "5d"})
   
    res.cookie("token", token, {
        maxAge: 432000000,
        httpOnly: true, //Prevents XSS Attack cross-site scripting attacks
        sameSite: "strict", //CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development"
    })

    return token
}

export default jwtToken