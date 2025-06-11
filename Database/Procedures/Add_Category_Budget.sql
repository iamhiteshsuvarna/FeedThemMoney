DELIMITER $$
CREATE PROCEDURE add_category_budget(IN category_name VARCHAR(100), IN amount FLOAT, IN update_date DATETIME)
BEGIN
	DECLARE category_id INT;
    SELECT c_id INTO category_id FROM ftm_category WHERE c_category=category_name;
    INSERT INTO ftm_category_budget (`cb_category_id`, `cb_amount`,`cb_update_date`) VALUES (category_id, amount, update_date);
END

DELIMITER ;