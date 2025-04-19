import Product from "../models/product.js";

export function addProduct(req, res){
      console.log(req.user)
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
      newProduct.save().then(()=>{
            res.status(200).json({
                  message: "Product added successfully"
            })
            }).catch((err)=>{
                  res.status(500).json({
                        error: "Product addition failed"
                  })
            })
}