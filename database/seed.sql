USE foodhub;

INSERT INTO menu_items (id, name, description, category, price, stock_quantity, status) VALUES
('M001','Chicken Adobo','Braised chicken in soy sauce and vinegar','Main Dish',120.00,20,'available'),
('M002','Pork Sinigang','Sour tamarind soup with pork and vegetables','Main Dish',150.00,15,'available'),
('M003','Beef Caldereta','Tender beef stew in tomato sauce','Main Dish',180.00,10,'available'),
('M004','Garlic Fried Rice','Classic Filipino garlic fried rice','Rice',35.00,40,'available'),
('M005','Grilled Fish','Fresh tilapia grilled to order','Main Dish',130.00,12,'available')
ON DUPLICATE KEY UPDATE
  name=VALUES(name),
  description=VALUES(description),
  category=VALUES(category),
  price=VALUES(price),
  stock_quantity=VALUES(stock_quantity),
  status=VALUES(status);

INSERT INTO customers (id, full_name, contact_number, address, preferences, total_orders) VALUES
('C001','Maria Santos','09171234567','Poblacion, Maramag, Bukidnon','',0),
('C002','Juan Dela Cruz','09181112222','North Poblacion, Maramag, Bukidnon','',0)
ON DUPLICATE KEY UPDATE
  full_name=VALUES(full_name),
  address=VALUES(address),
  preferences=VALUES(preferences);
