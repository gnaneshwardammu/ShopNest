require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./model/User');
const Product = require('./model/Product');
const Order = require('./model/Order');

const seed = async () => {
	try {
		console.log('Connecting to database...');
		await connectDB();
		console.log('✓ Database connected');

		// Clear existing data (optional)
		console.log('Clearing existing data...');
		const delUsers = await User.deleteMany();
		console.log(`✓ Deleted ${delUsers.deletedCount} users`);
		
		const delProducts = await Product.deleteMany();
		console.log(`✓ Deleted ${delProducts.deletedCount} products`);
		
		const delOrders = await Order.deleteMany();
		console.log(`✓ Deleted ${delOrders.deletedCount} orders`);

		// Create users
		console.log('Creating users...');
		const users = [
			{
				username: 'admin',
				email: 'admin@example.com',
				password: await bcrypt.hash('admin123', 10),
				role: 'admin',
				verified: true,
			},
			{
				username: 'johndoe',
				email: 'john@example.com',
				password: await bcrypt.hash('password123', 10),
				role: 'user',
				verified: true,
			},
		];

		const createdUsers = await User.insertMany(users);
		console.log(`✓ Created ${createdUsers.length} users`);

		// Create products
		console.log('Creating products...');
		const products = [
			{
				name: 'Wireless Mouse',
				description: 'Ergonomic wireless mouse',
				price: 499,
				category: 'Electronics',
				stock: 100,
				imageUrl: 'https://via.placeholder.com/400x300.png?text=Wireless+Mouse',
			},
			{
				name: 'Mechanical Keyboard',
				description: 'RGB mechanical keyboard',
				price: 2499,
				category: 'Electronics',
				stock: 50,
				imageUrl: 'https://via.placeholder.com/400x300.png?text=Mechanical+Keyboard',
			},
			{
				name: 'Coffee Mug',
				description: 'Ceramic coffee mug',
				price: 199,
				category: 'Home',
				stock: 200,
				imageUrl: 'https://via.placeholder.com/400x300.png?text=Coffee+Mug',
			},
		];

		const createdProducts = await Product.insertMany(products);
		console.log(`✓ Created ${createdProducts.length} products`);

		// Create an order for the regular user
		console.log('Creating order...');
		const user = createdUsers.find(u => u.role === 'user') || createdUsers[0];

		const orderItems = [
			{
				product: createdProducts[0]._id,
				quantity: 2,
				price: createdProducts[0].price,
			},
			{
				product: createdProducts[1]._id,
				quantity: 1,
				price: createdProducts[1].price,
			},
		];

		const order = new Order({
			user: user._id,
			items: orderItems,
			totalAmount: orderItems.reduce((s, it) => s + it.quantity * it.price, 0),
			address: {
				fullName: 'John Doe',
				street: '123 Main St',
				city: 'Sample City',
				state: 'State',
				postalCode: '12345',
				country: 'Country',
			},
			paymentId: `seed_pay_${Date.now()}`,
			status: 'Pending',
		});

		await order.save();
		console.log('✓ Created 1 order');

		// Verify data was actually written
		console.log('\n✓ Verifying data in database...');
		const userCount = await User.countDocuments();
		const productCount = await Product.countDocuments();
		const orderCount = await Order.countDocuments();

		console.log(`\n✅ Seed completed successfully!`);
		console.log(`   Users in DB: ${userCount}`);
		console.log(`   Products in DB: ${productCount}`);
		console.log(`   Orders in DB: ${orderCount}`);
		console.log('\n📝 Sample Data:');
		console.log('   Users:', createdUsers.map(u => ({ id: u._id, email: u.email })));
		console.log('   Products:', createdProducts.map(p => ({ id: p._id, name: p.name })));
		console.log('   Order:', { id: order._id, user: order.user, totalAmount: order.totalAmount });

		// Close connection
		mongoose.connection.close();
		process.exit(0);
	} catch (error) {
		console.error('\n❌ Seed error:', error.message);
		console.error(error);
		mongoose.connection.close();
		process.exit(1);
	}
};

seed();

