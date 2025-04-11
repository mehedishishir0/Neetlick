const Converstion = require("../models/converstionModel");
const Message = require("../models/messageModel");
const { successResponse } = require("../response/response");

exports.sendMessage = async (req, res, next) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;
    const { message } = req.body;

    let conversation = await Converstion.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Converstion.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) conversation.messages.push(newMessage);
    await Promise.all([conversation.save()]);

    successResponse(res, {
      statusCode: 201,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessage = async (req, res, next) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;
    const conversation = await Converstion.find({
      participants: { $all: [senderId , receiverId] },
    });
    if (!conversation) {
      successResponse(res, {
        statusCode: 200,
        message: [],
      });
    }
    successResponse(res, {
      statusCode: 200,
      message: conversation?.messages,
    });
  } catch (error) {
    next(error);
  }
};
