const xss = require('xss')
const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  hasUserWithUserName(db, username) {
    return db('new_leaves_users')
      .where({ username })
      .first()
      .then(user => !!user)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('new_leaves_users')
      .returning('*')
      .then(([user]) => user)
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must containt 1 upper case, lower case, number, and special character'
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return {
      id: user.id,
      fullname: xss(user.fullname),
      username: xss(user.username),
      date_created: new Date(user.date_created),
    }
  },

  getAllUsers(knex) {
    return knex.select('*').from('new_leaves_users')
  },
  // insertUser(knex, newUser) {
  //   return knex
  //     .insert(newUser)
  //     .into('new_leaves_users')
  //     .returning('*')
  //     .then(rows => {
  //       return rows[0]
  //     })
  // },
  getById(knex, id) {
    return knex
      .from('new_leaves_users')
      .select('*')
      .where('id', id)
      .first()
  },
  deleteUser(knex, id) {
    return knex('new_leaves_users')
      .where({ id })
      .delete()
  },
  updateUser(knex, id, newUserFields) {
    return knex('new_leaves_users')
      .where({ id })
      .update(newUserFields)
  },
}

module.exports = UsersService
