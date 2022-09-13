const userModel = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports.createUser = async(req, res) => {
    const u = await userModel.exists({'username': req.body.username});
    if (u != null) {
        return res.status(409).send();
    }

    const user = new userModel({
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10)
    });
    await user.save();
    return res.status(201).redirect('/login.html');
}

module.exports.authUser = async (req, res) => {
    const user = await userModel.findOne({'username': req.body.username});
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({'user': user._id}, process.env.ACCESS_KEY)
            res.cookie('token', token);
            return res.redirect('/index.html');
        }
        return res.status(404).send("Usuário ou senha incorreto(a)")
    }
    return res.status(404).send("Usuário ou senha incorreto(a)")
} 