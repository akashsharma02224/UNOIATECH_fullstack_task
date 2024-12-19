const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const ApiResponse = require("../utils/ApiResponse");
const Company = require("../models/company.model");

const addCompany = asyncHandler ( async (req, resp) => {
    const { company_name, description, address, email, phone_number } = req.body;
    const { company_logo, website_screenshot } = req.files;

    if(
        [company_name, description, address, email, phone_number].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields are required");
    }
    const companyLogo = company_logo[0]?.buffer;
    const websiteScreenshot = website_screenshot[0]?.buffer;
 
    const existedCompany = await Company.findOne({
        $or: [{ company_name }, { email }, { address }]
    });

    if(existedCompany) {
        throw new ApiError(409, "company with email or company_name is already exist");
    }

    if(!companyLogo || !websiteScreenshot) {
        throw new ApiError(400, "Comapny logo and Website Screenshot is required");
    }

    const companyURL = await uploadOnCloudinary(company_logo[0].buffer);
    const websiteScreenshotURL = await uploadOnCloudinary(website_screenshot[0].buffer);

    

    const company = await Company.create({
        company_name,
        email,
        description,
        address,
        phone_number,
        company_logo: companyURL.url,
        social_profiles: req.body.social_profiles,
        website_screenshot: websiteScreenshotURL.url

    });

    const createdCompany = await Company.findById(company._id);

    if(!createdCompany) {
        throw new ApiError(500, "Something went wrong while creating company");
    }

    return resp.status(201).json(
        new ApiResponse(200, createdCompany, "User Registered Successfully")
    );
});

const getCompaniesDetails = asyncHandler ( async (req, resp) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const companyDetails = await Company.find().skip(skip).limit(parseInt(limit))
    if(!companyDetails || companyDetails.length === 0) {
        throw new ApiError(404, "No Record Found");
    }
    const totalRecords = await Company.countDocuments();
    return resp.status(201).json(
        new ApiResponse(200,
            {
                data: companyDetails,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalRecords / limit),
                    totalRecords,
                }
            },
            "fetched details successfully"
        )
    )
});

const getCompanyDetailById = asyncHandler ( async (req, resp) => {
    const companyDetail = await Company.findOne({ _id: req.params._id });
    if(!companyDetail) {
        throw new ApiError(404, "No Record Found");
    }
    
    return resp.status(201).json(
        new ApiResponse(200,
            companyDetail,
            "fetched details successfully"
        )
    )
});


const updateCompanyDetails = asyncHandler( async(req, resp) => {
    const { company_name, description, address, email, phone_number } = req.body;

    if(!company_name || !email || !description || !address) {
        throw new ApiError(400, "All fields are required");
    }
    const updateFields = {};
    if (company_name) updateFields.company_name = company_name;
    if (email) updateFields.email = email;
    if (description) updateFields.description = description;
    if (address) updateFields.address = address;
    if (phone_number) updateFields.phone_number = phone_number;

    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "At least one field is required to update");
    }

    const company = await Company.findByIdAndUpdate(
        req.params._id,
        { $set: updateFields },
        { new: true }
    );

    return resp
    .status(200)
    .json(
        new ApiResponse(
            200,
            company,
            "Company details update successfully"
        )
    );
});

const updateCompanyLogo = asyncHandler( async(req, resp) => {
    const companyLogoLocalPath = req.file?.path;

    if(!companyLogoLocalPath) {
        throw new ApiError(400, "Logo file is missing");
    }

    const company_logo = await uploadOnCloudinary(companyLogoLocalPath);

    if(!company_logo.url) {
        throw new ApiError(400, "Error while uploading logo on cloudinary");
    }

    const company = await Company.findByIdAndUpdate(
        req.params._id,
        {
            $set: {
                company_logo: company_logo.url
            }
        },
        { new: true }
    );

    return resp
    .status(200)
    .json(
        new ApiResponse(
            200,
            company,
            "Logo is updated successfully"
        )
    );
});

const deleteComapnyById = asyncHandler ( async (req, resp) => {
    const company = await Company.findByIdAndDelete({ _id: req.params._id });
    if(!company) {
        throw new ApiError(404, "No record found")
    }
    return resp
    .status(200)
    .json(
        new ApiResponse(
            200,
            company,
            "Record deleted successfully"
        )
    )
})

module.exports = { 
    addCompany,
    getCompaniesDetails,
    getCompanyDetailById,
    updateCompanyDetails,
    updateCompanyLogo,
    deleteComapnyById
};