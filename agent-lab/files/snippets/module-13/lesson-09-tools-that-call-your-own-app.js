// services/agent/tools/order-status.tool.js
const { Order } = require("../../../models/order.model");

module.exports = {
  definition: {
    name: "get_order_status",
    description: "Look up the status of one of the current user's orders by its order number.",
    input_schema: {
      type: "object",
      properties: { orderNumber: { type: "string", description: "e.g. ORD-10023" } },
      required: ["orderNumber"],
    },
  },
  needsApproval: false,

  async run({ orderNumber }, ctx) {
    const order = await Order.findOne({ number: orderNumber, user: ctx.userId })   // scoped to this user
      .select("number status total updatedAt")                                      // only what the model needs
      .lean();

    if (!order) return "No order " + orderNumber + " was found for this user.";
    return JSON.stringify(order);
  },
};
