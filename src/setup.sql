-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- =====================================
-- Insert sample data: Organizations
-- =====================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.')
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.')	
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.')

SELECT * FROM organization

-- ========================================
-- Service Project Table
-- ========================================

CREATE TABLE service_project (
    project_id      SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title           VARCHAR(150) NOT NULL,
    description     TEXT,
    location        VARCHAR(150),
    project_date    DATE,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
        ON DELETE CASCADE
);

-- =====================================
-- Insert sample data: Service Projects
-- =====================================
INSERT INTO service_project (organization_id, title, description, location, project_date)
VALUES
(1, 'Community Garden Cleanup', 'Weekend cleanup of the downtown lot', 'Downtown Park', '2026-08-15'),
(1, 'Senior Home Repairs', 'Fixing roofs, railings, and plumbing for elderly residents on fixed incomes.', 'Maple Grove Neighborhood', '2026-09-05'),
(1, 'Wheelchair Ramp Build', 'Constructing accessibility ramps for residents with mobility needs.', 'Oakwood District', '2026-09-19'),
(1, 'Storm Shelter Restoration', 'Repairing community storm shelters ahead of hurricane season.', 'Riverside County', '2026-10-03'),
(1, 'Playground Rebuild', 'Rebuilding an unsafe public playground with new equipment.', 'Lincoln Park', '2026-10-17'),

(2, 'Community Garden Expansion', 'Expanding the neighborhood garden to grow more fresh produce for local families.', 'Elm Street Lot', '2026-08-15'),
(2, 'Seed Distribution Day', 'Handing out vegetable seed kits to local families for home gardening.', 'Farmers Market Plaza', '2026-09-01'),
(2, 'Compost Workshop', 'Teaching residents how to compost food waste for garden use.', 'GreenHarvest Learning Center', '2026-09-15'),
(2, 'Urban Orchard Planting', 'Planting fruit trees in vacant city lots to create a public orchard.', 'Willow Avenue Lot', '2026-09-29'),
(2, 'Farm-to-Table Fundraiser', 'Hosting a community dinner using produce grown at the urban farm.', 'GreenHarvest Farm', '2026-10-13'),

(3, 'Back-to-School Supply Drive', 'Collecting and distributing school supplies to underserved students.', 'Central Community Center', '2026-08-22'),
(3, 'Winter Coat Drive', 'Collecting and distributing warm coats to families in need before winter.', 'UnityServe Warehouse', '2026-11-07'),
(3, 'Food Pantry Restock', 'Organizing and restocking shelves at the local food pantry.', 'Hope Street Food Pantry', '2026-09-08'),
(3, 'Senior Center Visits', 'Coordinating volunteer visits and activities at the senior center.', 'Willowbrook Senior Center', '2026-09-22'),
(3, 'Youth Mentorship Kickoff', 'Launching a new mentorship program pairing volunteers with local youth.', 'Central Community Center', '2026-10-06');

SELECT * FROM service_project;

-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id  SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL UNIQUE
);

-- Insert sample data: Categories
INSERT INTO category (name)
VALUES
('Environment'),
('Education'),
('Community Development'),
('Health & Wellness'),
('Food Security');

-- ========================================
-- Service Project <-> Category Table
-- ========================================
CREATE TABLE service_project_category (
    project_id   INTEGER NOT NULL,
    category_id  INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES service_project (project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES category (category_id)
        ON DELETE CASCADE
);

INSERT INTO service_project_category (project_id, category_id)
VALUES
-- Org 1: BrightFuture Builders
(1, 3),              -- Community Garden Cleanup -> Community Development
(1, 1),              -- Community Garden Cleanup -> Environment
(2, 3),              -- Senior Home Repairs -> Community Development
(2, 4),              -- Senior Home Repairs -> Health & Wellness
(3, 3),              -- Wheelchair Ramp Build -> Community Development
(4, 3),              -- Storm Shelter Restoration -> Community Development
(5, 3),              -- Playground Rebuild -> Community Development

-- Org 2: GreenHarvest Growers
(6, 1),              -- Community Garden Expansion -> Environment
(6, 5),              -- Community Garden Expansion -> Food Security
(7, 5),              -- Seed Distribution Day -> Food Security
(8, 1),              -- Compost Workshop -> Environment
(8, 2),              -- Compost Workshop -> Education
(9, 1),              -- Urban Orchard Planting -> Environment
(10, 5),             -- Farm-to-Table Fundraiser -> Food Security

-- Org 3: UnityServe Volunteers
(11, 2),             -- Back-to-School Supply Drive -> Education
(12, 3),             -- Winter Coat Drive -> Community Development
(13, 5),             -- Food Pantry Restock -> Food Security
(14, 4),             -- Senior Center Visits -> Health & Wellness
(15, 2);             -- Youth Mentorship Kickoff -> Education

SELECT * FROM service_project_category ORDER BY project_id, category_id;
SELECT * FROM category;
SELECT sp.project_id, sp.title, c.name AS category
FROM service_project sp
JOIN service_project_category spc ON sp.project_id = spc.project_id
JOIN category c ON spc.category_id = c.category_id
ORDER BY sp.project_id;