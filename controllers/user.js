const userModel = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports.createUser = async(req, res) => {
    try {
        const user = new userModel({
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 10)
        });
        await user.save();
        return res.status(201).redirect('/login.html');
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports.authUser = async (req, res) => {
    const user = await userModel.findOne({'username': req.body.username});
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({'user': user._id}, process.env.ACCESS_KEY, {expiresIn: '3d'})
            res.cookie('token', token);
            return res.redirect('/portal.html');
        }
        return res.status(404).send("Usuário ou senha incorreto(a)")
    }
    return res.status(404).send("Usuário ou senha incorreto(a)")
}

module.exports.getUser = async (req, res) => {
    try {
        const userID = req.sub;
        console.log(userID)
        if (userID !== req.params.id)
            return res.status(500).send("Not authorized");
        const user = await userModel.findById(req.params.id);
        if (user != null)
            return res.status(200).send(user)
        return res.status(404).send("User not found")
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

module.exports.getPortal = async (req, res) => {
    try {
        const userID = req.sub;
        console.log(userID)
        console.log(req.params.id)
        if (userID !== req.params.id)
            return res.status(500).send("Not authorized");

        return res.status(200).send("Portal encontrado");
        //return res.status(404).send("User not found")
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

module.exports.validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.status(401).send("Cheque se a Bearer Authentication está correta.");
    
    jwt.verify(token, process.env.ACCESS_KEY, (err, docs) => {
        console.log(docs)
        if (err)
            return res.status(403).send("Token inválido.");
        req.sub = docs.user;
        next();
    });
};