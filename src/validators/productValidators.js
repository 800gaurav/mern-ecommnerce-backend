const { body, param } = require("express-validator");

const commonProductRules = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({ min: 2, max: 140 })
    .withMessage("Product name must be between 2 and 140 characters."),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 10, max: 1200 })
    .withMessage("Description must be between 10 and 1200 characters."),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0."),
  body("category").optional().trim().notEmpty().withMessage("Category is required."),
  body("brand").optional().trim().notEmpty().withMessage("Brand is required."),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be an integer greater than or equal to 0."),
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5."),
];

const createProductValidator = [
  body("name").exists().withMessage("Product name is required."),
  body("description").exists().withMessage("Description is required."),
  body("price").exists().withMessage("Price is required."),
  body("category").exists().withMessage("Category is required."),
  body("brand").exists().withMessage("Brand is required."),
  body("stock").exists().withMessage("Stock is required."),
  ...commonProductRules,
];

const updateProductValidator = commonProductRules;

const productIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid product id."),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  productIdParamValidator,
};
