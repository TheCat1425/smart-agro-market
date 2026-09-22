-- ============================================================
-- Smart Agro Market — Seed Data
-- Realistic demo records consistent with frontend mock data
-- ============================================================

USE smart_agro_market;

-- ──────────────────────────────────────────────
-- 1. USERS
-- ──────────────────────────────────────────────
-- Passwords are bcrypt hashes of 'Password123!' (for demo only — never ship real credentials)
-- Generated with cost factor 10
INSERT INTO users (id, full_name, email, phone, password_hash, role, location, district, upazila, latitude, longitude, is_active, created_at)
VALUES
  (1, 'Abdul Karim',    'abdul.karim@example.com',    '+8801711000001', '$2a$10$xJ8Kz7V5QpGv3YvZrFqOGeX3l4m9Nk6rYzK5cH7wU2dP0oB1sT4yi', 'FARMER',   'Rajshahi', 'Rajshahi', 'Boalia',       24.3745000, 88.6042000, 1, '2024-01-15 09:00:00'),
  (2, 'Rahim Ahmed',    'rahim.ahmed@example.com',    '+8801811000002', '$2a$10$xJ8Kz7V5QpGv3YvZrFqOGeX3l4m9Nk6rYzK5cH7wU2dP0oB1sT4yi', 'FARMER',   'Naogaon',  'Naogaon',  'Naogaon Sadar', 24.7936000, 88.9318000, 1, '2024-03-22 10:30:00'),
  (3, 'Karim Mia',      'karim.mia@example.com',      '+8801911000003', '$2a$10$xJ8Kz7V5QpGv3YvZrFqOGeX3l4m9Nk6rYzK5cH7wU2dP0oB1sT4yi', 'FARMER',   'Pabna',    'Pabna',    'Pabna Sadar',   24.0064000, 89.2372000, 1, '2023-11-08 08:15:00'),
  (4, 'Mohammad Hasan', 'mohammad.hasan@example.com', '+8801611000004', '$2a$10$xJ8Kz7V5QpGv3YvZrFqOGeX3l4m9Nk6rYzK5cH7wU2dP0oB1sT4yi', 'CONSUMER', 'Dhaka',    'Dhaka',    'Mirpur',        23.8103000, 90.4125000, 1, '2024-05-10 14:00:00'),
  (5, 'Admin User',     'admin@smartagromarket.com',  '+8801511000005', '$2a$10$xJ8Kz7V5QpGv3YvZrFqOGeX3l4m9Nk6rYzK5cH7wU2dP0oB1sT4yi', 'ADMIN',    'Dhaka',    'Dhaka',    'Dhanmondi',     23.7465000, 90.3762000, 1, '2023-06-01 00:00:00'),
  -- Additional consumers for orders
  (6, 'Fatema Begum',   'fatema.begum@example.com',   '+8801711000006', '$2a$10$xJ8Kz7V5QpGv3YvZrFqOGeX3l4m9Nk6rYzK5cH7wU2dP0oB1sT4yi', 'CONSUMER', 'Rajshahi', 'Rajshahi', 'Shah Makhdum',  24.3600000, 88.5900000, 1, '2024-06-12 11:00:00'),
  (7, 'Nusrat Jahan',   'nusrat.jahan@example.com',   '+8801811000007', '$2a$10$xJ8Kz7V5QpGv3YvZrFqOGeX3l4m9Nk6rYzK5cH7wU2dP0oB1sT4yi', 'CONSUMER', 'Bogura',   'Bogura',   'Bogura Sadar',  24.8465000, 89.3773000, 1, '2024-07-20 16:30:00'),
  (8, 'Aminul Islam',   'aminul.islam@example.com',   '+8801911000008', '$2a$10$xJ8Kz7V5QpGv3YvZrFqOGeX3l4m9Nk6rYzK5cH7wU2dP0oB1sT4yi', 'CONSUMER', 'Pabna',    'Pabna',    'Pabna Sadar',   24.0100000, 89.2400000, 1, '2024-08-05 09:45:00'),
  (9, 'Rafiq Uddin',    'rafiq.uddin@example.com',    '+8801611000009', '$2a$10$xJ8Kz7V5QpGv3YvZrFqOGeX3l4m9Nk6rYzK5cH7wU2dP0oB1sT4yi', 'CONSUMER', 'Naogaon',  'Naogaon',  'Naogaon Sadar', 24.8000000, 88.9400000, 1, '2024-04-18 13:20:00'),
  (10, 'Sumaiya Akhter', 'sumaiya.akhter@example.com', '+8801511000010', '$2a$10$xJ8Kz7V5QpGv3YvZrFqOGeX3l4m9Nk6rYzK5cH7wU2dP0oB1sT4yi', 'CONSUMER', 'Dhaka',   'Dhaka',    'Uttara',        23.8700000, 90.3990000, 1, '2024-09-01 10:00:00');

-- ──────────────────────────────────────────────
-- 2. FARMERS
-- ──────────────────────────────────────────────
INSERT INTO farmers (id, user_id, farm_name, farm_location, district, upazila, farm_size, verification_status, created_at)
VALUES
  (1, 1, 'Karim Agro Farm',    'Boalia, Rajshahi',       'Rajshahi', 'Boalia',        5.50,  'VERIFIED', '2024-01-15 09:00:00'),
  (2, 2, 'Ahmed Krishi Khamar', 'Naogaon Sadar, Naogaon', 'Naogaon',  'Naogaon Sadar', 3.25,  'VERIFIED', '2024-03-22 10:30:00'),
  (3, 3, 'Mia Organic Farm',   'Pabna Sadar, Pabna',     'Pabna',    'Pabna Sadar',   8.00,  'VERIFIED', '2023-11-08 08:15:00');

-- ──────────────────────────────────────────────
-- 3. COMMODITIES
-- ──────────────────────────────────────────────
INSERT INTO commodities (id, name, name_bn, category, unit, description, is_active)
VALUES
  (1, 'Tomato',  'টমেটো',  'Vegetable', 'kg', 'Fresh tomatoes — widely grown in Rajshahi division', 1),
  (2, 'Potato',  'আলু',    'Vegetable', 'kg', 'Staple root vegetable — cold-stored year-round',     1),
  (3, 'Onion',   'পেঁয়াজ', 'Vegetable', 'kg', 'Essential cooking ingredient — volatile pricing',    1),
  (4, 'Rice',    'চাল',    'Grain',     'kg', 'Primary staple — Aman, Boro and Aus seasons',        1),
  (5, 'Brinjal', 'বেগুন',  'Vegetable', 'kg', 'Popular eggplant variety across Bangladesh',          1);

-- ──────────────────────────────────────────────
-- 4. MARKETS
-- ──────────────────────────────────────────────
INSERT INTO markets (id, name, name_bn, market_type, district, upazila, address, latitude, longitude, base_transport_cost, transport_cost_per_km, is_active)
VALUES
  (1, 'Rajshahi Central Market', 'রাজশাহী কেন্দ্রীয় বাজার', 'Wholesale', 'Rajshahi', 'Boalia',         'Station Road, Rajshahi',   24.3745000, 88.6042000,  50.00,  5.00, 1),
  (2, 'Naogaon Market',          'নওগাঁ বাজার',              'Retail',    'Naogaon',  'Naogaon Sadar',  'Naogaon Town Center',      24.7936000, 88.9318000,  40.00,  4.50, 1),
  (3, 'Pabna Market',            'পাবনা বাজার',              'Retail',    'Pabna',    'Pabna Sadar',    'Pabna Town Center',        24.0064000, 89.2372000,  40.00,  4.50, 1),
  (4, 'Bogura Market',           'বগুড়া বাজার',             'Wholesale', 'Bogura',   'Bogura Sadar',   'Bogura Shaheed Zia Road',  24.8465000, 89.3773000,  45.00,  5.00, 1),
  (5, 'Dhaka Wholesale Market',  'ঢাকা পাইকারী বাজার',       'Wholesale', 'Dhaka',    'Jatrabari',      'Jatrabari, Dhaka',         23.8103000, 90.4125000, 100.00,  6.00, 1);

-- ──────────────────────────────────────────────
-- 5. MARKET PRICES  (7 days: Sep 5–Sep 11, 2026)
-- ──────────────────────────────────────────────
-- We insert prices for all 5 commodities × 5 markets × 7 days = 175 rows
-- The latest day (Sep 11) matches the frontend mockData.ts exactly.

-- ---- Sep 5 ----
INSERT INTO market_prices (market_id, commodity_id, price, min_price, max_price, unit, price_date, source) VALUES
  -- Tomato
  (1,1, 45.00, 42.00, 48.00, 'kg', '2026-09-05', 'DAM'),
  (2,1, 42.00, 39.00, 45.00, 'kg', '2026-09-05', 'DAM'),
  (3,1, 44.00, 41.00, 47.00, 'kg', '2026-09-05', 'DAM'),
  (4,1, 40.00, 37.00, 43.00, 'kg', '2026-09-05', 'DAM'),
  (5,1, 55.00, 52.00, 58.00, 'kg', '2026-09-05', 'DAM'),
  -- Potato
  (1,2, 25.00, 23.00, 27.00, 'kg', '2026-09-05', 'DAM'),
  (2,2, 23.00, 21.00, 25.00, 'kg', '2026-09-05', 'DAM'),
  (3,2, 27.00, 25.00, 29.00, 'kg', '2026-09-05', 'DAM'),
  (4,2, 24.00, 22.00, 26.00, 'kg', '2026-09-05', 'DAM'),
  (5,2, 30.00, 28.00, 32.00, 'kg', '2026-09-05', 'DAM'),
  -- Onion
  (1,3, 60.00, 57.00, 63.00, 'kg', '2026-09-05', 'DAM'),
  (2,3, 57.00, 54.00, 60.00, 'kg', '2026-09-05', 'DAM'),
  (3,3, 58.00, 55.00, 61.00, 'kg', '2026-09-05', 'DAM'),
  (4,3, 62.00, 59.00, 65.00, 'kg', '2026-09-05', 'DAM'),
  (5,3, 70.00, 67.00, 73.00, 'kg', '2026-09-05', 'DAM'),
  -- Rice
  (1,4, 48.00, 46.00, 50.00, 'kg', '2026-09-05', 'DAM'),
  (2,4, 46.00, 44.00, 48.00, 'kg', '2026-09-05', 'DAM'),
  (3,4, 50.00, 48.00, 52.00, 'kg', '2026-09-05', 'DAM'),
  (4,4, 47.00, 45.00, 49.00, 'kg', '2026-09-05', 'DAM'),
  (5,4, 54.00, 52.00, 56.00, 'kg', '2026-09-05', 'DAM'),
  -- Brinjal
  (1,5, 35.00, 32.00, 38.00, 'kg', '2026-09-05', 'DAM'),
  (2,5, 33.00, 30.00, 36.00, 'kg', '2026-09-05', 'DAM'),
  (3,5, 36.00, 33.00, 39.00, 'kg', '2026-09-05', 'DAM'),
  (4,5, 32.00, 29.00, 35.00, 'kg', '2026-09-05', 'DAM'),
  (5,5, 42.00, 39.00, 45.00, 'kg', '2026-09-05', 'DAM');

-- ---- Sep 6 ----
INSERT INTO market_prices (market_id, commodity_id, price, min_price, max_price, unit, price_date, source) VALUES
  (1,1, 48.00, 45.00, 51.00, 'kg', '2026-09-06', 'DAM'),
  (2,1, 44.00, 41.00, 47.00, 'kg', '2026-09-06', 'DAM'),
  (3,1, 46.00, 43.00, 49.00, 'kg', '2026-09-06', 'DAM'),
  (4,1, 42.00, 39.00, 45.00, 'kg', '2026-09-06', 'DAM'),
  (5,1, 57.00, 54.00, 60.00, 'kg', '2026-09-06', 'DAM'),
  (1,2, 26.00, 24.00, 28.00, 'kg', '2026-09-06', 'DAM'),
  (2,2, 24.00, 22.00, 26.00, 'kg', '2026-09-06', 'DAM'),
  (3,2, 28.00, 26.00, 30.00, 'kg', '2026-09-06', 'DAM'),
  (4,2, 25.00, 23.00, 27.00, 'kg', '2026-09-06', 'DAM'),
  (5,2, 31.00, 29.00, 33.00, 'kg', '2026-09-06', 'DAM'),
  (1,3, 62.00, 59.00, 65.00, 'kg', '2026-09-06', 'DAM'),
  (2,3, 58.00, 55.00, 61.00, 'kg', '2026-09-06', 'DAM'),
  (3,3, 60.00, 57.00, 63.00, 'kg', '2026-09-06', 'DAM'),
  (4,3, 64.00, 61.00, 67.00, 'kg', '2026-09-06', 'DAM'),
  (5,3, 72.00, 69.00, 75.00, 'kg', '2026-09-06', 'DAM'),
  (1,4, 49.00, 47.00, 51.00, 'kg', '2026-09-06', 'DAM'),
  (2,4, 47.00, 45.00, 49.00, 'kg', '2026-09-06', 'DAM'),
  (3,4, 51.00, 49.00, 53.00, 'kg', '2026-09-06', 'DAM'),
  (4,4, 48.00, 46.00, 50.00, 'kg', '2026-09-06', 'DAM'),
  (5,4, 55.00, 53.00, 57.00, 'kg', '2026-09-06', 'DAM'),
  (1,5, 36.00, 33.00, 39.00, 'kg', '2026-09-06', 'DAM'),
  (2,5, 34.00, 31.00, 37.00, 'kg', '2026-09-06', 'DAM'),
  (3,5, 37.00, 34.00, 40.00, 'kg', '2026-09-06', 'DAM'),
  (4,5, 33.00, 30.00, 36.00, 'kg', '2026-09-06', 'DAM'),
  (5,5, 43.00, 40.00, 46.00, 'kg', '2026-09-06', 'DAM');

-- ---- Sep 7 ----
INSERT INTO market_prices (market_id, commodity_id, price, min_price, max_price, unit, price_date, source) VALUES
  (1,1, 50.00, 47.00, 53.00, 'kg', '2026-09-07', 'DAM'),
  (2,1, 46.00, 43.00, 49.00, 'kg', '2026-09-07', 'DAM'),
  (3,1, 48.00, 45.00, 51.00, 'kg', '2026-09-07', 'DAM'),
  (4,1, 44.00, 41.00, 47.00, 'kg', '2026-09-07', 'DAM'),
  (5,1, 60.00, 57.00, 63.00, 'kg', '2026-09-07', 'DAM'),
  (1,2, 27.00, 25.00, 29.00, 'kg', '2026-09-07', 'DAM'),
  (2,2, 25.00, 23.00, 27.00, 'kg', '2026-09-07', 'DAM'),
  (3,2, 29.00, 27.00, 31.00, 'kg', '2026-09-07', 'DAM'),
  (4,2, 26.00, 24.00, 28.00, 'kg', '2026-09-07', 'DAM'),
  (5,2, 32.00, 30.00, 34.00, 'kg', '2026-09-07', 'DAM'),
  (1,3, 65.00, 62.00, 68.00, 'kg', '2026-09-07', 'DAM'),
  (2,3, 60.00, 57.00, 63.00, 'kg', '2026-09-07', 'DAM'),
  (3,3, 62.00, 59.00, 65.00, 'kg', '2026-09-07', 'DAM'),
  (4,3, 66.00, 63.00, 69.00, 'kg', '2026-09-07', 'DAM'),
  (5,3, 74.00, 71.00, 77.00, 'kg', '2026-09-07', 'DAM'),
  (1,4, 50.00, 48.00, 52.00, 'kg', '2026-09-07', 'DAM'),
  (2,4, 48.00, 46.00, 50.00, 'kg', '2026-09-07', 'DAM'),
  (3,4, 52.00, 50.00, 54.00, 'kg', '2026-09-07', 'DAM'),
  (4,4, 49.00, 47.00, 51.00, 'kg', '2026-09-07', 'DAM'),
  (5,4, 56.00, 54.00, 58.00, 'kg', '2026-09-07', 'DAM'),
  (1,5, 37.00, 34.00, 40.00, 'kg', '2026-09-07', 'DAM'),
  (2,5, 35.00, 32.00, 38.00, 'kg', '2026-09-07', 'DAM'),
  (3,5, 38.00, 35.00, 41.00, 'kg', '2026-09-07', 'DAM'),
  (4,5, 34.00, 31.00, 37.00, 'kg', '2026-09-07', 'DAM'),
  (5,5, 44.00, 41.00, 47.00, 'kg', '2026-09-07', 'DAM');

-- ---- Sep 8 ----
INSERT INTO market_prices (market_id, commodity_id, price, min_price, max_price, unit, price_date, source) VALUES
  (1,1, 52.00, 49.00, 55.00, 'kg', '2026-09-08', 'DAM'),
  (2,1, 48.00, 45.00, 51.00, 'kg', '2026-09-08', 'DAM'),
  (3,1, 50.00, 47.00, 53.00, 'kg', '2026-09-08', 'DAM'),
  (4,1, 45.00, 42.00, 48.00, 'kg', '2026-09-08', 'DAM'),
  (5,1, 62.00, 59.00, 65.00, 'kg', '2026-09-08', 'DAM'),
  (1,2, 28.00, 26.00, 30.00, 'kg', '2026-09-08', 'DAM'),
  (2,2, 26.00, 24.00, 28.00, 'kg', '2026-09-08', 'DAM'),
  (3,2, 30.00, 28.00, 32.00, 'kg', '2026-09-08', 'DAM'),
  (4,2, 27.00, 25.00, 29.00, 'kg', '2026-09-08', 'DAM'),
  (5,2, 33.00, 31.00, 35.00, 'kg', '2026-09-08', 'DAM'),
  (1,3, 63.00, 60.00, 66.00, 'kg', '2026-09-08', 'DAM'),
  (2,3, 59.00, 56.00, 62.00, 'kg', '2026-09-08', 'DAM'),
  (3,3, 65.00, 62.00, 68.00, 'kg', '2026-09-08', 'DAM'),
  (4,3, 65.00, 62.00, 68.00, 'kg', '2026-09-08', 'DAM'),
  (5,3, 73.00, 70.00, 76.00, 'kg', '2026-09-08', 'DAM'),
  (1,4, 50.00, 48.00, 52.00, 'kg', '2026-09-08', 'DAM'),
  (2,4, 48.00, 46.00, 50.00, 'kg', '2026-09-08', 'DAM'),
  (3,4, 52.00, 50.00, 54.00, 'kg', '2026-09-08', 'DAM'),
  (4,4, 49.00, 47.00, 51.00, 'kg', '2026-09-08', 'DAM'),
  (5,4, 56.00, 54.00, 58.00, 'kg', '2026-09-08', 'DAM'),
  (1,5, 38.00, 35.00, 41.00, 'kg', '2026-09-08', 'DAM'),
  (2,5, 35.00, 32.00, 38.00, 'kg', '2026-09-08', 'DAM'),
  (3,5, 39.00, 36.00, 42.00, 'kg', '2026-09-08', 'DAM'),
  (4,5, 35.00, 32.00, 38.00, 'kg', '2026-09-08', 'DAM'),
  (5,5, 45.00, 42.00, 48.00, 'kg', '2026-09-08', 'DAM');

-- ---- Sep 9 ----
INSERT INTO market_prices (market_id, commodity_id, price, min_price, max_price, unit, price_date, source) VALUES
  (1,1, 53.00, 50.00, 56.00, 'kg', '2026-09-09', 'DAM'),
  (2,1, 49.00, 46.00, 52.00, 'kg', '2026-09-09', 'DAM'),
  (3,1, 51.00, 48.00, 54.00, 'kg', '2026-09-09', 'DAM'),
  (4,1, 46.00, 43.00, 49.00, 'kg', '2026-09-09', 'DAM'),
  (5,1, 63.00, 60.00, 66.00, 'kg', '2026-09-09', 'DAM'),
  (1,2, 28.00, 26.00, 30.00, 'kg', '2026-09-09', 'DAM'),
  (2,2, 26.00, 24.00, 28.00, 'kg', '2026-09-09', 'DAM'),
  (3,2, 30.00, 28.00, 32.00, 'kg', '2026-09-09', 'DAM'),
  (4,2, 27.00, 25.00, 29.00, 'kg', '2026-09-09', 'DAM'),
  (5,2, 33.00, 31.00, 35.00, 'kg', '2026-09-09', 'DAM'),
  (1,3, 68.00, 65.00, 71.00, 'kg', '2026-09-09', 'DAM'),
  (2,3, 63.00, 60.00, 66.00, 'kg', '2026-09-09', 'DAM'),
  (3,3, 66.00, 63.00, 69.00, 'kg', '2026-09-09', 'DAM'),
  (4,3, 69.00, 66.00, 72.00, 'kg', '2026-09-09', 'DAM'),
  (5,3, 77.00, 74.00, 80.00, 'kg', '2026-09-09', 'DAM'),
  (1,4, 51.00, 49.00, 53.00, 'kg', '2026-09-09', 'DAM'),
  (2,4, 49.00, 47.00, 51.00, 'kg', '2026-09-09', 'DAM'),
  (3,4, 53.00, 51.00, 55.00, 'kg', '2026-09-09', 'DAM'),
  (4,4, 50.00, 48.00, 52.00, 'kg', '2026-09-09', 'DAM'),
  (5,4, 57.00, 55.00, 59.00, 'kg', '2026-09-09', 'DAM'),
  (1,5, 39.00, 36.00, 42.00, 'kg', '2026-09-09', 'DAM'),
  (2,5, 36.00, 33.00, 39.00, 'kg', '2026-09-09', 'DAM'),
  (3,5, 40.00, 37.00, 43.00, 'kg', '2026-09-09', 'DAM'),
  (4,5, 36.00, 33.00, 39.00, 'kg', '2026-09-09', 'DAM'),
  (5,5, 47.00, 44.00, 50.00, 'kg', '2026-09-09', 'DAM');

-- ---- Sep 10 ----
INSERT INTO market_prices (market_id, commodity_id, price, min_price, max_price, unit, price_date, source) VALUES
  (1,1, 52.00, 49.00, 55.00, 'kg', '2026-09-10', 'DAM'),
  (2,1, 48.00, 45.00, 51.00, 'kg', '2026-09-10', 'DAM'),
  (3,1, 55.00, 52.00, 58.00, 'kg', '2026-09-10', 'DAM'),
  (4,1, 45.00, 42.00, 48.00, 'kg', '2026-09-10', 'DAM'),
  (5,1, 60.00, 57.00, 63.00, 'kg', '2026-09-10', 'DAM'),
  (1,2, 29.00, 27.00, 31.00, 'kg', '2026-09-10', 'DAM'),
  (2,2, 27.00, 25.00, 29.00, 'kg', '2026-09-10', 'DAM'),
  (3,2, 30.00, 28.00, 32.00, 'kg', '2026-09-10', 'DAM'),
  (4,2, 28.00, 26.00, 30.00, 'kg', '2026-09-10', 'DAM'),
  (5,2, 33.00, 31.00, 35.00, 'kg', '2026-09-10', 'DAM'),
  (1,3, 70.00, 67.00, 73.00, 'kg', '2026-09-10', 'DAM'),
  (2,3, 64.00, 61.00, 67.00, 'kg', '2026-09-10', 'DAM'),
  (3,3, 70.00, 67.00, 73.00, 'kg', '2026-09-10', 'DAM'),
  (4,3, 68.00, 65.00, 71.00, 'kg', '2026-09-10', 'DAM'),
  (5,3, 75.00, 72.00, 78.00, 'kg', '2026-09-10', 'DAM'),
  (1,4, 52.00, 50.00, 54.00, 'kg', '2026-09-10', 'DAM'),
  (2,4, 48.00, 46.00, 50.00, 'kg', '2026-09-10', 'DAM'),
  (3,4, 52.00, 50.00, 54.00, 'kg', '2026-09-10', 'DAM'),
  (4,4, 50.00, 48.00, 52.00, 'kg', '2026-09-10', 'DAM'),
  (5,4, 55.00, 53.00, 57.00, 'kg', '2026-09-10', 'DAM'),
  (1,5, 40.00, 37.00, 43.00, 'kg', '2026-09-10', 'DAM'),
  (2,5, 37.00, 34.00, 40.00, 'kg', '2026-09-10', 'DAM'),
  (3,5, 40.00, 37.00, 43.00, 'kg', '2026-09-10', 'DAM'),
  (4,5, 36.00, 33.00, 39.00, 'kg', '2026-09-10', 'DAM'),
  (5,5, 45.00, 42.00, 48.00, 'kg', '2026-09-10', 'DAM');

-- ---- Sep 11 (matches frontend mockData.ts exactly) ----
INSERT INTO market_prices (market_id, commodity_id, price, min_price, max_price, unit, price_date, source) VALUES
  -- Tomato (c1 in mockData)
  (1,1, 55.00, 52.00, 58.00, 'kg', '2026-09-11', 'DAM'),
  (2,1, 50.00, 47.00, 53.00, 'kg', '2026-09-11', 'DAM'),
  (3,1, 52.00, 49.00, 55.00, 'kg', '2026-09-11', 'DAM'),
  (4,1, 48.00, 45.00, 51.00, 'kg', '2026-09-11', 'DAM'),
  (5,1, 65.00, 62.00, 68.00, 'kg', '2026-09-11', 'DAM'),
  -- Potato (c2)
  (1,2, 30.00, 28.00, 32.00, 'kg', '2026-09-11', 'DAM'),
  (2,2, 28.00, 26.00, 30.00, 'kg', '2026-09-11', 'DAM'),
  (3,2, 32.00, 30.00, 34.00, 'kg', '2026-09-11', 'DAM'),
  (4,2, 29.00, 27.00, 31.00, 'kg', '2026-09-11', 'DAM'),
  (5,2, 35.00, 33.00, 37.00, 'kg', '2026-09-11', 'DAM'),
  -- Onion (c3)
  (1,3, 70.00, 67.00, 73.00, 'kg', '2026-09-11', 'DAM'),
  (2,3, 65.00, 62.00, 68.00, 'kg', '2026-09-11', 'DAM'),
  (3,3, 68.00, 65.00, 71.00, 'kg', '2026-09-11', 'DAM'),
  (4,3, 72.00, 69.00, 75.00, 'kg', '2026-09-11', 'DAM'),
  (5,3, 80.00, 77.00, 83.00, 'kg', '2026-09-11', 'DAM'),
  -- Rice (c4)
  (1,4, 52.00, 50.00, 54.00, 'kg', '2026-09-11', 'DAM'),
  (2,4, 50.00, 48.00, 52.00, 'kg', '2026-09-11', 'DAM'),
  (3,4, 54.00, 52.00, 56.00, 'kg', '2026-09-11', 'DAM'),
  (4,4, 51.00, 49.00, 53.00, 'kg', '2026-09-11', 'DAM'),
  (5,4, 58.00, 56.00, 60.00, 'kg', '2026-09-11', 'DAM'),
  -- Brinjal (c5)
  (1,5, 40.00, 37.00, 43.00, 'kg', '2026-09-11', 'DAM'),
  (2,5, 38.00, 35.00, 41.00, 'kg', '2026-09-11', 'DAM'),
  (3,5, 42.00, 39.00, 45.00, 'kg', '2026-09-11', 'DAM'),
  (4,5, 37.00, 34.00, 40.00, 'kg', '2026-09-11', 'DAM'),
  (5,5, 50.00, 47.00, 53.00, 'kg', '2026-09-11', 'DAM');

-- ──────────────────────────────────────────────
-- 6. PRICE PREDICTIONS
-- ──────────────────────────────────────────────
-- Predictions generated on Sep 11 for Sep 18 (next 7 days)
-- Match the frontend predictions[] array
INSERT INTO price_predictions (commodity_id, market_id, prediction_date, target_date, predicted_price, confidence_score, model_name, model_version)
VALUES
  -- Tomato → Rajshahi Central: up to 58
  (1, 1, '2026-09-11', '2026-09-18', 58.00, 82.00, 'XGBoost',           'v1.0-proto'),
  -- Tomato → Dhaka Wholesale: down to 62
  (1, 5, '2026-09-11', '2026-09-18', 62.00, 75.00, 'Random Forest',     'v1.0-proto'),
  -- Potato → Rajshahi Central: up to 32
  (2, 1, '2026-09-11', '2026-09-18', 32.00, 88.00, 'Linear Regression', 'v1.0-proto'),
  -- Onion → Rajshahi Central: down to 68
  (3, 1, '2026-09-11', '2026-09-18', 68.00, 70.00, 'LSTM',              'v1.0-proto'),
  -- Rice → Rajshahi Central: stable at 53
  (4, 1, '2026-09-11', '2026-09-18', 53.00, 90.00, 'XGBoost',           'v1.0-proto'),
  -- Brinjal → Rajshahi Central: up to 44
  (5, 1, '2026-09-11', '2026-09-18', 44.00, 78.00, 'Random Forest',     'v1.0-proto'),

  -- Additional predictions for other markets (Oct target)
  (1, 2, '2026-09-11', '2026-10-11', 45.00, 65.00, 'LSTM',              'v1.0-proto'),
  (1, 4, '2026-09-11', '2026-10-11', 42.00, 62.00, 'LSTM',              'v1.0-proto'),
  (2, 5, '2026-09-11', '2026-10-11', 28.00, 72.00, 'XGBoost',           'v1.0-proto'),
  (3, 5, '2026-09-11', '2026-10-11', 60.00, 68.00, 'Random Forest',     'v1.0-proto');

-- ──────────────────────────────────────────────
-- 7. PRODUCTS  (matches frontend products[])
-- ──────────────────────────────────────────────
INSERT INTO products (id, farmer_id, commodity_id, name, description, price, quantity_available, unit, quality_grade, image_url, organic, status, created_at)
VALUES
  (1, 1, 1, 'Fresh Tomatoes',    'Freshly harvested tomatoes from Rajshahi fields. Naturally grown with minimal pesticides.', 55.00, 500.000, 'kg', 'A',        NULL, 1, 'ACTIVE', '2026-09-10 06:00:00'),
  (2, 1, 2, 'Diamond Potato',    'Premium quality Diamond variety potatoes. Perfect for cooking.',                            32.00, 1000.000,'kg', 'A',        NULL, 0, 'ACTIVE', '2026-09-08 07:30:00'),
  (3, 2, 3, 'Red Onion',         'Premium red onions from Naogaon. Strong flavor, long shelf life.',                          68.00, 800.000, 'kg', 'A',        NULL, 0, 'ACTIVE', '2026-09-09 08:00:00'),
  (4, 2, 4, 'Miniket Rice',      'Finest Miniket rice from Naogaon. Long grain, aromatic.',                                   55.00, 2000.000,'kg', 'Premium',  NULL, 0, 'ACTIVE', '2026-08-25 09:00:00'),
  (5, 1, 5, 'Purple Brinjal',    'Fresh purple brinjal, ideal for bharta and fry dishes.',                                    42.00, 300.000, 'kg', 'A',        NULL, 1, 'ACTIVE', '2026-09-11 05:30:00'),
  (6, 3, 1, 'Organic Tomatoes',  'Certified organic tomatoes from Pabna. No chemicals used.',                                 65.00, 200.000, 'kg', 'Premium',  NULL, 1, 'ACTIVE', '2026-09-10 06:00:00'),
  (7, 3, 2, 'Cardinal Potato',   'High-quality Cardinal variety potatoes from Pabna.',                                        30.00, 1500.000,'kg', 'A',        NULL, 0, 'ACTIVE', '2026-09-07 07:00:00'),
  (8, 3, 3, 'Local Onion',       'Locally grown onions from Pabna. Strong and pungent.',                                      70.00, 600.000, 'kg', 'Standard', NULL, 0, 'ACTIVE', '2026-09-09 08:30:00');

-- ──────────────────────────────────────────────
-- 8. ORDERS  (matches frontend orders[])
-- ──────────────────────────────────────────────
INSERT INTO orders (id, consumer_id, total_amount, delivery_fee, platform_fee, grand_total, payment_status, order_status, delivery_address, delivery_district, delivery_upazila, created_at, updated_at)
VALUES
  -- ord1: Mohammad Hasan bought 50kg Fresh Tomatoes = ৳2750
  (1, 4, 2750.00, 100.00, 55.00, 2905.00, 'PAID',    'DELIVERED',  'House 12, Road 5, Mirpur, Dhaka',       'Dhaka',    'Mirpur',        '2026-09-05 10:00:00', '2026-09-07 16:00:00'),
  -- ord2: Fatema Begum bought 100kg Diamond Potato = ৳3200
  (2, 6, 3200.00, 80.00,  64.00, 3344.00, 'PAID',    'SHIPPED',    'Shaheb Bazaar, Rajshahi',               'Rajshahi', 'Shah Makhdum',  '2026-09-08 14:30:00', '2026-09-10 09:00:00'),
  -- ord3: Nusrat Jahan bought 200kg Miniket Rice = ৳11000
  (3, 7, 11000.00,200.00, 220.00,11420.00,'PAID',    'CONFIRMED',  'Bogura Shaheed Zia Road',               'Bogura',   'Bogura Sadar',  '2026-09-10 11:00:00', '2026-09-10 11:00:00'),
  -- ord4: Aminul Islam bought 30kg Red Onion = ৳2040
  (4, 8, 2040.00, 60.00,  41.00, 2141.00, 'PENDING', 'PENDING',    'Pabna Town Center',                     'Pabna',    'Pabna Sadar',   '2026-09-11 09:15:00', '2026-09-11 09:15:00'),
  -- ord5: Rafiq Uddin bought 20kg Organic Tomatoes = ৳1300
  (5, 9, 1300.00, 70.00,  26.00, 1396.00, 'PAID',    'DELIVERED',  'Naogaon Town Center',                   'Naogaon',  'Naogaon Sadar', '2026-09-03 08:00:00', '2026-09-05 15:30:00'),
  -- ord6: Sumaiya Akhter bought 80kg Cardinal Potato = ৳2400
  (6, 10,2400.00, 120.00, 48.00, 2568.00, 'PENDING', 'PENDING',    'Uttara Sector 10, Dhaka',               'Dhaka',    'Uttara',        '2026-09-11 16:00:00', '2026-09-11 16:00:00');

-- ──────────────────────────────────────────────
-- 9. ORDER ITEMS
-- ──────────────────────────────────────────────
INSERT INTO order_items (order_id, product_id, farmer_id, quantity, unit_price, subtotal)
VALUES
  (1, 1, 1, 50.000,  55.00, 2750.00),  -- ord1: 50kg Fresh Tomatoes from Abdul Karim
  (2, 2, 1, 100.000, 32.00, 3200.00),  -- ord2: 100kg Diamond Potato from Abdul Karim
  (3, 4, 2, 200.000, 55.00, 11000.00), -- ord3: 200kg Miniket Rice from Rahim Ahmed
  (4, 3, 2, 30.000,  68.00, 2040.00),  -- ord4: 30kg Red Onion from Rahim Ahmed
  (5, 6, 3, 20.000,  65.00, 1300.00),  -- ord5: 20kg Organic Tomatoes from Karim Mia
  (6, 7, 3, 80.000,  30.00, 2400.00);  -- ord6: 80kg Cardinal Potato from Karim Mia

-- ──────────────────────────────────────────────
-- 10. SHIPMENTS
-- ──────────────────────────────────────────────
INSERT INTO shipments (order_id, courier_name, tracking_number, delivery_fee, status, estimated_delivery_date, picked_up_at, delivered_at, created_at, updated_at)
VALUES
  (1, 'Sundorbon Courier', 'SB-2026-00101', 100.00, 'DELIVERED',     '2026-09-07', '2026-09-05 14:00:00', '2026-09-07 12:30:00', '2026-09-05 10:30:00', '2026-09-07 12:30:00'),
  (2, 'SA Paribahan',      'SAP-2026-00202', 80.00, 'IN_TRANSIT',    '2026-09-12', '2026-09-09 08:00:00',  NULL,                  '2026-09-08 15:00:00', '2026-09-10 09:00:00'),
  (3, 'Sundorbon Courier', 'SB-2026-00303', 200.00, 'CREATED',       '2026-09-14',  NULL,                   NULL,                  '2026-09-10 12:00:00', '2026-09-10 12:00:00'),
  (5, 'Korotoa Express',   'KE-2026-00505',  70.00, 'DELIVERED',     '2026-09-05', '2026-09-03 10:00:00', '2026-09-05 14:00:00', '2026-09-03 09:00:00', '2026-09-05 14:00:00');

-- ──────────────────────────────────────────────
-- 11. REVIEWS
-- ──────────────────────────────────────────────
INSERT INTO reviews (order_id, product_id, consumer_id, farmer_id, rating, comment, created_at)
VALUES
  (1, 1, 4, 1, 5, 'Excellent quality tomatoes! Very fresh and the taste is amazing. Will order again.', '2026-09-07 18:00:00'),
  (1, 1, 4, 1, 4, 'Good tomatoes, a few were slightly overripe but overall very satisfactory.',         '2026-09-08 10:00:00'),
  (5, 6, 9, 3, 5, 'Best organic tomatoes I have ever had. Karim Mia produces top-quality produce!',    '2026-09-06 09:00:00');

-- ──────────────────────────────────────────────
-- 12. MARKET RECOMMENDATIONS
-- ──────────────────────────────────────────────
-- Demo recommendations for Abdul Karim (farmer_id=1) selling Tomato (commodity_id=1)
INSERT INTO market_recommendations
  (farmer_id, commodity_id, quantity, farmer_location, harvest_date, minimum_acceptable_price,
   recommended_market_id, current_price, predicted_price, estimated_distance, transport_cost,
   platform_fee, other_cost, expected_revenue, expected_net_return, recommendation_score, created_at)
VALUES
  -- Recommendation 1: Dhaka Wholesale Market (best score despite distance)
  (1, 1, 500.000, 'Rajshahi', '2026-09-15', 40.00,
   5, 65.00, 62.00, 254.00, 1624.00, 620.00, 200.00, 31000.00, 28556.00, 92.00, '2026-09-11 08:00:00'),

  -- Recommendation 2: Rajshahi Central Market (local, zero transport)
  (1, 1, 500.000, 'Rajshahi', '2026-09-15', 40.00,
   1, 55.00, 58.00, 5.00, 75.00, 580.00, 50.00, 29000.00, 28295.00, 88.00, '2026-09-11 08:00:00'),

  -- Recommendation 3: Bogura Market
  (1, 1, 500.000, 'Rajshahi', '2026-09-15', 40.00,
   4, 48.00, 50.00, 120.00, 650.00, 500.00, 100.00, 25000.00, 23750.00, 65.00, '2026-09-11 08:00:00'),

  -- Demo: Abdul Karim selling Onion to Dhaka
  (1, 3, 300.000, 'Rajshahi', '2026-09-18', 50.00,
   5, 80.00, 78.00, 254.00, 1624.00, 468.00, 200.00, 23400.00, 21108.00, 95.00, '2026-09-11 08:30:00'),

  -- Demo: Rahim Ahmed selling Rice to Bogura
  (2, 4, 1000.000, 'Naogaon', '2026-09-20', 45.00,
   4, 51.00, 53.00, 85.00, 472.50, 1060.00, 150.00, 53000.00, 51317.50, 82.00, '2026-09-11 09:00:00');

-- ============================================================
-- END OF SEED DATA
-- ============================================================
