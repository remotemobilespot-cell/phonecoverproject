-- Update store location hours based on new schedule
-- Houston Rosslyn: Monday to Saturday: 10am - 9pm, Sunday: 12pm - 6pm
-- Bay City: 7am - 11pm  
-- Cuero: 7am - 11pm
-- Remove Lufkin 2 (if exists)
-- Lufkin HEB: 7am - 11pm
-- San Antonio: 7am - 11pm
-- Rest of them: 7am - 11pm

UPDATE store_locations 
SET hours = 'Mon-Sat: 10am-9pm, Sun: 12pm-6pm'
WHERE name LIKE '%Houston%Rosslyn%' OR name LIKE '%Rosslyn%';

UPDATE store_locations 
SET hours = '7am-11pm'
WHERE name LIKE '%Bay City%';

UPDATE store_locations 
SET hours = '7am-11pm'
WHERE name LIKE '%Cuero%';

-- Remove Lufkin 2 if it exists
DELETE FROM store_locations 
WHERE name LIKE '%Lufkin 2%' OR name LIKE '%Lufkin%2%';

UPDATE store_locations 
SET hours = '7am-11pm'
WHERE name LIKE '%Lufkin%HEB%' OR (name LIKE '%Lufkin%' AND name LIKE '%HEB%');

UPDATE store_locations 
SET hours = '7am-11pm'
WHERE name LIKE '%San Antonio%';

-- Update all other locations to 7am-11pm (excluding Houston Rosslyn which was already updated)
UPDATE store_locations 
SET hours = '7am-11pm'
WHERE NOT (name LIKE '%Houston%Rosslyn%' OR name LIKE '%Rosslyn%')
  AND NOT (name LIKE '%Bay City%')
  AND NOT (name LIKE '%Cuero%')
  AND NOT (name LIKE '%Lufkin%HEB%' OR (name LIKE '%Lufkin%' AND name LIKE '%HEB%'))
  AND NOT (name LIKE '%San Antonio%');