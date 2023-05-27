const { nanoid } = require('nanoid');

const getAllChatsHandler = async (request) => {
  const { db } = request.mongo;
  const {
    senderId,
    receiverId,
    senderUserId,
    receiverUserId,
  } = request.query;

  // if (senderUserId || receiverUserId) {
  // return ({
  //   status: 'success',
  //   data: {
  //     chats: chats.filter((chat) => chat.sender_user_id === senderUserId
  //     || chat.sender_user_id === receiverUserId).map((chat) => ({
  //       chat_id: chat.chat_id,
  //       sender_id: chat.sender_id,
  //       receiver_id: chat.receiver_id,
  //       sender_user_id: chat.sender_user_id,
  //       receiver_user_id: chat.receiver_user_id,
  //       name: chat.name,
  //       date: chat.date,
  //       messages: chat.messages,
  //     })),
  //   },
  // });
  // }

  // if (senderId && receiverId) {
  // return ({
  //   status: 'success',
  //   data: {
  //     chats: chats.filter((chat) => chat.sender_id === senderId
  //     || chat.sender_id === receiverId)
  //       .map((chat) => ({
  //         id: chat.id,
  //         user_id: chat.user_id,
  //         date: chat.date,
  //         messages: chat.messages,
  //       })),
  //   },
  // });
  // }

  const chats = await db.collection('chats').find({}).toArray();

  return {
    status: 'success',
    data: chats,
  };
};

const getChatByIdHandler = (request) => {
  const { db, ObjectID } = request.mongo;
  const { chatId } = request.params;

  const chats = db.collection('chats').findOne({ _id: new ObjectID(chatId) });

  return {
    status: 'success',
    data: chats,
  };
};

const addChatHandler = async (request, h) => {
  const { db, ObjectID } = request.mongo;
  const {
    senderId, receiverId, text, senderUserId, receiverUserId, name,
  } = request.payload;
  const date = new Date().toISOString();
  const datePost = date.substring(10, -1);
  const timePost = date.substring(10, 24);
  console.log(timePost);

  const isDateAvailable = await db.collection('chats').find({
    date: datePost,
  }).count();

  const isTheSameSender = await db.collection('chats').find({
    $or: [
      {
        $and: [
          { sender_id: senderId },
          { receiver_id: receiverId },
        ],
      },
      {
        $and: [
          { sender_id: receiverId },
          { receiver_id: senderId },
        ],
      },
    ],
  }).count();

  if (isDateAvailable < 1 || isTheSameSender < 1) {
    const newChat = {
      chat_id: new ObjectID(),
      sender_id: senderId,
      receiver_id: receiverId,
      name,
      date: datePost,
      time: timePost,
      sender_user_id: senderUserId,
      receiver_user_id: receiverUserId,
      messages: [],
    };

    const newChats = await db.collection('chats').insertOne(newChat);

    console.log(newChats);

    const newMessages = {
      user_id: senderUserId, message_id: new ObjectID(), text, created_at: date,
    };

    const messages = await db.collection('chats').updateOne(
      {
        $or: [
          {
            $and: [
              { sender_id: senderId },
              { receiver_id: receiverId },
            ],
          },
          {
            $and: [
              { sender_id: receiverId },
              { receiver_id: senderId },
            ],
          },
        ],
        date: datePost,
      },
      { $push: { messages: newMessages } },
    );

    console.log(messages);

    const response = h.response({
      status: 'success',
      message: 'Pesan terkirim',
    });

    return response;
  }

  if (isDateAvailable > 0 && isTheSameSender > 0) {
    const newMessages = {
      user_id: senderUserId, message_id: new ObjectID(), text, created_at: date,
    };

    const messages = await db.collection('chats').updateOne(
      {
        $or: [
          {
            $and: [
              { sender_id: senderId },
              { receiver_id: receiverId },
              { date: datePost },
            ],
          },
          {
            $and: [
              { sender_id: receiverId },
              { receiver_id: senderId },
              { date: datePost },
            ],
          },
        ],
      },
      { $push: { messages: newMessages } },
    );

    console.log(messages);

    const response = h.response({
      status: 'success',
      message: 'Pesan terkirim',
    });

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Pesan tidak terkirim',
  });

  return response;
};

const deleteChatByIdHandler = async (request, h) => {
  const { db, ObjectID } = request.mongo;
  const { chatId } = request.params;

  const status = await db.collection('chats').deleteOne({ chat_id: new ObjectID(chatId) });
  console.log(status);

  const response = h.response({
    status: 'success',
    message: 'Pesan berhasil dihapus',
  });

  return response;
};

// fix get all chat by sender id
const getAllMessagesByIdHandler = (request) => {
  const { senderId } = request.params;

  // const data = chats.filter((chat) => chat.sender_id === senderId);
  // const isSuccess = chats.filter((chat) => chat.sender_id === senderId).length > 0;

  // if (isSuccess) {
  //   return {
  //     status: 'success',
  //     data: {
  //       chats: data,
  //     },
  //   };
  // }

  // const response = h.response({
  //   status: 'fail',
  //   message: 'chat tidak ditemukan',
  // });

  // return response;
};

module.exports = {
  getAllChatsHandler,
  getChatByIdHandler,
  addChatHandler,
  deleteChatByIdHandler,
  getAllMessagesByIdHandler,
};
