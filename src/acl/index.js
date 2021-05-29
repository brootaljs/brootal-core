const AccessControl = require('role-acl');

export default {
    async initialize(app, roleServiceName) {
        let roles = await app.services[roleServiceName].find();

        let grantsObject = {};
        roles.forEach((role) => {
            grantsObject[role._id] = {grants: role.grants};
        })

        app.acl = new AccessControl(grantsObject);
    },
    checkPermissionByUserAndRemote(app, service, user, serviceMethod, remote) {
        let roles = ['$authorized', ...(user.roles || [])];
        let actions = [serviceMethod, ...(remote.aclGroup || [])]
        return this.checkPermission(app, service, actions, roles);
    },
    async checkPermission(app, service, actions, roles) {
        for(let i=0; i<roles.length; i++) {
            for (let j=0; j<actions.length; j++) {
                try {
                    let permission = await app.acl.can(roles[i]).execute(actions[j]).on(service);
                    if (permission.granted) {
                        return permission;
                    }
                } catch (err) {
                }
            }
        }

        return {
            granted: false
        }
    }
}