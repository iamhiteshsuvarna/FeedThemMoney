DELIMITER $$
CREATE PROCEDURE insertCSVData_GoogleSheets_FTM()
BEGIN
    DECLARE t_date DATETIME;
    DECLARE t_category VARCHAR(100);
    DECLARE t_particular VARCHAR(100);
    DECLARE t_amount FLOAT;
    DECLARE done INT DEFAULT FALSE;
    
    -- Declare a cursor for looping through selected records
    DECLARE cur CURSOR FOR SELECT DATE_FORMAT(STR_TO_DATE(CONCAT(date, '/2025'), '%d/%m/%Y'), '%Y-%m-%d') AS date, category, particulars, amount FROM temp_transaction;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    
    fetch_loop: LOOP
        FETCH cur INTO t_date, t_category, t_particular, t_amount;
        IF done THEN
            LEAVE fetch_loop;
        END IF;

        -- Call the stored procedure
        CALL add_transaction(t_date, t_category, t_particular, t_amount);
        
    END LOOP;

    CLOSE cur;
END

DELIMITER ;