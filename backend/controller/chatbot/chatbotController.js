import axios from "axios";
import cartModel from "../../models/addToCartModel.js";
import orderModel from "../../models/orderModel.js";
import productModel from "../../models/productModel.js";

const chatbotController = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.userId || null; // will be undefined if not logged in
    const lowerPrompt = prompt?.toLowerCase().trim();

    if (!lowerPrompt) {
      return res.json({ message: "Please type something so I can help you." });
    }

    // ✅ Greet
    if (["hi", "hello", "hii"].includes(lowerPrompt)) {
      return res.json({ message: "Hello! I'm your shopping assistant at Electronify. How can I help you today?" });
    }

    // ✅ Today's date
    if (lowerPrompt.includes("date") || lowerPrompt.includes("today")) {
      const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return res.json({ message: `Today is ${today}. How may I assist you further?` });
    }

    // ✅ Categories
    if (lowerPrompt.includes("how many categories") || lowerPrompt.includes("categories")) {
      const categories = await productModel.distinct("category");
      return res.json({
        message: `We currently have ${categories.length} product categories: ${categories.join(", ")}.`,
      });
    }

    // ✅ Specific category/product check
    const keywords = ["airpods", "earphones", "mobile", "camera", "watch", "speakers"];
    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword)) {
        const products = await productModel.find({ category: new RegExp(keyword, "i") });
        if (products.length > 0) {
          const list = products.map(p => `${p.productName} (Rs.${p.sellingPrice})`).join(", ");
          return res.json({ message: `Yes, we have the following in ${keyword}: ${list}` });
        } else {
          return res.json({ message: `Sorry, we currently don't have products in the ${keyword} category.` });
        }
      }
    }

    // ✅ Recommend products
    if (lowerPrompt.includes("best") || lowerPrompt.includes("recommend")) {
      const topProducts = await productModel.find().sort({ createdAt: -1 }).limit(3);
      const list = topProducts.map(p => `${p.productName} by ${p.brandName} (Rs.${p.sellingPrice})`).join(", ");
      return res.json({ message: `Here are some popular products: ${list}` });
    }

    // ✅ Cart info (requires login)
    if (lowerPrompt.includes("in my cart") || lowerPrompt.includes("my cart") || lowerPrompt.includes("cart")) {
      if (!userId) {
        return res.json({ message: "You're not logged in. Please sign in to view your cart." });
      }

      const cartItems = await cartModel.find({ userId }).populate("productId");
      if (!cartItems.length) {
        return res.json({ message: "Your cart is currently empty. Add something you like!" });
      }

      const summary = cartItems.map(c => `${c.productId?.productName} (x${c.quantity})`).join(", ");
      return res.json({ message: `Your cart has: ${summary}.` });
    }

    // ✅ Order info (requires login)
    if (
      lowerPrompt.includes("how many orders") ||
      lowerPrompt.includes("my orders") ||
      lowerPrompt.includes("orders")
    ) {
      if (!userId) {
        return res.json({ message: "You're not logged in. Please sign in to check your orders." });
      }

      const orders = await orderModel.find({ userId });
      if (!orders.length) {
        return res.json({ message: "You haven’t placed any orders yet. Start shopping now!" });
      }

      return res.json({ message: `You have placed ${orders.length} order${orders.length > 1 ? "s" : ""}.` });
    }

    // ✅ AI fallback for general questions
    let context = "You're a helpful assistant for an eCommerce site named Electronify. Answer naturally, no markdown or stars.";
    
    const categories = await productModel.distinct("category");
    context += ` Available categories: ${categories.join(", ")}.`;

    if (userId) {
      const cartItems = await cartModel.find({ userId }).populate("productId");
      const orders = await orderModel.find({ userId });

      if (cartItems.length > 0) {
        context += ` User's cart: ${cartItems.map(c => c.productId?.productName).filter(Boolean).join(", ")}.`;
      }

      if (orders.length > 0) {
        const orderNames = orders.flatMap(o => o.productDetails.map(p => p.name));
        context += ` Previously ordered: ${orderNames.join(", ")}.`;
      }
    }

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "gemma:2b",
      prompt: `${context}\nUser asked: ${prompt}`,
      stream: false,
    });

    let reply = response.data?.response || "Sorry, I couldn’t understand that.";
    reply = reply.replace(/\*\*/g, "").replace(/\*/g, "").replace(/\n/g, " ").trim();

    res.json({ message: reply });
  } catch (error) {
    console.error("Chatbot error:", error.message);
    res.status(500).json({ message: "Something went wrong while generating a response." });
  }
};

export default chatbotController;
