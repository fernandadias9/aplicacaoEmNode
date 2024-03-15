const knex = require('../database/knex');
const { hash, compare } = require("bcryptjs");
const appError = require('../utils/appError.js');

class UserController {
  async create (request, response) {
    const { name, email, password } = request.body;

    const userExists = await knex("users").where({ email }).first();
     
      if(userExists) {
        throw new AppError("Este email já está sendo usado.");
      }

    const hashedPassword = await hash(password, 8);

    const[user_id] = await knex("users").insert({
      name,
      email,
      password: hashedPassword
    })

    return response.json();
  }  

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const user = await knex("users").where({ id }).first();

    if(!user) {
      throw new AppError("Usuário não encontrado.")
    }

    if(email){
      const userWithUpdatedEmail = await knex("users").where({ email }).first();
      if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
        throw new AppError("Este email já está em uso.")
      }
    }


    user.name = name ?? user.name; //nullish operator, para que caso não seja informado nome e/ou email não troque para NULL
    user.email = email ?? user.email;

    if(password && !old_password) {
      throw new AppError("É necessário informar a senha antiga para redefinir a nova senha.")
    }

    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if(!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      user.password = await hash(password, 8);
  }

    await knex("users").where({ id }).update({
      name: name, 
      email: email,
      password: user.password
    })

    return response.json();
  }
}

module.exports = UserController;