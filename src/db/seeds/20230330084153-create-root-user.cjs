"use strict";
/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const EMAIL = process.env.ROOT_USER_EMAIL;
const PASSWORD = process.env.ROOT_USER_PASSWORD;
const GIVEN_NAME = process.env.ROOT_USER_GIVEN_NAME;
const SURNAME = process.env.ROOT_USER_SURNAME;

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash(PASSWORD, 5);
    const id = uuidv4();
    return queryInterface.sequelize.query(
      `INSERT INTO account(id, given_name, surname,email, password)VALUES(:id, :givenName, :surname, :email, :password) ON CONFLICT DO NOTHING`,
      {
        replacements: {
          id: id,
          givenName: GIVEN_NAME,
          surname: SURNAME,
          email: EMAIL,
          password: password,
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {},
};
