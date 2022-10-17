const Schema = require('./schema.js');
class User {
    constructor(client){
        this.client = client;
        this.cache = new Map();
    }
    async load(){
        const users = await Schema.find({});
        users.forEach(user => {
            this.cache.set(user.userid, user);
        });
    }

    async create({userid, username, useravatar}){
        const user = await Schema.create({userid, username, useravatar});
        this.cache.set(userid, user);
        return user;
    }

    async delete(userid){
        const user = await Schema.findOne({userid});
        await user.delete();
        return this.cache.delete(user.userid);
    }

    async find(userid){
        const user = this.cache.get(userid);
        if(user) return user;
        const newUser = await Schema.findOne({userid});
        if(newUser){
            this.cache.set(userid, newUser);
            return newUser;
        }
        return null;
    }

    async update(user){
        await user.save();
        return this.cache.set(user.userid, user); 
    }
}
module.exports = User;