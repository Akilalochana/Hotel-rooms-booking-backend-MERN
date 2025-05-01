import Order from "../models/orders.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
  const data = req.body;
  const orderInfo = {
    orderedItems: []
  };

  // Check if user is logged in
  if (req.user == null) {
    res.status(401).json({
      message: "Please login and try again."
    });
    return;
  }

  // Add email from authenticated user
  orderInfo.email = req.user.email;

  // Generate order ID
  try {
    const lastOrder = await Order.find().sort({ orderDate: -1 }).limit(1);
    
    if (lastOrder.length === 0) {
      orderInfo.orderId = "ORD0001";
    } else {
      const lastOrderId = lastOrder[0].orderId;
      const lastOrderNumberInString = lastOrderId.replace("ORD", "");
      const lastOrderNumber = parseInt(lastOrderNumberInString);
      const currentOrderNumber = lastOrderNumber + 1;
      const formattedOrderNumber = String(currentOrderNumber).padStart(4, "0");
      orderInfo.orderId = "ORD" + formattedOrderNumber;
    }

    // Process ordered items
    let oneDayCost = 0;
    for (let i = 0; i < data.orderedItems.length; i++) {
      try {
        const product = await Product.findOne({ key: data.orderedItems[i].key });
        
        if (product == null) {
          res.status(404).json({
            message: "Product with key " + data.orderedItems[i].key + " not found"
          });
          return;
        }
        
        if (product.availability === false) {
          res.status(400).json({
            message: "Product with key " + data.orderedItems[i].key + " is not available"
          });
          return;
        }
        
        orderInfo.orderedItems.push({
          product: {
            key: product.key,
            name: product.name,
            image: product.image[0],
            price: product.price
          },
          quantity: data.orderedItems[i].qty
        });
        
        oneDayCost += product.price * data.orderedItems[i].qty;
      } catch (err) {
        res.status(500).json({
          error: "Order creation failed when processing items"
        });
        return;
      }
    }

    // Add booking details
    orderInfo.days = data.days;
    orderInfo.startingDate = data.startingDate;
    orderInfo.endingDate = data.endingDate;
    orderInfo.totalAmount = oneDayCost * data.days;

    // Save the order
    const newOrder = new Order(orderInfo);
    const results = await newOrder.save();
    
    res.json({
      message: "Order created successfully",
      order: results
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Failed to create order",
      error: e.message
    });
  }
}