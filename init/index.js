const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

main()
    .then(() => console.log("connected to DB"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://Swarnabha:n4AkOKFhQlDZJsBv@cluster0.e1tky6a.mongodb.net/?appName=Cluster0');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "6a86fa289545bc54ea097ac2"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();