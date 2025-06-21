import addToCartModel from "../../models/addToCartModel.js";

const updateAddToCartProductController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const addToCartProductId = req.body._id;
        const qty = req.body.quantity; 

        const updateProduct = await addToCartModel.updateOne({_id: addToCartProductId },{...(qty && { quantity:qty })});

        res.json({
            data : updateProduct,
            message: "Product Updated",
            success: true,
            error: false,
        });
    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};

export default updateAddToCartProductController;
