// controller/user/getOrders.js
import orderModel from "../../models/orderModel.js";
import mongoose from "mongoose";


const getOrders = async (req, res) => {
  
const userId = req.userId; // ✅ Use as-is

  console.log("typeof req.userId:", typeof req.userId);
console.log("req.userId instanceof ObjectId:", req.userId instanceof mongoose.Types.ObjectId);


  try {
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
    console.log("order",orders)
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export default getOrders;
