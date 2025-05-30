import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
      key :{
            type: String,
            required: true,
            unique:true
      },
      name:{
            type: String,
            required: true
      },
      price:{
            type: Number,
            required: true
      },
      category:{
            type: String,
            required: true,
            default: "uncategorized"
      },
      description:{
            type:String,
            require:true
      },
      bedRomms:{
            type: Number,
            required: true
      },
      availability:{
            type: Boolean,
            required: true,
            default: true 
      },
      image: {
            type: [String],
            required: true,
            default:["https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"]
            
      }
})

const Product = mongoose.model("roomsNew", productSchema);

export default Product;