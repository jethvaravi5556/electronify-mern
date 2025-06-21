import productModel from "../../models/productModel.js";

async function allProductController(req, res) {
  try {
    console.log("User ID:", req.userId); // This is only useful if you need user-specific product access

    // Fetch all products
    const allProducts = await productModel.find();

    res.status(200).json({
      message: "All products fetched successfully",
      data: allProducts,
      success: true,
      error: false
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
}

export default allProductController;
