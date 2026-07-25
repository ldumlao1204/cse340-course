// Import any needed model functions
import { getAllCategories, getCategoryById, getProjectsByCategoryId, getCategoriesByProjectId, updateCategoryAssignments, createCategory, updateCategory } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Define validation rules for the category form
const categoryValidation = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        // 1. Get the category ID from the URL (e.g., from /category/1, the id is 1)
        const categoryId = req.params.id;
        // 2. Fetch the details for that specific category from the database.
        const category = await getCategoryById(categoryId);
        // 3. If no category is found with that ID, create a 404 error and pass it to the error handler.
        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        // 4. Fetch all service projects that belong to this category.
        const projects = await getProjectsByCategoryId(categoryId);

        // 5. Render the 'category.ejs' view, passing the category's name as the page title,
        //    the category object itself, and the list of associated projects.
        res.render('category', { title: category.name, category, projects });
    } catch (error) {
        next(error);
    }
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'Create New Category',
        formData: {},
        errors: []
    });
};

const processNewCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('new-category', {
            title: 'Create New Category',
            formData: req.body,
            errors: errors.array()
        });
    }

    try {
        const { name } = req.body;
        const newCategoryId = await createCategory(name);
        req.flash('success', 'Category created successfully!');
        res.redirect(`/category/${newCategoryId}`);
    } catch (error) {
        next(error);
    }
};

const showEditCategoryForm = async (req, res, next) => {
    try {
        const category = await getCategoryById(req.params.id);
        if (!category) {
            return next(); // Let the 404 handler catch it
        }
        res.render('edit-category', {
            title: 'Edit Category',
            category,
            errors: []
        });
    } catch (error) {
        next(error);
    }
};

const processEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If validation fails, re-render the form with errors
        const category = { category_id: categoryId, ...req.body };
        return res.render('edit-category', {
            title: 'Edit Category',
            category,
            errors: errors.array()
        });
    }

    try {
        const { name } = req.body;
        await updateCategory(categoryId, name);
        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        next(error);
    }
};

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, categoryValidation, showEditCategoryForm, processEditCategoryForm };