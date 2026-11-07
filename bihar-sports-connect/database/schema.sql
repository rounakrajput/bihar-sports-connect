CREATE DATABASE IF NOT EXISTS bihar_sports_connect
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bihar_sports_connect;

-- Common login/account table (USER entity in the SRS).
-- Named `users` because USER is a reserved word in some MySQL contexts.
CREATE TABLE IF NOT EXISTS users (
  user_id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  email          VARCHAR(150) NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  phone          VARCHAR(15) NULL,
  role           ENUM('athlete','organization','admin') NOT NULL,
  account_status ENUM('active','suspended') NOT NULL DEFAULT 'active',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;
