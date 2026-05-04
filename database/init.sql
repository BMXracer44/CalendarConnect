CREATE DATABASE IF NOT EXISTS calendarConnectDB;
USE calendarConnectDB;
-- Users table 
CREATE TABLE users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  birthdate DATE NOT NULL,
  phone_number VARCHAR(20),
  bio TEXT,
  profile_picture_url VARCHAR(255),
  theme_preference ENUM('light',
  'dark') DEFAULT 'light',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP
);
-- User Privacy Settings Table (GDPR Compliance)
CREATE TABLE user_privacy_settings(
  user_id INT PRIMARY KEY,
  allow_friend_suggestions BOOLEAN DEFAULT FALSE,
  allow_location_tracking BOOLEAN DEFAULT FALSE,
  allow_third_party_data BOOLEAN DEFAULT FALSE, FOREIGN KEY(user_id) REFERENCES users(id)
ON DELETE CASCADE
);
-- Friendships Table 
CREATE TABLE friendships(
  id INT AUTO_INCREMENT PRIMARY KEY,
  requester_id INT NOT NULL,
  addressee_id INT NOT NULL,
  status ENUM('pending','accepted','declined','blocked') DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY(requester_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(addressee_id) REFERENCES users(id) ON DELETE CASCADE, 
  
  -- Prevents duplicate records 
  UNIQUE KEY unique_friendship(requester_id,addressee_id),

  -- prevents self friending 
  CONSTRAINT no_self_friend CHECK (requester_id <> addressee_id), 

  -- prevents reciprocal duplicates 
  CONSTRAINT check_order CHECK (requester_id < addressee_id) 
);
-- Events Table 
CREATE TABLE events(
  id INT AUTO_INCREMENT PRIMARY KEY,
  creator_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  LOCATION VARCHAR(255),
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(creator_id) REFERENCES users(id)
ON DELETE CASCADE
);
-- Event Members 
CREATE TABLE event_attendees (
  event_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('invited', 'going', 'declined') DEFAULT 'invited',
  PRIMARY KEY (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id)
    ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);
