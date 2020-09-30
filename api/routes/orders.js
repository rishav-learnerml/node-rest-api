const express = require('express');

const router = express.Router();

router.get('/',(req,res,next) =>{
    res.status(200).json({
        message: "Orders were fetched"
    })
})
router.get('/:orderId',(req,res,next) =>{
    const orderId = req.params.orderId
    res.status(200).json({
        message: `Order with id: ${orderId} was fetched`,
        id:orderId
    })
})

router.post('/',(req,res,next) =>{
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: "Orders were created",
        order: order
    })
})
router.delete('/:orderId',(req,res,next) =>{
    const orderId = req.params.orderId
    res.status(200).json({
        message: `Order with id: ${orderId} was Deleted`,
        id:orderId
    })
})



module.exports = router;