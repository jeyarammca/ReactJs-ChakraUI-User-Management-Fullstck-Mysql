CREATE DATABASE IF NOT EXISTS interview_task;
USE interview_task;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    role VARCHAR(255),
    country VARCHAR(100)
);

INSERT INTO users (name, company_name, role, country) VALUES
('Terry Medhurst', 'Bogan-Lozano', 'Support Staff', 'United States'),
('Sheldon Quigley', 'Keebler-Hilpert', 'Human Resources', 'United Kingdom'),
('Terrill Hills', 'Kuhic-Sipes', 'Product Manager', 'Canada'),
('Miles Cummerata', 'Brakus-Mertz', 'Software Engineer', 'Australia'),
('Mavis Schultz', 'Huel-Mraz', 'Data Scientist', 'Germany'),
('Alison Reichert', 'Prosacco-Blanda', 'Designer', 'France'),
('Oleta Abbott', 'Kertzmann-Bernhard', 'Developer', 'India'),
('Ewell Mueller', 'Gerhold-Gislason', 'QA Engineer', 'Brazil'),
('Demetrius Corkery', 'Schinner-Kovacek', 'DevOps', 'Japan'),
('Eleanora Price', 'Toy-Schultz', 'Marketing', 'China');
