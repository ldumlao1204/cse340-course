// Import any needed model functions
import { getUpcomingProjects, getProjectDetails, updateProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { createProject } from '../models/projects.js'; // This is already here from the previous step
import { body, validationResult } from 'express-validator';
import { addVolunteer, removeVolunteer, isVolunteering } from '../models/volunteers.js';


const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions  
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
        // 1. Get the project ID from the URL.
        const projectId = req.params.id;
        // 2. Fetch the main details for that project.
        const project = await getProjectDetails(projectId);

        // 3. If the project doesn't exist, send a 404 error.
        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }

        // 4. (This is the new part!) Fetch all categories associated with this project.
        const categories = await getCategoriesByProjectId(projectId);

        let userIsVolunteering = false;
        if (req.session.user) {
            userIsVolunteering = await isVolunteering(req.session.user.user_id, projectId);
        }

        // 5. Render the 'project.ejs' view, passing both the project details and the list of categories.
        res.render('project', { title: project.title, project, categories, userIsVolunteering });
    } catch (error) {
        next(error);
    }
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        // Redirect back to the new project form
        return res.redirect('/new-project');
    }

    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }

        const organizations = await getAllOrganizations();
        const title = 'Edit Service Project';

        // The date from the DB needs to be formatted to YYYY-MM-DD for the date input value
        project.date = new Date(project.date).toISOString().split('T')[0];

        res.render('edit-project', { title, project, organizations });
    } catch (error) {
        next(error);
    }
};

const processEditProjectForm = async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        // Redirect back to the edit project form
        return res.redirect(`/project/${req.params.id}/edit`);
    }

    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;

    await updateProject(projectId, title, description, location, date, organizationId);

    req.flash('success', 'Project updated successfully!');
    res.redirect(`/project/${projectId}`);
};

const processVolunteerForm = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await addVolunteer(userId, projectId);
    req.flash('success', 'You are now volunteering for this project!');
    res.redirect(`/project/${projectId}`);
};

const processUnvolunteerForm = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await removeVolunteer(userId, projectId);
    req.flash('success', 'You have removed yourself as a volunteer.');
    res.redirect(`/project/${projectId}`);
};


// Export any controller functions
export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm, processVolunteerForm, processUnvolunteerForm };