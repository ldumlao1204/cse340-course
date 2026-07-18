// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

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

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };