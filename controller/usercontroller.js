let usermodel = require('../model/usermodel')

async function createUser(req, res) {
    let modeldata = await usermodel.create(req.body).catch((err) => {
        return { error: err }
    })
    if (!modeldata || (modeldata && modeldata.error)) {
        let error = (modeldata && modeldata.error) ? modeldata.error : "internal server";
        return res.send({ error })
    }
    return res.send({ data: modeldata.data })
}
module.exports = { createUser }