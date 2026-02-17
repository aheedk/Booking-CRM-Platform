-- Seed data for development
-- Admin password: admin123 (bcrypt hash)
-- Client password: client123 (bcrypt hash)

-- Admin user
INSERT INTO users (email, password, first_name, last_name, phone, role)
VALUES (
  'admin@bookingcrm.com',
  '$2b$10$m0jWaf8HAkYnjcEiywlg8uH7qUHyJv479RXRvbgwNaQQYaIjCjt1S',
  'Admin',
  'User',
  '555-0100',
  'admin'
);

-- Client users
INSERT INTO users (email, password, first_name, last_name, phone, role)
VALUES
  ('alice@example.com', '$2b$10$NRCBcAPFyuIriYcFUlSXNOJHfyhyg4HNwrzMcjOOWKqArBMA0nO7i', 'Alice', 'Johnson', '555-0101', 'client'),
  ('bob@example.com', '$2b$10$NRCBcAPFyuIriYcFUlSXNOJHfyhyg4HNwrzMcjOOWKqArBMA0nO7i', 'Bob', 'Smith', '555-0102', 'client');

-- Services
INSERT INTO services (name, description, duration, price)
VALUES
  ('Haircut', 'Standard haircut and styling', 30, 35.00),
  ('Hair Coloring', 'Full hair coloring service', 90, 120.00),
  ('Massage - 60 min', 'Full body relaxation massage', 60, 80.00),
  ('Facial Treatment', 'Deep cleansing facial', 45, 65.00),
  ('Manicure', 'Classic manicure with polish', 30, 25.00);
