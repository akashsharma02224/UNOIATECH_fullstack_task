
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (buffer) => {
    console.log("buffer", buffer)
    try {
        if (!buffer) return null;

        // Convert the file buffer to a data URI
        const fileBase64 = `data:image/png;base64,${buffer.toString("base64")}`;

        // Upload directly to Cloudinary
        const response = await cloudinary.uploader.upload(fileBase64, {
            resource_type: "auto",
        });

        console.log("File uploaded to Cloudinary:", response.url);
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};

module.exports = { uploadOnCloudinary };
