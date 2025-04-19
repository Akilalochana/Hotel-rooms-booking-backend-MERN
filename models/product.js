import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
      name:{
            type: String,
            required: true
      },
      price:{
            type: Number,
            required: true
      },
      description:{
            type:String,
            require:true
      }
})

const Product = mongoose.model("rooms", productSchema);

export default Product;