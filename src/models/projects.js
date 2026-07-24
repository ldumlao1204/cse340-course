import db from './db.js'

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date AS date,
            sp.organization_id,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_date >= CURRENT_DATE
        ORDER BY sp.project_date ASC
        LIMIT $1;
    `;

    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date AS date,
            sp.organization_id,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
           sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            sp.organization_id,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.organization_id = $1
        ORDER BY sp.project_date;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

export { getUpcomingProjects, getProjectDetails, getProjectsByOrganizationId, createProject };
