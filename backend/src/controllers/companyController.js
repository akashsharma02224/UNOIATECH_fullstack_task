const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const ApiResponse = require("../utils/ApiResponse");
const Company = require("../models/company.model");
const puppeteer = require('puppeteer');
const fs = require('fs');


const scrapeWebsite =  asyncHandler ( async (req, resp) => {
    const url = req.body.url;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
  
    try {
      // Navigate to the website
      await page.goto(url, { waitUntil: 'networkidle2' });
  
    const screenshotBuffer = await page.screenshot();

    // Upload the screenshot to Cloudinary
    const screenshotUpload = await uploadOnCloudinary(screenshotBuffer);
    const screenshotURL = screenshotUpload ? screenshotUpload.url : null;
  
      // Extract title and meta description
      const title = await page.title();
      const description = await page.evaluate(() => {
        const metaDesc = document.querySelector('meta[name="description"]');
        return metaDesc ? metaDesc.content : 'No description available';
      });
  
      // Extract social links
      const socialLinks = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href]'));
        return anchors
          .map((a) => a.href)
          .filter((link) =>
            /facebook|twitter|instagram|linkedin|youtube|pinterest/i.test(link)
          );
      });

       // Extract email addresses
       const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
       const pageContent = await page.content();
       const emailAddresses = [...pageContent.matchAll(emailRegex)].map((match) => match[0]);

    //   Extract logo
    const logo = await page.evaluate(() => {
        const logoSelectors = [
            'img[src*="logo"]', 
            'img[alt*="logo"]', 
            'link[rel="icon"]', 
            'link[rel="shortcut icon"]', 
        ];
        for (const selector of logoSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element.src || element.href || '';
            }
        }
        return null; // Return null if no logo found
    });

    const addressRegex = /\d{1,5}\s\w+(\s\w+)*,\s\w+(\s\w+)*,\s\w+(\s\w+)*(\s\d{5})?/g;
    const addresses = [...pageContent.matchAll(addressRegex)].map((match) => match[0]);

    const phoneRegex = /(\+?\d{1,4}[\s-]?)?(\(?\d{2,3}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}/g;
    const phoneNumbers = [...pageContent.matchAll(phoneRegex)].map((match) => match[0]);
  
      // Collect all data
      const data = {
        company_name: title,
        email: emailAddresses[0],
        description,
        address: addresses[0],
        phone_number: phoneNumbers[0],
        company_logo: logo,
        social_profiles: [],
        website_screenshot: screenshotURL,
      };
  
      console.log('Scraped Data:', data);
      const company = await Company.create(data);

    const createdCompany = await Company.findById(company._id);

    if(!createdCompany) {
        throw new ApiError(500, "Something went wrong while creating company");
    }

      return resp.status(201).json(
        new ApiResponse(200,
            createdCompany,
            "fetched details successfully"
        )
    )


    } catch (error) {
      console.error('Error scraping the website:', error.message);
    } finally {
      await browser.close();
    }
  });

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
    deleteComapnyById,
    scrapeWebsite
};