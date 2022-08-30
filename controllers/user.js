const userModel = require('../models/user')
const bcrypt = require('bcrypt');


module.exports.createUser = async(req, res) => {
    const user = new userModel({
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10)
    });
    const userSaved = await user.save();
    return res.send(userSaved);
}

module.exports.authUser = async (req, res) => {
    const user = await userModel.findOne({'username': req.body.username});
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password))
            return res.send("usuário logado")
        return res.send("usuário encontrado, mas não logado")
    }
    return res.send("usuário não logado")
}