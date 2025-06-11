DELIMITER $$
CREATE PROCEDURE add_category(IN category_name VARCHAR(100), IN accounting_concept VARCHAR(100))
BEGIN
	DECLARE accounting_concept_id INT;
    SELECT ac_id INTO account_concept_id FROM ftm_accounting_concept WHERE ac_concept_name=accounting_concept;
    INSERT INTO ftm_category (`c_category`, `c_accounting_concept_id`) VALUES (category_name, accounting_concept_id);
END

DELIMITER ;