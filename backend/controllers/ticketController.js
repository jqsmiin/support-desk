const asyncHandler = require("express-async-handler");
const User = require("../modles/userModel");
const Ticket = require("../modles/ticketModal");

exports.getTickets = asyncHandler(async (req, res) => {
  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const tickets = await Ticket.find({ user: req.user.id });

  res.status(200).json({
    status: "success",
    results: tickets.length,
    tickets,
  });
});
exports.getTicket = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  res.status(200).json({
    status: "success",
    ticket,
  });
});

exports.deleteTicket = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  await ticket.remove();

  res.status(200).json({
    status: "success",
  });
});
exports.updateTicket = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  const updateTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      updateTicket,
    },
  });
});
exports.createTicket = asyncHandler(async (req, res) => {
  const { product, description } = req.body;

  if (!product || !description) {
    res.status(400);
    throw new Error("Please add a product and description");
  }

  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.create({
    product,
    description,
    user: req.user.id,
    status: "new",
  });

  res.status(201).json({
    status: "success",
    data: {
      ticket,
    },
  });
});
