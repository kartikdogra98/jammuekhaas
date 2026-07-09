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
    Restaurant.deleteMany({}),
    Food.deleteMany({}),
    User.deleteMany({ role: "restaurant" }),
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
          description: "Creamy butter chicken cooked in rich tomato gravy.",
          price: 320,
          isVeg: false,
          image:{url:"/images/foods/dogra-chicken-corner/butter-chicken.jpg",public_id:""}
        },
        {
          category: categories[0]._id,
          name: "Kaladi Kulcha",
          description: "Traditional Jammu Kaladi cheese with kulcha.",
          price:180,
          isVeg:true,
          image:{url:"/images/foods/dogra-chicken-corner/kaladi-kulcha.jpg",public_id:""}
        },
        {
          category: categories[0]._id,
          name:"Rajma Chawal",
          description:"Authentic Dogra Rajma with steamed rice.",
          price:170,
          isVeg:true,
          image:{url:"/images/foods/dogra-chicken-corner/rajma-chawal.jpg",public_id:""}
        },
        {
          category: categories[0]._id,
          name:"Mutton Rogan Josh",
          description:"Slow-cooked mutton in aromatic spices.",
          price:420,
          isVeg:false,
          image:{url:"/images/foods/dogra-chicken-corner/mutton-rogan-josh.jpg",public_id:""}
        },
        {
          category: categories[0]._id,
          name:"Tandoori Chicken",
          description:"Charcoal grilled spicy chicken.",
          price:350,
          isVeg:false,
          image:{url:"/images/foods/dogra-chicken-corner/tandoori-chicken.jpg",public_id:""}
        },
        {
          category: categories[0]._id,
          name:"Chicken Biryani",
          description:"Fragrant basmati rice with chicken.",
          price:280,
          isVeg:false,
          image:{url:"/images/foods/dogra-chicken-corner/chicken-biryani.jpg",public_id:""}
        }
        ]
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
      foods:[
        {
        category:categories[0]._id,
        name:"Rajma Chawal",
        description:"Traditional Jammu Rajma.",
        price:180,
        isVeg:true,
        image:{url:"/images/foods/jammu-zaika/rajma-chawal.jpg",public_id:""}
        },
        {
        category:categories[0]._id,
        name:"Ambal",
        description:"Sweet & sour pumpkin curry.",
        price:150,
        isVeg:true,
        image:{url:"/images/foods/jammu-zaika/ambal.jpg",public_id:""}
        },
        {
        category:categories[0]._id,
        name:"Khatta Meat",
        description:"Tangy Dogra style mutton.",
        price:380,
        isVeg:false,
        image:{url:"/images/foods/jammu-zaika/khatta-meat.jpg",public_id:""}
        },
        {
        category:categories[0]._id,
        name:"Kaladi Fry",
        description:"Pan-fried Kaladi cheese.",
        price:180,
        isVeg:true,
        image:{url:"/images/foods/jammu-zaika/kaladi-fry.jpg",public_id:""}
        },
        {
        category:categories[0]._id,
        name:"Aloo Anardana",
        description:"Potatoes cooked with pomegranate spices.",
        price:150,
        isVeg:true,
        image:{url:"/images/foods/jammu-zaika/aloo-anardana.jpg",public_id:""}
        },
        {
        category:categories[0]._id,
        name:"Paneer Dogri",
        description:"Traditional paneer curry.",
        price:240,
        isVeg:true,
        image:{url:"/images/foods/jammu-zaika/paneer-dogri.jpg",public_id:""}
        }
        ]
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
      foods:[
        {
        category:categories[1]._id,
        name:"Rogan Josh",
        price:420,
        isVeg:false,
        image:{url:"/images/foods/wazwan-house/rogan-josh.jpg",public_id:""}
        },
        {
        category:categories[1]._id,
        name:"Gushtaba",
        price:450,
        isVeg:false,
        image:{url:"/images/foods/wazwan-house/gushtaba.jpg",public_id:""}
        },
        {
        category:categories[1]._id,
        name:"Rista",
        price:430,
        isVeg:false,
        image:{url:"/images/foods/wazwan-house/rista.jpg",public_id:""}
        },
        {
        category:categories[1]._id,
        name:"Yakhni",
        price:390,
        isVeg:false,
        image:{url:"/images/foods/wazwan-house/yakhni.jpg",public_id:""}
        },
        {
        category:categories[1]._id,
        name:"Tabak Maaz",
        price:460,
        isVeg:false,
        image:{url:"/images/foods/wazwan-house/tabak-maaz.jpg",public_id:""}
        },
        {
        category:categories[1]._id,
        name:"Dum Aloo Kashmiri",
        price:220,
        isVeg:true,
        image:{url:"/images/foods/wazwan-house/dum-aloo.jpg",public_id:""}
        }
        ]
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
          description: "Soft paneer cubes cooked in rich buttery tomato gravy.",
          price: 260,
          isVeg: true,
          image: {
            url: "/images/foods/punjab-tadka/paneer-butter-masala.jpg",
            public_id: ""
          }
        },
        {
          category: categories[2]._id,
          name: "Dal Makhani",
          description: "Slow-cooked black lentils finished with cream and butter.",
          price: 220,
          isVeg: true,
          image: {
            url: "/images/foods/punjab-tadka/dal-makhani.jpg",
            public_id: ""
          }
        },
        {
          category: categories[2]._id,
          name: "Shahi Paneer",
          description: "Paneer cooked in a rich creamy cashew gravy.",
          price: 270,
          isVeg: true,
          image: {
            url: "/images/foods/punjab-tadka/shahi-paneer.jpg",
            public_id: ""
          }
        },
        {
          category: categories[2]._id,
          name: "Chole Bhature",
          description: "Spicy Punjabi chole served with fluffy bhature.",
          price: 190,
          isVeg: true,
          image: {
            url: "/images/foods/punjab-tadka/chole-bhature.jpg",
            public_id: ""
          }
        },
        {
          category: categories[2]._id,
          name: "Butter Naan",
          description: "Fresh tandoor naan brushed with butter.",
          price: 45,
          isVeg: true,
          image: {
            url: "/images/foods/punjab-tadka/butter-naan.jpg",
            public_id: ""
          }
        },
        {
          category: categories[2]._id,
          name: "Jeera Rice",
          description: "Basmati rice tempered with cumin seeds.",
          price: 150,
          isVeg: true,
          image: {
            url: "/images/foods/punjab-tadka/jeera-rice.jpg",
            public_id: ""
          }
        }
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
          description: "Soft kulchas served with spicy Punjabi chole.",
          price: 140,
          isVeg: true,
          image: {
            url: "/images/foods/kulcha-junction/chole-kulche.jpg",
            public_id: ""
          }
        },
        {
          category: categories[3]._id,
          name: "Gol Gappe",
          description: "Crispy gol gappe with tangy mint water.",
          price: 80,
          isVeg: true,
          image: {
            url: "/images/foods/kulcha-junction/gol-gappe.jpg",
            public_id: ""
          }
        },
        {
          category: categories[3]._id,
          name: "Aloo Tikki",
          description: "Crispy potato patties with chutneys.",
          price: 90,
          isVeg: true,
          image: {
            url: "/images/foods/kulcha-junction/aloo-tikki.jpg",
            public_id: ""
          }
        },
        {
          category: categories[3]._id,
          name: "Papdi Chaat",
          description: "Crunchy papdi topped with yogurt.",
          price: 110,
          isVeg: true,
          image: {
            url: "/images/foods/kulcha-junction/papdi-chaat.jpg",
            public_id: ""
          }
        },
        {
          category: categories[3]._id,
          name: "Dahi Bhalla",
          description: "Soft lentil dumplings with yogurt.",
          price: 120,
          isVeg: true,
          image: {
            url: "/images/foods/kulcha-junction/dahi-bhalla.jpg",
            public_id: ""
          }
        },
        {
          category: categories[3]._id,
          name: "Samosa Chaat",
          description: "Samosa served with chole and chutneys.",
          price: 130,
          isVeg: true,
          image: {
            url: "/images/foods/kulcha-junction/samosa-chaat.jpg",
            public_id: ""
          }
        }
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
          description: "Classic Indo-Chinese stir-fried noodles.",
          price: 180,
          isVeg: true,
          image: { url: "/images/foods/spice-route/hakka-noodles.jpg", public_id: "" }
        },
        {
          category: categories[2]._id,
          name: "Chicken Manchurian",
          description: "Juicy chicken tossed in spicy Manchurian sauce.",
          price: 260,
          isVeg: false,
          image: { url: "/images/foods/spice-route/chicken-manchurian.jpg", public_id: "" }
        },
        {
          category: categories[2]._id,
          name: "Veg Fried Rice",
          description: "Stir-fried rice with fresh vegetables.",
          price: 170,
          isVeg: true,
          image: { url: "/images/foods/spice-route/veg-fried-rice.jpg", public_id: "" }
        },
        {
          category: categories[2]._id,
          name: "Chilli Paneer",
          description: "Paneer cubes tossed in spicy chilli sauce.",
          price: 220,
          isVeg: true,
          image: { url: "/images/foods/spice-route/chilli-paneer.jpg", public_id: "" }
        },
        {
          category: categories[2]._id,
          name: "Spring Rolls",
          description: "Crispy vegetable spring rolls.",
          price: 160,
          isVeg: true,
          image: { url: "/images/foods/spice-route/spring-rolls.jpg", public_id: "" }
        },
        {
          category: categories[2]._id,
          name: "Schezwan Rice",
          description: "Spicy Schezwan fried rice.",
          price: 190,
          isVeg: true,
          image: { url: "/images/foods/spice-route/schezwan-rice.jpg", public_id: "" }
        }
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
          description: "Soft milk dumplings soaked in sugar syrup.",
          price: 90,
          isVeg: true,
          image: { url: "/images/foods/sweet-cravings/gulab-jamun.jpg", public_id: "" }
        },
        {
          category: categories[4]._id,
          name: "Chocolate Cake",
          description: "Rich chocolate sponge with creamy frosting.",
          price: 180,
          isVeg: true,
          image: { url: "/images/foods/sweet-cravings/chocolate-cake.jpg", public_id: "" }
        },
        {
          category: categories[4]._id,
          name: "Brownie",
          description: "Warm chocolate brownie served fresh.",
          price: 140,
          isVeg: true,
          image: { url: "/images/foods/sweet-cravings/brownie.jpg", public_id: "" }
        },
        {
          category: categories[4]._id,
          name: "Rasmalai",
          description: "Soft cottage cheese dumplings in sweet milk.",
          price: 130,
          isVeg: true,
          image: { url: "/images/foods/sweet-cravings/rasmalai.jpg", public_id: "" }
        },
        {
          category: categories[4]._id,
          name: "Ice Cream Sundae",
          description: "Vanilla ice cream topped with chocolate syrup.",
          price: 160,
          isVeg: true,
          image: { url: "/images/foods/sweet-cravings/ice-cream-sundae.jpg", public_id: "" }
        },
        {
          category: categories[4]._id,
          name: "Red Velvet Pastry",
          description: "Soft red velvet pastry with cream cheese frosting.",
          price: 170,
          isVeg: true,
          image: { url: "/images/foods/sweet-cravings/red-velvet-pastry.jpg", public_id: "" }
        }
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
          description: "Creamy chilled coffee topped with whipped cream.",
          price: 150,
          isVeg: true,
          image: {
            url: "/images/foods/chai-and-chill/cold-coffee.jpg",
            public_id: ""
          }
        },
        {
          category: categories[5]._id,
          name: "Oreo Shake",
          description: "Rich Oreo milkshake with chocolate syrup.",
          price: 180,
          isVeg: true,
          image: {
            url: "/images/foods/chai-and-chill/oreo-shake.jpg",
            public_id: ""
          }
        },
        {
          category: categories[5]._id,
          name: "Masala Chai",
          description: "Traditional Indian tea with aromatic spices.",
          price: 60,
          isVeg: true,
          image: {
            url: "/images/foods/chai-and-chill/masala-chai.jpg",
            public_id: ""
          }
        },
        {
          category: categories[5]._id,
          name: "Green Tea",
          description: "Healthy green tea served hot.",
          price: 80,
          isVeg: true,
          image: {
            url: "/images/foods/chai-and-chill/green-tea.jpg",
            public_id: ""
          }
        },
        {
          category: categories[5]._id,
          name: "Virgin Mojito",
          description: "Refreshing mint and lime cooler.",
          price: 140,
          isVeg: true,
          image: {
            url: "/images/foods/chai-and-chill/mojito.jpg",
            public_id: ""
          }
        },
        {
          category: categories[5]._id,
          name: "Hot Chocolate",
          description: "Rich chocolate drink topped with marshmallows.",
          price: 160,
          isVeg: true,
          image: {
            url: "/images/foods/chai-and-chill/hot-chocolate.jpg",
            public_id: ""
          }
        },
        {
          category: categories[5]._id,
          name: "Veg Sandwich",
          description: "Grilled sandwich with fresh vegetables.",
          price: 130,
          isVeg: true,
          image: {
            url: "/images/foods/chai-and-chill/veg-sandwich.jpg",
            public_id: ""
          }
        },
        {
          category: categories[5]._id,
          name: "French Fries",
          description: "Crispy golden fries served with ketchup.",
          price: 110,
          isVeg: true,
          image: {
            url: "/images/foods/chai-and-chill/french-fries.jpg",
            public_id: ""
          }
        }
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
  
await Food.deleteMany({ restaurant: restaurant._id });

const insertedFoods = await Food.insertMany(
  data.foods.map((food) => ({
    ...food,
    restaurant: restaurant._id,
  }))
);

console.log(
  restaurant.name,
  "Inserted",
  insertedFoods.length,
  "foods"
);
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
  // console.log('Admin login -> email: admin@jammuekhaas.com | password: Admin@123');
  // console.log('Restaurant owner login -> email: owner@jammuekhaas.com | password: Owner@123');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
