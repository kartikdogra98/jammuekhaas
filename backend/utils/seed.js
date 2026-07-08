require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');
const Coupon = require('../models/Coupon');

const run = async () => {
  await connectDB();
  console.log('Seeding database...');

  await Promise.all([
    Category.deleteMany({}),
    Coupon.deleteMany({}),
  ]);

  const categories = await Category.insertMany([
    { name: 'Dogra Special' },
    { name: 'Kashmiri Wazwan' },
    { name: 'North Indian' },
    { name: 'Street Food' },
    { name: 'Desserts' },
    { name: 'Beverages' },
  ]);

  let admin = await User.findOne({ email: 'admin@jammuekhaas.com' });
  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email: 'admin@jammuekhaas.com',
      password: 'Admin@123',
      role: 'admin',
      isEmailVerified: true,
    });
  }

  const restaurantsData = [
    {
      owner: {
        name: "Dogra Chicken Corner Owner",
        email: "dogra@jammuekhaas.com",
      },
      restaurant: {
        name: "Dogra Chicken Corner",
        description: "Authentic Dogra cuisine featuring Butter Chicken, Kaladi Kulcha, Rajma Chawal and Mutton Rogan Josh.",
        cuisine: ["Dogra Special", "North Indian"],
        image: {
          url: "/images/restaurants/dogra-chicken-corner.jpg",
          public_id: ""
        },
      
        coverImage: {
          url: "/images/restaurants/dogra-chicken-corner.jpg",
          public_id: ""
        },
        address: {
          street: "Rah Salyote",
          city: "Jammu",
          state: "Jammu & Kashmir",
          pincode: "180001",
        },
        phone: "9876543210",
        deliveryFee: 30,
        avgDeliveryTime: 35,
      },
      foods: [
        {
          category: categories[0]._id,
          name: "Butter Chicken",
          description: "Creamy butter chicken.",
          price: 320,
          isVeg: false,
        },
        {
          category: categories[0]._id,
          name: "Kaladi Kulcha",
          description: "Traditional Jammu Kaladi.",
          price: 180,
          isVeg: true,
        },
      ],
    },
  
    {
      owner: {
        name: "Jammu Zaika Owner",
        email: "zaika@jammuekhaas.com",
      },
      restaurant: {
        name: "Jammu Zaika",
        description: "Authentic Dogra meals made with traditional recipes.",
        cuisine: ["Dogra Special"],
        image: {
          url: "/images/restaurants/jammu-zaika.jpg",
          public_id: ""
      },
        coverImage: {
          url: "/images/restaurants/jammu-zaika.jpg",
          public_id: ""
      },
        address: {
          street: "Gandhi Nagar",
          city: "Jammu",
          state: "Jammu & Kashmir",
          pincode: "180004",
        },
        phone: "9876543211",
        deliveryFee: 30,
        avgDeliveryTime: 30,
      },
      foods: [
        {
          category: categories[0]._id,
          name: "Rajma Chawal",
          description: "Dogra style Rajma.",
          price: 180,
          isVeg: true,
        },
        {
          category: categories[0]._id,
          name: "Ambal",
          description: "Sweet and sour pumpkin curry.",
          price: 150,
          isVeg: true,
        },
      ],
    },
  
    {
      owner: {
        name: "Wazwan House Owner",
        email: "wazwan@jammuekhaas.com",
      },
      restaurant: {
        name: "Wazwan House",
        description: "Premium Kashmiri Wazwan cuisine.",
        cuisine: ["Kashmiri Wazwan"],
        image: {
          url: "/images/restaurants/wazwan-house.jpg",
          public_id: ""
      },
        coverImage: {
          url: "/images/restaurants/wazwan-house.jpg",
          public_id: ""
      },
        address: {
          street: "Residency Road",
          city: "Jammu",
          state: "Jammu & Kashmir",
          pincode: "180001",
        },
        phone: "9876543212",
        deliveryFee: 40,
        avgDeliveryTime: 40,
      },
      foods: [
        {
          category: categories[1]._id,
          name: "Rogan Josh",
          description: "Traditional Kashmiri mutton.",
          price: 420,
          isVeg: false,
        },
        {
          category: categories[1]._id,
          name: "Gushtaba",
          description: "Royal Wazwan meatballs.",
          price: 450,
          isVeg: false,
        },
      ],
    },
  
    {
      owner: {
        name: "Punjab Tadka Owner",
        email: "punjab@jammuekhaas.com",
      },
      restaurant: {
        name: "Punjab Tadka",
        description: "North Indian family restaurant.",
        cuisine: ["North Indian"],
        image: {
          url: "/images/restaurants/punjab-tadka.jpg",
          public_id: ""
      },
        coverImage: {
          url: "/images/restaurants/punjab-tadka.jpg",
          public_id: ""
      },
        address: {
          street: "Channi Himmat",
          city: "Jammu",
          state: "Jammu & Kashmir",
          pincode: "180015",
        },
        phone: "9876543213",
        deliveryFee: 35,
        avgDeliveryTime: 35,
      },
      foods: [
        {
          category: categories[2]._id,
          name: "Paneer Butter Masala",
          price: 260,
          isVeg: true,
        },
        {
          category: categories[2]._id,
          name: "Butter Naan",
          price: 50,
          isVeg: true,
        },
      ],
    },
  
    {
      owner: {
        name: "Kulcha Junction Owner",
        email: "kulcha@jammuekhaas.com",
      },
      restaurant: {
        name: "Kulcha Junction",
        description: "Street food specialists.",
        cuisine: ["Street Food"],
        image: {
          url: "/images/restaurants/kulcha-junction.jpg",
          public_id: ""
      },
        coverImage: {
          url: "/images/restaurants/kulcha-junction.jpg",
          public_id: ""
      },
        address: {
          street: "Raghunath Bazaar",
          city: "Jammu",
          state: "Jammu & Kashmir",
          pincode: "180001",
        },
        phone: "9876543214",
        deliveryFee: 25,
        avgDeliveryTime: 20,
      },
      foods: [
        {
          category: categories[3]._id,
          name: "Chole Kulche",
          price: 120,
          isVeg: true,
        },
        {
          category: categories[3]._id,
          name: "Gol Gappe",
          price: 60,
          isVeg: true,
        },
      ],
    },
  
    {
      owner: {
        name: "Spice Route Owner",
        email: "spice@jammuekhaas.com",
      },
      restaurant: {
        name: "Spice Route",
        description: "North Indian and Chinese cuisine.",
        cuisine: ["North Indian"],
        image: {
          url: "/images/restaurants/spice-route.jpg",
          public_id: ""
      },
        coverImage: {
          url: "/images/restaurants/spice-route.jpg",
          public_id: ""
      },
        address: {
          street: "Trikuta Nagar",
          city: "Jammu",
          state: "Jammu & Kashmir",
          pincode: "180020",
        },
        phone: "9876543215",
        deliveryFee: 35,
        avgDeliveryTime: 35,
      },
      foods: [
        {
          category: categories[2]._id,
          name: "Hakka Noodles",
          price: 190,
          isVeg: true,
        },
        {
          category: categories[2]._id,
          name: "Chicken Manchurian",
          price: 280,
          isVeg: false,
        },
      ],
    },
  
    {
      owner: {
        name: "Sweet Cravings Owner",
        email: "sweet@jammuekhaas.com",
      },
      restaurant: {
        name: "Sweet Cravings",
        description: "Desserts and bakery.",
        cuisine: ["Desserts"],
        image: {
          url: "/images/restaurants/sweet-cravings.jpg",
          public_id: ""
      },
        coverImage: {
          url: "/images/restaurants/sweet-cravings.jpg",
          public_id: ""
      },
        address: {
          street: "Bakshi Nagar",
          city: "Jammu",
          state: "Jammu & Kashmir",
          pincode: "180001",
        },
        phone: "9876543216",
        deliveryFee: 20,
        avgDeliveryTime: 20,
      },
      foods: [
        {
          category: categories[4]._id,
          name: "Gulab Jamun",
          price: 90,
          isVeg: true,
        },
        {
          category: categories[4]._id,
          name: "Chocolate Cake",
          price: 180,
          isVeg: true,
        },
      ],
    },
  
    {
      owner: {
        name: "Chai & Chill Owner",
        email: "chai@jammuekhaas.com",
      },
      restaurant: {
        name: "Chai & Chill Café",
        description: "Coffee, tea and beverages.",
        cuisine: ["Beverages"],
        image: {
          url: "/images/restaurants/chai-and-chill.jpg",
          public_id: ""
      },
        coverImage: {
          url: "/images/restaurants/chai-and-chill.jpg",
          public_id: ""
      },
        address: {
          street: "Canal Road",
          city: "Jammu",
          state: "Jammu & Kashmir",
          pincode: "180001",
        },
        phone: "9876543217",
        deliveryFee: 20,
        avgDeliveryTime: 20,
      },
      foods: [
        {
          category: categories[5]._id,
          name: "Cold Coffee",
          price: 150,
          isVeg: true,
        },
        {
          category: categories[5]._id,
          name: "Oreo Shake",
          price: 180,
          isVeg: true,
        },
      ],
    },
  ];
  
  for (const data of restaurantsData) {
    let owner = await User.findOne({ email: data.owner.email });
  
    if (!owner) {
      owner = await User.create({
        ...data.owner,
        password: "Owner@123",
        role: "restaurant",
        isEmailVerified: true,
      });
    }
  
    let restaurant = await Restaurant.findOne({ owner: owner._id });

if (!restaurant) {
  restaurant = await Restaurant.create({
    owner: owner._id,
    ...data.restaurant,
    isApproved: true,
    minOrderAmount: 100,
  });
} else {
  restaurant.image = data.restaurant.image;
  restaurant.coverImage = data.restaurant.coverImage;
  await restaurant.save();
}
  
    const count = await Food.countDocuments({ restaurant: restaurant._id });
  
    if (count === 0) {
      await Food.insertMany(
        data.foods.map((food) => ({
          ...food,
          restaurant: restaurant._id,
        }))
      );
    }
  }

  const couponCount = await Coupon.countDocuments();
  if (couponCount === 0) {
    await Coupon.insertMany([
      {
        code: 'WELCOME50',
        description: 'Flat ₹50 off on your first order',
        discountType: 'flat',
        discountValue: 50,
        minOrderAmount: 150,
        usageLimit: 500,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'DOGRA20',
        description: '20% off up to ₹100',
        discountType: 'percentage',
        discountValue: 20,
        maxDiscount: 100,
        minOrderAmount: 200,
        usageLimit: 1000,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    ]);
  }

  console.log('Seeding complete!');
  console.log('Admin login -> email: admin@jammuekhaas.com | password: Admin@123');
  console.log('Restaurant owner login -> email: owner@jammuekhaas.com | password: Owner@123');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
