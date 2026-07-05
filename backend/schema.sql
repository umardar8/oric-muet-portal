CREATE DATABASE IF NOT EXISTS oric_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE oric_portal;

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NULL UNIQUE,
  username VARCHAR(120) NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  portal_type ENUM('undergraduate','postgraduate','faculty','industry','startup','admin') NOT NULL,
  department VARCHAR(160) NULL,
  designation VARCHAR(160) NULL,
  roll_number VARCHAR(80) NULL,
  employee_id VARCHAR(80) NULL,
  phone VARCHAR(60) NULL,
  status ENUM('active','suspended','deleted') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_portal_type (portal_type),
  INDEX idx_users_status (status)
);

CREATE TABLE portal_posts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(80) NOT NULL,
  title VARCHAR(220) NOT NULL,
  body TEXT NOT NULL,
  meta VARCHAR(220) NULL,
  apply_link VARCHAR(255) NULL,
  image_url VARCHAR(255) NULL,
  status ENUM('open','expired','archived','removed') NOT NULL DEFAULT 'open',
  created_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE portal_post_audiences (
  post_id BIGINT UNSIGNED NOT NULL,
  portal_type ENUM('undergraduate','postgraduate','faculty','industry','startup','admin') NOT NULL,
  PRIMARY KEY (post_id, portal_type),
  FOREIGN KEY (post_id) REFERENCES portal_posts(id) ON DELETE CASCADE
);

CREATE TABLE submissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  feature_key VARCHAR(120) NOT NULL,
  portal_type ENUM('undergraduate','postgraduate','faculty','industry','startup','admin') NOT NULL,
  title VARCHAR(220) NOT NULL,
  summary TEXT NULL,
  details LONGTEXT NULL,
  image_url VARCHAR(255) NULL,
  status ENUM('pending','approved','rejected','archived') NOT NULL DEFAULT 'pending',
  remarks TEXT NULL,
  reviewed_by BIGINT UNSIGNED NULL,
  reviewed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_submissions_feature (feature_key),
  INDEX idx_submissions_status (status)
);

CREATE TABLE research_profiles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  orcid VARCHAR(80) NULL,
  google_scholar_url VARCHAR(255) NULL,
  ieee_xplore_url VARCHAR(255) NULL,
  photo_url VARCHAR(255) NULL,
  gender ENUM('female','male','other') NULL,
  short_bio TEXT NULL,
  detailed_description LONGTEXT NULL,
  research_interests TEXT NULL,
  supervised_students LONGTEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE listings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_user_id BIGINT UNSIGNED NULL,
  kind ENUM('startup','fyp','business_idea','thesis','research_project') NOT NULL,
  title VARCHAR(220) NOT NULL,
  summary TEXT NOT NULL,
  details LONGTEXT NULL,
  department VARCHAR(160) NULL,
  image_url VARCHAR(255) NULL,
  status ENUM('pending','approved','rejected','archived') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_listings_kind_status (kind, status)
);

CREATE TABLE partnership_requests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  listing_id BIGINT UNSIGNED NULL,
  project_submission_id BIGINT UNSIGNED NULL,
  requester_user_id BIGINT UNSIGNED NOT NULL,
  receiver_user_id BIGINT UNSIGNED NULL,
  request_type ENUM('startup_partnership','research_sponsorship') NOT NULL,
  proposal TEXT NOT NULL,
  status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  receiver_remarks TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL,
  FOREIGN KEY (project_submission_id) REFERENCES submissions(id) ON DELETE SET NULL,
  FOREIGN KEY (requester_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE feature_flags (
  feature_key VARCHAR(120) PRIMARY KEY,
  enabled TINYINT(1) NOT NULL DEFAULT 0,
  updated_by BIGINT UNSIGNED NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE feedback_forms (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  description TEXT NULL,
  schema_json JSON NOT NULL,
  status ENUM('active','archived') NOT NULL DEFAULT 'active',
  created_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE feedback_form_audiences (
  form_id BIGINT UNSIGNED NOT NULL,
  portal_type ENUM('undergraduate','postgraduate','faculty','industry','startup','admin') NOT NULL,
  PRIMARY KEY (form_id, portal_type),
  FOREIGN KEY (form_id) REFERENCES feedback_forms(id) ON DELETE CASCADE
);

CREATE TABLE feedback_responses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  form_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  response_json JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (form_id) REFERENCES feedback_forms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE resources (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  description TEXT NULL,
  file_path VARCHAR(255) NOT NULL,
  status ENUM('active','archived') NOT NULL DEFAULT 'active',
  uploaded_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE resource_audiences (
  resource_id BIGINT UNSIGNED NOT NULL,
  portal_type ENUM('undergraduate','postgraduate','faculty','industry','startup','admin') NOT NULL,
  PRIMARY KEY (resource_id, portal_type),
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(220) NOT NULL,
  body TEXT NOT NULL,
  actor_user_id BIGINT UNSIGNED NULL,
  target_user_id BIGINT UNSIGNED NULL,
  portal_type ENUM('undergraduate','postgraduate','faculty','industry','startup','admin') NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO feature_flags (feature_key, enabled)
VALUES
  ('startup-seed', 0),
  ('ip-registration', 0),
  ('project-monitoring', 0),
  ('mentorship', 0);
