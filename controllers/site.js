const siteModel = require('../models/site')
const jwt = require('jsonwebtoken');
const access = require('./access')

function getUniqueName(baseName) {
    return baseName.trim().toLowerCase().replace(/\s+/g, '-');
}

function getToken(token) {
    return jwt.verify(token, process.env.ACCESS_KEY);
}

module.exports.createSite = async(req, res) => {
    const uniqueName = getUniqueName(req.body.name);
    const s = await siteModel.exists({'uniqueName': uniqueName});
    if (s != null) {
        return res.status(409).send('Site with same name already exists');
    }

    const decodedToken = getToken(req.body.token);
    
    allowed = access.userOnly(decodedToken.user, req.params.id)
    if (!allowed)
        return res.status(500).send("Not authorized");

    const site = new siteModel({
        name: req.body.name,
        uniqueName: uniqueName,
        user: decodedToken.user,
        host: false
    });
    const siteCreated = await site.save();
    return res.status(201).send(siteCreated);
}

module.exports.deleteSite = (req, res) => {
    const decodedToken = getToken(req.body.token);
    allowed = access.userOnly(decodedToken.user, req.params.userID)
    if (!allowed)
        return res.status(500).send("Not authorized");

    siteModel.findByIdAndDelete(req.params.id).then(docs => {
        if (docs == null)
            return res.status(404).send("Site not found")
        else
            return res.status(201).send("Site was deleted");
    })
}

module.exports.editSiteName = (req, res) => {
    if ('name' in req.body) {
        let uniqueName = getUniqueName(req.body.name)
        req.body['uniqueName'] = uniqueName
    }

    const decodedToken = getToken(req.body.token);
    allowed = access.userOnly(decodedToken.user, req.params.userID)
    if (!allowed)
        return res.status(500).send("Not authorized");

    siteModel.findByIdAndUpdate(req.params.id, req.body, (err, docs) => {
        if (docs == null)
            return res.status(404).send("Site not found")
        else
            return res.status(201).send("Site was updated");
    });
}