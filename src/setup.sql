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