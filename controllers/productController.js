import Product from "../models/product.js";
import { isItAdmin } from "./userController.js";

export async function addProduct(req, res){
      
      const data = req.body;
      const newProduct = new Product(data);

      if(req.user == null){
            res.status(401).json({
                  message:"please login and try again."
            })
            return
      }
      if(req.user.role != "admin"){
            res.status(401).json({
                  message:"Only admin can add products!!"
            })
            return
      }
      try{
            await newProduct.save();
            res.status(200).json({
                  message:"Product added successfully"
            })

      }catch(err){
            res.status(500).json({
                  error:"Product addition failed"
            })
      }
}

export async function getProducts(req, res){
      let isAdmin = isItAdmin(req);

      try{
            if(isAdmin){
              const products = await Product.find();
              res.json(products);
              return;
            }else{
                  const products = await Product.find({availability:true});
                  res.json(products);
                  return;
            }
            

      }catch(err){
            res.status(500).json({
                  error:"Product fetching failed"
            })
      }
}


export async function updateProduct(req, res){
      try{
            if(isItAdmin(req)){
                 const key = req.params.key;
                 const data = req.body;
                 
                 await Product.updateOne({key:key},data)
                 res.status(200).json({
                       message:"Product updated successfully"
                 })

            }else{
                  res.status(401).json({
                        message:"Only admin can update products!!"
                  })
                  return
            }

      }catch(e){
            res.status(500).json({
                  message:"faild to update room details"
            })
      }
}

export async function deleteProduct(req, res){
      try{
            if(isItAdmin(req)){
                  const key = req.params.key;
                  await Product.deleteOne({key:key})
                  res.status(200).json({
                        message:"Product deleted successfully"
                  })
            }else{
                  res.status(401).json({
                        message:"Only admin can delete products!!"
                  })
                  return
            }

      }catch(e){
            res.status(500).json({
                  message:"faild to delete room details"
            })
      }
}