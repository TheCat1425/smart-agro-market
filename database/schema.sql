-- ============================================================
-- Smart Agro Market — MySQL 8+ Database Schema
-- AI-Powered Agricultural Price Intelligence and
-- Direct-to-Consumer Marketplace for Rural Bangladesh
-- ============================================================
-- Version : 1.0.0
-- Engine  : InnoDB
-- Charset : utf8mb4 (full Unicode / Bangla support)
-- ============================================================

-- ──────────────────────────────────────────────
-- 0. DATABASE
-- ──────────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS smart_agro_market
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_agro_market;

-- ──────────────────────────────────────────────
-- 1. USERS
-- ──────────────────────────────────────────────
CREATE TABLE users (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  full_name       VARCHAR(150)    NOT NULL,
  email           VARCHAR(255)    NOT NULL,
  phone           VARCHAR(20)     NOT NULL,
  password_hash   VARCHAR(255)    NOT NULL COMMENT 'bcrypt / argon2 hash — never plaintext',
  role            ENUM('FARMER','CONSUMER','ADMIN') NOT NULL DEFAULT 'CONSUMER',
  location        VARCHAR(255)    DEFAULT NULL,
  district        VARCHAR(100)    DEFAULT NULL,
  upazila         VARCHAR(100)    DEFAULT NULL,
  latitude        DECIMAL(10,7)   DEFAULT NULL,
  longitude       DECIMAL(10,7)   DEFAULT NULL,
  is_active       TINYINT(1)      NOT NULL DEFAULT 1,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_phone (phone),
  INDEX idx_users_role (role),
  INDEX idx_users_district (district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────
-- 2. FARMERS
-- ──────────────────────────────────────────────
CREATE TABLE farmers (
  id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id             INT UNSIGNED    NOT NULL,
  farm_name           VARCHAR(200)    DEFAULT NULL,
  farm_location       VARCHAR(255)    DEFAULT NULL,
  district            VARCHAR(100)    DEFAULT NULL,
  upazila             VARCHAR(100)    DEFAULT NULL,
  farm_size           DECIMAL(10,2)   DEFAULT NULL COMMENT 'Farm size in acres',
  verification_status ENUM('PENDING','VERIFIED','REJECTED') NOT NULL DEFAULT 'PENDING',
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_farmers_user_id (user_id),
  INDEX idx_farmers_district (district),
  INDEX idx_farmers_verification (verification_status),

  CONSTRAINT fk_farmers_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────
-- 3. COMMODITIES
-- ──────────────────────────────────────────────
CREATE TABLE commodities (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)    NOT NULL,
  name_bn     VARCHAR(100)    DEFAULT NULL COMMENT 'Bangla name',
  category    VARCHAR(50)     NOT NULL,
  unit        VARCHAR(20)     NOT NULL DEFAULT 'kg',
  description TEXT            DEFAULT NULL,
  is_active   TINYINT(1)      NOT NULL DEFAULT 1,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_commodities_name (name),
  INDEX idx_commodities_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────
-- 4. MARKETS
-- ──────────────────────────────────────────────
CREATE TABLE markets (
  id                    INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name                  VARCHAR(200)    NOT NULL,
  name_bn               VARCHAR(200)    DEFAULT NULL COMMENT 'Bangla name',
  market_type           ENUM('Wholesale','Retail','Mixed') NOT NULL DEFAULT 'Retail',
  district              VARCHAR(100)    NOT NULL,
  upazila               VARCHAR(100)    DEFAULT NULL,
  address               TEXT            DEFAULT NULL,
  latitude              DECIMAL(10,7)   DEFAULT NULL,
  longitude             DECIMAL(10,7)   DEFAULT NULL,
  base_transport_cost   DECIMAL(12,2)   NOT NULL DEFAULT 0.00 COMMENT 'Fixed base cost in BDT',
  transport_cost_per_km DECIMAL(8,2)    NOT NULL DEFAULT 0.00 COMMENT 'BDT per km',
  is_active             TINYINT(1)      NOT NULL DEFAULT 1,
  created_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_markets_name (name),
  INDEX idx_markets_district (district),
  INDEX idx_markets_type (market_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────
-- 5. MARKET PRICES
-- ──────────────────────────────────────────────
CREATE TABLE market_prices (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  market_id     INT UNSIGNED    NOT NULL,
  commodity_id  INT UNSIGNED    NOT NULL,
  price         DECIMAL(12,2)   NOT NULL COMMENT 'Current / average price in BDT per unit',
  min_price     DECIMAL(12,2)   DEFAULT NULL,
  max_price     DECIMAL(12,2)   DEFAULT NULL,
  unit          VARCHAR(20)     NOT NULL DEFAULT 'kg',
  price_date    DATE            NOT NULL,
  source        VARCHAR(100)    DEFAULT 'MANUAL' COMMENT 'DAM / Manual / Scraper etc.',
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_mp_commodity (commodity_id),
  INDEX idx_mp_market (market_id),
  INDEX idx_mp_date (price_date),
  UNIQUE KEY uq_mp_commodity_market_date (commodity_id, market_id, price_date),

  CONSTRAINT fk_mp_market
    FOREIGN KEY (market_id) REFERENCES markets (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_mp_commodity
    FOREIGN KEY (commodity_id) REFERENCES commodities (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────
-- 6. PRICE PREDICTIONS
-- ──────────────────────────────────────────────
CREATE TABLE price_predictions (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  commodity_id     INT UNSIGNED    NOT NULL,
  market_id        INT UNSIGNED    NOT NULL,
  prediction_date  DATE            NOT NULL COMMENT 'Date the prediction was generated',
  target_date      DATE            NOT NULL COMMENT 'Date the prediction targets',
  predicted_price  DECIMAL(12,2)   NOT NULL,
  confidence_score DECIMAL(5,2)    DEFAULT NULL COMMENT '0.00–100.00',
  model_name       VARCHAR(100)    DEFAULT NULL COMMENT 'e.g. Linear Regression, XGBoost, LSTM',
  model_version    VARCHAR(50)     DEFAULT NULL,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_pp_commodity (commodity_id),
  INDEX idx_pp_market (market_id),
  INDEX idx_pp_target (target_date),
  INDEX idx_pp_commodity_market_target (commodity_id, market_id, target_date),

  CONSTRAINT fk_pp_commodity
    FOREIGN KEY (commodity_id) REFERENCES commodities (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_pp_market
    FOREIGN KEY (market_id) REFERENCES markets (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────
-- 7. MARKET RECOMMENDATIONS
-- ──────────────────────────────────────────────
CREATE TABLE market_recommendations (
  id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  -- Input parameters (from farmer)
  farmer_id                INT UNSIGNED    NOT NULL,
  commodity_id             INT UNSIGNED    NOT NULL,
  quantity                 DECIMAL(12,3)   NOT NULL COMMENT 'Quantity in unit of the commodity',
  farmer_location          VARCHAR(255)    DEFAULT NULL,
  harvest_date             DATE            DEFAULT NULL,
  minimum_acceptable_price DECIMAL(12,2)   DEFAULT NULL COMMENT 'BDT per unit',

  -- Calculated results (from application layer)
  recommended_market_id    INT UNSIGNED    NOT NULL,
  current_price            DECIMAL(12,2)   DEFAULT NULL,
  predicted_price          DECIMAL(12,2)   DEFAULT NULL,
  estimated_distance       DECIMAL(10,2)   DEFAULT NULL COMMENT 'Kilometres',
  transport_cost           DECIMAL(12,2)   DEFAULT NULL,
  platform_fee             DECIMAL(12,2)   DEFAULT NULL,
  other_cost               DECIMAL(12,2)   DEFAULT NULL,
  expected_revenue         DECIMAL(12,2)   DEFAULT NULL,
  expected_net_return      DECIMAL(12,2)   DEFAULT NULL,
  recommendation_score     DECIMAL(5,2)    DEFAULT NULL COMMENT '0.00–100.00',

  created_at               DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_mr_farmer (farmer_id),
  INDEX idx_mr_commodity (commodity_id),
  INDEX idx_mr_market (recommended_market_id),
  INDEX idx_mr_created (created_at),

  CONSTRAINT fk_mr_farmer
    FOREIGN KEY (farmer_id) REFERENCES farmers (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_mr_commodity
    FOREIGN KEY (commodity_id) REFERENCES commodities (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_mr_market
    FOREIGN KEY (recommended_market_id) REFERENCES markets (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────
-- 8. PRODUCTS
-- ──────────────────────────────────────────────
CREATE TABLE products (
  id                 INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  farmer_id          INT UNSIGNED    NOT NULL,
  commodity_id       INT UNSIGNED    NOT NULL,
  name               VARCHAR(200)    NOT NULL,
  description        TEXT            DEFAULT NULL,
  price              DECIMAL(12,2)   NOT NULL COMMENT 'BDT per unit',
  quantity_available DECIMAL(12,3)   NOT NULL DEFAULT 0.000,
  unit               VARCHAR(20)     NOT NULL DEFAULT 'kg',
  quality_grade      VARCHAR(20)     DEFAULT NULL COMMENT 'A / B / C or Premium / Standard',
  image_url          VARCHAR(500)    DEFAULT NULL,
  organic            TINYINT(1)      NOT NULL DEFAULT 0,
  status             ENUM('DRAFT','ACTIVE','SOLD_OUT','INACTIVE') NOT NULL DEFAULT 'DRAFT',
  created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_products_farmer (farmer_id),
  INDEX idx_products_commodity (commodity_id),
  INDEX idx_products_status (status),
  INDEX idx_products_organic (organic),

  CONSTRAINT fk_products_farmer
    FOREIGN KEY (farmer_id) REFERENCES farmers (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_products_commodity
    FOREIGN KEY (commodity_id) REFERENCES commodities (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────
-- 9. ORDERS
-- ──────────────────────────────────────────────
CREATE TABLE orders (
  id                INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  consumer_id       INT UNSIGNED    NOT NULL,
  total_amount      DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  delivery_fee      DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  platform_fee      DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  grand_total       DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  payment_status    ENUM('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  order_status      ENUM('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  delivery_address  TEXT            DEFAULT NULL,
  delivery_district VARCHAR(100)    DEFAULT NULL,
  delivery_upazila  VARCHAR(100)    DEFAULT NULL,
  created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_orders_consumer (consumer_id),
  INDEX idx_orders_status (order_status),
  INDEX idx_orders_payment (payment_status),
  INDEX idx_orders_created (created_at),

  CONSTRAINT fk_orders_consumer
    FOREIGN KEY (consumer_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────
-- 10. ORDER ITEMS
-- ──────────────────────────────────────────────
CREATE TABLE order_items (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id    INT UNSIGNED    NOT NULL,
  product_id  INT UNSIGNED    NOT NULL,
  farmer_id   INT UNSIGNED    NOT NULL,
  quantity    DECIMAL(12,3)   NOT NULL,
  unit_price  DECIMAL(12,2)   NOT NULL COMMENT 'Price at time of order — preserved historically',
  subtotal    DECIMAL(12,2)   NOT NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_oi_order (order_id),
  INDEX idx_oi_product (product_id),
  INDEX idx_oi_farmer (farmer_id),

  CONSTRAINT fk_oi_order
    FOREIGN KEY (order_id) REFERENCES orders (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_oi_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_oi_farmer
    FOREIGN KEY (farmer_id) REFERENCES farmers (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────
-- 11. SHIPMENTS
-- ──────────────────────────────────────────────
CREATE TABLE shipments (
  id                      INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  order_id                INT UNSIGNED    NOT NULL,
  courier_name            VARCHAR(100)    DEFAULT NULL,
  tracking_number         VARCHAR(100)    DEFAULT NULL,
  delivery_fee            DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  status                  ENUM('CREATED','PICKED_UP','IN_TRANSIT','AT_DESTINATION','OUT_FOR_DELIVERY','DELIVERED','CANCELLED')
                            NOT NULL DEFAULT 'CREATED',
  estimated_delivery_date DATE            DEFAULT NULL,
  picked_up_at            DATETIME        DEFAULT NULL,
  delivered_at            DATETIME        DEFAULT NULL,
  created_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_shipments_order (order_id),
  INDEX idx_shipments_tracking (tracking_number),
  INDEX idx_shipments_status (status),

  CONSTRAINT fk_shipments_order
    FOREIGN KEY (order_id) REFERENCES orders (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────
-- 12. REVIEWS
-- ──────────────────────────────────────────────
CREATE TABLE reviews (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  order_id    INT UNSIGNED    NOT NULL,
  product_id  INT UNSIGNED    NOT NULL,
  consumer_id INT UNSIGNED    NOT NULL,
  farmer_id   INT UNSIGNED    NOT NULL,
  rating      TINYINT UNSIGNED NOT NULL COMMENT '1–5',
  comment     TEXT            DEFAULT NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_reviews_product (product_id),
  INDEX idx_reviews_farmer (farmer_id),
  INDEX idx_reviews_consumer (consumer_id),
  INDEX idx_reviews_order (order_id),

  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),

  CONSTRAINT fk_reviews_order
    FOREIGN KEY (order_id) REFERENCES orders (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_reviews_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_reviews_consumer
    FOREIGN KEY (consumer_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_reviews_farmer
    FOREIGN KEY (farmer_id) REFERENCES farmers (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- END OF SCHEMA
-- ============================================================
