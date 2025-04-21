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
            default:["https://www.w3schools.com/howto/img_paris.jpg"]
            
      }
})

const Product = mongoose.model("roomsNew", productSchema);

export default Product;