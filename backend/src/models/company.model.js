const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: true,
        unique: true,
        // lowercase: true,
        trim: true,
        index: true
    },
    company_logo: {
        type: String, // cloudinary/AWS URL
        // required: true
    },
    description: {
        type: String,
        // required: true,
        trim: true,
        index: true
    },
    address: {
        type: String,
        // required: true,
        trim: true,
        index: true
    },
    phone_number: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    social_profiles: [{
        link: {
            type: String
        },
        platform: {
            type: String,
            enum: ["facebook", "twitter", "linkedin", "instagram"],
        }
    }]
});

module.exports = mongoose.model("Company", companySchema);