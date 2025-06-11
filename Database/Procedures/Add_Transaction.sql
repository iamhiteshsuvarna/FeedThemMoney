DELIMITER $$
CREATE PROCEDURE add_transaction(IN transaction_caategory VARCHAR(100), IN transaction_date DATE, IN particulars VARCHAR(100), IN amount FLOAT, IN money_account VARCHAR(100))
BEGIN
	DECLARE category_id INT;
	DECLARE money_account_id INT;
    
    SELECT c_id INTO category_id FROM ftm_category WHERE c_category=transaction_category;
    SELECT ma_id INTO money_account_id FROM ftm_money_accounts WHERE ma_account_name=money_account;
    INSERT INTO ftm_transactions (
`t_category_id`,
`t_date`,
`t_particulars`,
`t_amount`,
`t_money_account_id`
) VALUES (category_id, transaction_date, particulars, amount, money_account_id);
END
DELIMITER ;