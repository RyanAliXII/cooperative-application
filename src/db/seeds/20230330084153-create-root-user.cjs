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
    return queryInterface.insert(null, "account", {
      id: uuidv4(),
      given_name: GIVEN_NAME,
      surname: SURNAME,
      email: EMAIL,
      password: password,
    });
  },

  async down(queryInterface, Sequelize) {},
};
