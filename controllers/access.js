module.exports.userOnly = (userID, paramsID) => {
    if (userID !== paramsID)
        return false
    else
        return true
}