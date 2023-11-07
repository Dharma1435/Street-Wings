let { sequelizeCon, QueryTypes } = require('../init/dbconfig')
let security = require('../helpers/security')


function auth(permission) {
    return async (req, res, next) => {
        let token = req.session.token;
        if (typeof token != "string") {
            return res.status(401).send("token is not found")
        }
        let decrypt = await security.decrypt(token, "1k2jk1km").catch(err => {
            return { error: err }
        })
        if (!decrypt || (decrypt && decrypt.error)) {
            return res.status(401).send("token is not matched")
        }
        console.log(decrypt)
        let query = `select user.id,user.name,permission.name as permission
                   from user
                   left join userpermission on user.id = userpermission.user_id
                   left join permission on userpermission.permission_id = permission.id
                   where user.id = '${decrypt.id}' and token = '${token}'`;

        let user = await sequelizeCon.query(query, { type: QueryTypes.SELECT }).catch((err) => {
            return { error: err }
        })

        if (!user || (user && user.error)) {

            return res.status(500).send(user.error)
        }
    
        let permissions = {}
        for (let i of user) {
            if (i.permission) {
                permissions[i.permission] = true;
            }
        }
     
        if (permissions.length <= 0 || !permissions[permission]) {
           // console.log('permissions',permissions);
            return res.redirect("/login?msg=unauthorized")
        }

        req['userData'] = {
            name: user[0].name,
            id: user[0].id,
            permissions

        }

        next();
    }

}
module.exports = { auth }