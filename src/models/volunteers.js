import db from './db.js'

const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO service_project_volunteer (user_id, project_id)
        VALUES ($1, $2)
    `;
    await db.query(query, [userId, projectId]);
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM service_project_volunteer
        WHERE user_id = $1 AND project_id = $2
    `;
    await db.query(query, [userId, projectId]);
};

const isVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM service_project_volunteer
        WHERE user_id = $1 AND project_id = $2
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

const getVolunteeredProjectsByUserId = async (userId) => {
    const query = `
        SELECT sp.project_id, sp.title, sp.project_date
        FROM service_project sp
        JOIN service_project_volunteer spv ON sp.project_id = spv.project_id
        WHERE spv.user_id = $1
        ORDER BY sp.project_date
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

export { addVolunteer, removeVolunteer, isVolunteering, getVolunteeredProjectsByUserId };