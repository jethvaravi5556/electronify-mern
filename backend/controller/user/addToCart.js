import addToCartModel from "../../models/addToCartModel.js";


const addToCartController=async(req,res)=>{
    try{
        const {productId}=req.body;
        const currentUser = req.userId

           if (!productId || !currentUser) {
      return res.status(400).json({ message: "Missing fields" });
    }
        const isProductAvailable= await addToCartModel.findOne({productId, userId: currentUser})

     
        if(isProductAvailable){
            return res.json({
                message: "Already exist in cart",
                success:false,
                error:true
            })
        }
        const payLoad={
            productId:productId,
            quantity:1,
            userId: currentUser}

        const newAddToCart=new addToCartModel(payLoad)
        const saveProduct=await newAddToCart.save()

        return res.json({
            data:saveProduct,
            message:"Product added to cart",
            success:true,
            error:false
        })
    }catch(err){
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

export default addToCartController;
