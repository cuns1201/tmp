const { PrismaClient } = require('@prisma/client');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const prisma = new PrismaClient();

const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (userBody.password !== userBody.repassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Repassword is not identical to password');
  }

  const saltRounds = 10;

  // eslint-disable-next-line no-param-reassign
  userBody.password = await bcrypt.hash(userBody.password, saltRounds);
  // eslint-disable-next-line no-param-reassign
  userBody.password = Buffer.from(userBody.password);

  // eslint-disable-next-line no-param-reassign
  delete userBody.repassword;

  console.log(userBody);

  const user = prisma.users.create({
    data: userBody,
  });

  return user;
};

/**
 * Create a user by emailGoogle and Sub
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUserByEmailAndSub = async (userBody) => {
  const user = prisma.users.create({
    data: {
      email: userBody.email,
      ggid: userBody.sub,
    },
  });

  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const getUserById = async (id) => {
  return prisma.users.findUnique({
    where: {
      id,
    },
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return prisma.users.findFirst({
    where: {
      email,
      ggid: null,
    },
  });
};

/**
 * Get user by email and sub
 * @param {string} email
 * @param {string} sub
 */
const getUserByEmailAndSub = async (email, sub) => {
  return prisma.users.findFirst({
    where: {
      email,
      ggid: sub,
    },
  });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, newPassword) => {
  const saltRounds = 10;
  // eslint-disable-next-line no-param-reassign
  newPassword = await bcrypt.hash(newPassword, saltRounds);
  // eslint-disable-next-line no-param-reassign
  newPassword = Buffer.from(newPassword);

  const checkUserExists = await getUserById(userId);
  if (!checkUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const user = await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      password: newPassword,
    },
  });

  return user;
};

const countMyQuestions = async (req) => {
  const questions = await prisma.questions.findMany({
    where: { uid: req.user.id },
  });

  return questions.length;
};

const getMyQuestionsPagination = async (req) => {
  const questions = await prisma.questions.findMany({
    skip: req.params.page * req.params.limit,
    take: req.params.limit,
    where: {
      uid: req.user.id,
    },
  });

  return questions;
};
const getHistoryByUId = async (req) => {
  const historyList = await prisma.bus_tickets.findMany({
    orderBy: {
      buses: {
        start_point: 'desc',
      },
    },
    skip: req.params.page * req.params.limit,
    take: req.params.limit,
    where: {
      user_id: req.user.id,
    },
    include: {
      buses: {
        include: {
          bus_operators: true,
          bus_stations_buses_end_pointTobus_stations: true,
          bus_stations_buses_start_pointTobus_stations: true,
        },
      },
    },
  });
  return historyList;
};

module.exports = {
  getHistoryByUId,
  createUser,
  createUserByEmailAndSub,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByEmailAndSub,
  updateUserById,
  countMyQuestions,
  getMyQuestionsPagination,
};
