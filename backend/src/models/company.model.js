const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    company_name: {
        type: String,
        // lowercase: true,
        trim: true,
        index: true
    },
    company_logo: {
        type: String, // cloudinary/AWS URL
    },
    website_screenshot: {
        type: String, // cloudinary/AWS URL
    },
    description: {
        type: String,
        trim: true,
        index: true
    },
    address: {
        type: String,
        trim: true,
        index: true
    },
    phone_number: {
        type: Number,
    },
    email: {
        type: String,
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