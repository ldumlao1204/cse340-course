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