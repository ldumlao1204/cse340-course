// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { createProject } from '../models/projects.js';

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

        // 5. Render the 'project.ejs' view, passing both the project details and the list of categories.
        res.render('project', { title: project.title, project, categories });
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

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm };