const getAllUsersHandler = async (request) => {
  const { db } = request.mongo;
  const result = await db.collection('users').find({}).toArray();

  return {
    status: 'success',
    data: result,
  };
};

const getUserByIdHandler = async (request, h) => {
  const { userId } = request.params;
  const { db, ObjectID } = request.mongo;

  const user = await db.collection('users').findOne({ _id: new ObjectID(userId) });

  console.log(user);
  if (user) {
    return user;
  }

  const response = h.response({
    status: 'fail',
    message: 'user tidak ditemukan',
  });

  response.code(404);
  return response;
};

const addUserHandler = async (request, h) => {
  const { db } = request.mongo;
  const {
    username, email, name, password, dateOfBirth, phoneNumber,
  } = request.payload;
  const createdAt = new Date().toISOString();

  if (!name && !email && !dateOfBirth && !username) {
    const response = h.response({
      status: 'fail',
      message: 'field tidak boleh kosong',
      data: {
        username,
        email,
        name,
        password,
        date_of_birth: dateOfBirth,
        phone_number: phoneNumber,
      },
    });

    response.code(500);
    return response;
  }

  if (password.length < 6) {
    const response = h.response({
      status: 'fail',
      message: 'password tidak boleh kurang dari 6 karakter',
    });

    response.code(500);
    return response;
  }

  const newUser = {
    username,
    email,
    name,
    password,
    date_of_birth: dateOfBirth,
    phone_number: phoneNumber,
    created_at: createdAt,
  };

  const status = await db.collection('users').insertOne(newUser);

  return status;
};

const updateUserByIdHandler = async (request) => {
  const { db, ObjectID } = request.mongo;
  const { userId } = request.params;
  const {
    name, password, dateOfBirth, phoneNumber,
  } = request.payload;

  const newUserProfile = {
    name,
    password,
    date_of_birth: dateOfBirth,
    phone_number: phoneNumber,
  };

  const status = await db.collection('users').updateOne({ _id: new ObjectID(userId) }, { $set: newUserProfile });

  return status;
};

const deleteUserByIdHandler = async (request) => {
  const { db, ObjectID } = request.mongo;
  const { userId } = request.params;

  const status = await db.collection('users').deleteOne({ _id: new ObjectID(userId) });

  return status;
};

module.exports = {
  getAllUsersHandler,
  getUserByIdHandler,
  addUserHandler,
  updateUserByIdHandler,
  deleteUserByIdHandler,
};
