const express = require("express");
const { 
    addCompany,
    getCompaniesDetails,
    getCompanyDetailById,
    updateCompanyDetails,
    updateCompanyLogo,
    deleteComapnyById
} = require("../controllers/companyController");
const upload = require("../middlewares/multer.middleware");

const router = express.Router();


router.route("/add").post(
    upload.fields([
        {
            name: "company_logo",
            maxCount: 1
        },
    ]),
    addCompany
);

router.route("/all").get(getCompaniesDetails);
router.route("/:_id").get(getCompanyDetailById).patch(updateCompanyDetails).delete(deleteComapnyById);
router.route("/logo/:_id").patch(updateCompanyLogo);


module.exports = router;