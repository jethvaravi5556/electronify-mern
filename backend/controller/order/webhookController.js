import Stripe from "stripe";
import dotenv from "dotenv";
import mongoose from "mongoose";
import orderModel from "../../models/orderModel.js";
import userModel from "../../models/userModel.js";
import sendOrderConfirmationEmail from "../../utils/sendEmail.js";
import addToCartModel from "../../models/addToCartModel.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webhookController = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(
      "🔍 Stripe Session Webhook Object:",
      JSON.stringify(session, null, 2)
    );

    const customerEmail = session.customer_email;

    let user;
    try {
      user = await userModel.findOne({ email: customerEmail });
      if (!user) throw new Error("User not found");
    } catch (err) {
      console.error("❌ User lookup failed:", err.message);
      return res.status(400).json({ error: "User not found" });
    }

    const userId = new mongoose.Types.ObjectId(session.metadata.userId);

    console.log("📦 Webhook: saving order for userId", userId);

    // Get line items
    let lineItems;
    try {
      const response = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          expand: ["data.price.product"],
          limit: 100,
        }
      );
      lineItems = response.data;
    } catch (err) {
      console.error("❌ Failed to fetch line items:", err.message);
      return res.status(500).json({ error: "Failed to fetch line items" });
    }

    const productDetails = lineItems.map((item) => {
      let images = [];
      try {
        images = JSON.parse(item.price.product.metadata.images || "[]");
      } catch {
        images = [];
      }

      return {
        productId: item.price.product.metadata.productId || "",
        name: item.description,
        quantity: item.quantity,
        unitPrice: item.amount_total / item.quantity / 100,
        image: images,
      };
    });

    let shippingRateInfo = {
      label: "Standard Shipping",
      amount: 0,
      currency: "INR",
    };

    if (session.shipping_cost?.shipping_rate) {
      try {
        const shippingRate = await stripe.shippingRates.retrieve(
          session.shipping_cost.shipping_rate
        );

        if (shippingRate.fixed_amount?.amount) {
          shippingRateInfo = {
            label: shippingRate.display_name,
            amount: shippingRate.fixed_amount.amount / 100,
            currency: shippingRate.fixed_amount.currency.toUpperCase(),
          };
        } else {
          console.warn("⚠️ Shipping rate missing fixed amount!");
        }
      } catch (err) {
        console.warn("⚠️ Could not fetch shipping rate:", err.message);
      }
    }
    const shippingDetails =
      session.collected_information?.shipping_details ||
      session.shipping_details;

    const orderDetails = {
      userId,
      email: customerEmail,
      productDetails,
      shippingAddress: {
        name: shippingDetails?.name || "",
        address: [
          shippingDetails?.address?.line1,
          shippingDetails?.address?.line2,
          shippingDetails?.address?.city,
          shippingDetails?.address?.state,
          shippingDetails?.address?.postal_code,
          shippingDetails?.address?.country,
        ]
          .filter(Boolean)
          .join(", "), // Combines into single string
        charge: shippingRateInfo.label,
        rateAmount: shippingRateInfo.amount,
        currency: shippingRateInfo.currency,
      },
      paymentDetails: {
        paymentId: session.payment_intent,
        payment_method_type: session.payment_method_types,
        payment_status: session.payment_status,
      },
      totalAmount: session.amount_total / 100,
    }

    const newOrder = new orderModel(orderDetails);

    try {
      const saveorder = await newOrder.save();
       if(saveorder?.id){
       const deleteCartItem = await addToCartModel.deleteMany({ userId:userId });
      } 
    } catch (err) {
      console.error("❌ Failed to save order:", err.message);
      return res.status(500).json({ error: "Failed to save order" });
    }

    try {
      await sendOrderConfirmationEmail(customerEmail, newOrder);
      console.log("✅ Confirmation email sent to:", customerEmail);
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr.message);
    }
  }

  res.json({ received: true });
};

export default webhookController;
