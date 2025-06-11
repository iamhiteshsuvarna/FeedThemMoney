DELIMITER $$
CREATE PROCEDURE edit_transaction(IN txn_id INT, IN transaction_caategory VARCHAR(100), IN transaction_date DATE, IN particulars VARCHAR(100), IN amount FLOAT)
BEGIN
	DECLARE category_id INT;
    SELECT c_id INTO category_id FROM ftm_category WHERE c_category=transaction_category;
    UPDATE ftm_transactions SET `t_category_id`=category_id, `t_date`=transaction_date,`t_particulars`=particulars,`t_amount`=amount WHERE t_id=txn_id;
END

DELIMITER ;