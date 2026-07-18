// Import any needed model functions
import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

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

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };