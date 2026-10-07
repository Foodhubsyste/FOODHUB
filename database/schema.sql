-- FOODHUB MySQL database schema
-- Reference/production-ready relational schema matching the current FOODHUB domain.
-- The current application branch still uses data/db.json by default; this SQL package
-- is provided so the team has a concrete database design for setup, migration, and defense.

CREATE DATABASE IF NOT EXISTS foodhub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE foodhub;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS menu_items;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE menu_items (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(250) NOT NULL DEFAULT '',
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  status ENUM('available','unavailable') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_menu_price CHECK (price > 0),
  CONSTRAINT chk_menu_stock CHECK (stock_quantity >= 0)
);

CREATE TABLE customers (
  id VARCHAR(20) PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  contact_number VARCHAR(11) NOT NULL UNIQUE,
  address VARCHAR(250) NOT NULL,
  preferences VARCHAR(250) NOT NULL DEFAULT '',
  total_orders INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_customer_phone CHECK (contact_number REGEXP '^09[0-9]{9}$'),
  CONSTRAINT chk_customer_orders CHECK (total_orders >= 0)
);

CREATE TABLE orders (
  id VARCHAR(40) PRIMARY KEY,
  order_number VARCHAR(40) NOT NULL UNIQUE,
  customer_id VARCHAR(20) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  fulfillment_type ENUM('pickup','delivery') NOT NULL DEFAULT 'pickup',
  delivery_location VARCHAR(250) NOT NULL DEFAULT '',
  scheduled_datetime DATETIME NOT NULL,
  pickup_datetime DATETIME NOT NULL,
  payment_status ENUM('unpaid','partial','paid') NOT NULL DEFAULT 'unpaid',
  payment_method VARCHAR(30) NOT NULL DEFAULT 'cash',
  order_status ENUM('pending','confirmed','ready','completed','cancelled') NOT NULL DEFAULT 'pending',
  notes VARCHAR(500) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_order_total CHECK (total_amount >= 0)
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_scheduled ON orders(scheduled_datetime);

CREATE TABLE order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(40) NOT NULL,
  menu_id VARCHAR(20) NOT NULL,
  item_name_snapshot VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_order_items_menu
    FOREIGN KEY (menu_id) REFERENCES menu_items(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_order_item_quantity CHECK (quantity > 0),
  CONSTRAINT chk_order_item_price CHECK (unit_price > 0),
  CONSTRAINT chk_order_item_subtotal CHECK (subtotal >= 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_menu ON order_items(menu_id);

CREATE TABLE sales (
  id VARCHAR(20) PRIMARY KEY,
  order_id VARCHAR(40) NOT NULL UNIQUE,
  transaction_date DATE NOT NULL,
  total_received DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(30) NOT NULL DEFAULT 'cash',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sales_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_sales_total CHECK (total_received >= 0)
);

CREATE INDEX idx_sales_date ON sales(transaction_date);

-- Sample records corresponding to the current FOODHUB JSON seed data.
INSERT INTO menu_items (id, name, description, category, price, stock_quantity, status) VALUES
('M001','Chicken Adobo','Braised chicken in soy sauce and vinegar','Main Dish',120.00,20,'available'),
('M002','Pork Sinigang','Sour tamarind soup with pork and vegetables','Main Dish',150.00,15,'available'),
('M003','Beef Caldereta','Tender beef stew in tomato sauce','Main Dish',180.00,10,'available'),
('M004','Garlic Fried Rice','Classic Filipino garlic fried rice','Rice',35.00,40,'available'),
('M005','Grilled Fish','Fresh tilapia grilled to order','Main Dish',130.00,12,'available');

INSERT INTO customers (id, full_name, contact_number, address, preferences, total_orders) VALUES
('C001','Maria Santos','09171234567','Poblacion, Maramag, Bukidnon','',0),
('C002','Juan Dela Cruz','09181112222','North Poblacion, Maramag, Bukidnon','',0);

-- Useful read-only views for reports/defense.
CREATE OR REPLACE VIEW v_order_summary AS
SELECT
  o.order_number,
  c.full_name AS customer_name,
  o.total_amount,
  o.fulfillment_type,
  o.scheduled_datetime,
  o.payment_status,
  o.order_status,
  o.created_at
FROM orders o
JOIN customers c ON c.id = o.customer_id;

CREATE OR REPLACE VIEW v_sales_summary AS
SELECT
  s.transaction_date,
  COUNT(*) AS transaction_count,
  SUM(s.total_received) AS total_revenue,
  AVG(s.total_received) AS average_sale
FROM sales s
GROUP BY s.transaction_date
ORDER BY s.transaction_date DESC;
