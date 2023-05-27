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

  if (isDateAvailable < 1) {
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
        date: datePost,
      },
      { $push: { messages: newMessages } },
    );

    console.log(messages);
  }

  if (isDateAvailable > 0) {
    const newMessages = {
      user_id: senderUserId, message_id: new ObjectID(), text, created_at: date,
    };

    const messages = await db.collection('chats').updateOne(
      {
        date: datePost,
      },
      { $push: { messages: newMessages } },
    );

    console.log(messages);
  }

  return isDateAvailable;
  // const isDateAvailable = chats.filter(
  //   (chat) => chat.date.substring(0, 10) === date.substring(0, 10),
  // ).length > 0;
  // const isTheSameSender = chats.filter((chat) => chat.sender_id === senderId
  // || chat.sender_id === receiverId).length > 0;

  // if (!isDateAvailable || !isTheSameSender) {
  //   const newChat = {
  //     chat_id: chatId,
  //     sender_id: senderId,
  //     receiver_id: receiverId,
  //     name,
  //     date,
  //     sender_user_id: senderUserId,
  //     receiver_user_id: receiverUserId,
  //     messages: [],
  //   };

  //   chats.push(newChat);

  //   const isSuccess = chats.filter((chat) => chat.chat_id === chatId).length > 0;
  //   const index = chats.findIndex(
  //     (chat) => chat.date.substring(0, 10) === date.substring(0, 10)
  //     && (chat.sender_id === senderId || chat.sender_id === receiverId),
  //   );

  //   if (isSuccess) {
  //     const messageId = nanoid(16);
  //     const createdAt = new Date().toISOString();
  //     const newMessage = {
  //       sender_user_id: senderUserId, message_id: messageId, text, created_at: createdAt,
  //     };

  //     chats[index].messages.push(newMessage);

  //     const response = h.response({
  //       status: 'success',
  //       message: 'pesan berhasil dikirimkan',
  //     });

  //     response.code(201);
  //     return response;
  //   }
  // }

  // if (isDateAvailable && isTheSameSender) {
  //   const index = chats.findIndex(
  //     (chat) => chat.date.substring(0, 10) === date.substring(0, 10)
  //     && (chat.sender_id === senderId || chat.sender_id === receiverId),
  //   );

  //   if (index !== -1) {
  //     const messageId = nanoid(16);
  //     const createdAt = new Date().toISOString();
  //     const newMessage = {
  //       user_id: senderUserId, message_id: messageId, text, created_at: createdAt,
  //     };

  //     chats[index].messages.push(newMessage);

  //     const response = h.response({
  //       status: 'success',
  //       message: 'pesan berhasil dikirimkan',
  //     });

  //     response.code(201);
  //     return response;
  //   }
  // }

  // const response = h.response({
  //   status: 'fail',
  //   message: 'pesan gagal dikirimkan',
  // });

  // response.code(500);
  // return response;
};

const deleteChatByIdHandler = (request, h) => {
  // const { chatId } = request.params;

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
