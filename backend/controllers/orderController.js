const Order = require('../model/Order');
const sendEmail = require('../utils/sendEmail');

const normalizeOrderItem = (item) => ({
    product: item.product || item.productId,
    quantity: item.quantity || item.qty || 1,
    price: Number(item.price || 0),
});

const createOrder = async (req, res) => {
    try {
         const{items, totalAmount, address, paymentId} = req.body;
         if(!items || items.length === 0 || !totalAmount || !address || !paymentId){
            return res.status(400).json({message:'Invalid order data'});
            }

            const normalizedItems = items.map(normalizeOrderItem);
            const order = await Order.create({
                user: req.user._id,
                items: normalizedItems,
                totalAmount: Number(totalAmount),
                address: {
                    fullName: address.fullName,
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    postalCode: address.postalCode,
                    country: address.country,
                },
                paymentId,
            });

            const message = `Dear ${req.user.name},\n\nThank you for your order! Your order ID is ${order._id} and the total amount is $${totalAmount}.\n\nWe will notify you once your order is shipped.\n\nBest regards,\nE-commerce Team`;

            await sendEmail({to: req.user.email, subject: 'Order Confirmation', message});
            res.status(201).json({message:'Order created successfully', order});
    } catch (error) {
        res.status(500).json({message:'Server error', error: error.message});
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({user: req.user._id}).populate('items.product', 'name price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({message:'Server error', error: error.message});
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', '_id username email').populate('items.product', 'name price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({message:'Server error', error: error.message});
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            await order.save();
            res.json({ message: 'Order status updated successfully', order });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus,
};