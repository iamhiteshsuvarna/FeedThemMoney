CREATE VIEW `View Transactions` AS
    SELECT 
        `a`.`t_id` AS `txn_id`,
        `a`.`t_date` AS `txn_date`,
        `b`.`c_category` AS `category`,
        `a`.`t_particulars` AS `particulars`,
        ROUND(`a`.`t_amount`, 2) AS `amount`
    FROM
        (`ftm_transactions` `a`
        LEFT JOIN `ftm_category` `b` ON (`a`.`t_category_id` = `b`.`c_id`))
    ORDER BY `a`.`t_id`