
SELECT 
    c.c_category AS Category,
    
    -- January
    @JAN_Budget := COALESCE((SELECT cb_amount FROM ftm_category_budget cb2 
              WHERE cb2.cb_category_id = cb.cb_category_id AND MONTH(cb2.cb_update_date) <= 1 
              ORDER BY cb2.cb_update_date DESC LIMIT 1), 0) AS JAN_Budget,
    
    @JAN_Spent := COALESCE((SELECT SUM(t_amount) FROM ftm_transactions t2 
              WHERE t2.t_category_id = c.c_id AND MONTH(t2.t_date) = 1), 0) AS JAN_Spent,
	@JAN_Balance := (@JAN_Budget - @JAN_Spent) AS JAN_Balance,
    CASE WHEN @JAN_Balance < 0 THEN concat("-", ROUND(((-1 * @JAN_Balance) / @JAN_Budget) * 100, 2)) ELSE ROUND((@JAN_Balance / @JAN_Budget) * 100, 2) END AS JAN_Balance_Percentage,
    
    -- February
    @FEB_Budget := COALESCE((SELECT cb_amount FROM ftm_category_budget cb2 
              WHERE cb2.cb_category_id = cb.cb_category_id AND MONTH(cb2.cb_update_date) <= 2 
              ORDER BY cb2.cb_update_date DESC LIMIT 1), 0) AS FEB_Budget,
    
    @FEB_Spent := COALESCE((SELECT SUM(t_amount) FROM ftm_transactions t2 
              WHERE t2.t_category_id = c.c_id AND MONTH(t2.t_date) = 2), 0) AS FEB_Spent,
	@FEB_Balance := (@FEB_Budget - @FEB_Spent) AS FEB_Balance,
    CASE WHEN @FEB_Balance < 0 THEN concat("-", ROUND(((-1 * @FEB_Balance) / @FEB_Budget) * 100, 2)) ELSE ROUND((@FEB_Balance / @FEB_Budget) * 100, 2) END AS FEB_Balance_Percentage,
    
    -- March
    @MAR_Budget := COALESCE((SELECT cb_amount FROM ftm_category_budget cb2 
              WHERE cb2.cb_category_id = cb.cb_category_id AND MONTH(cb2.cb_update_date) <= 3 
              ORDER BY cb2.cb_update_date DESC LIMIT 1), 0) AS MAR_Budget,
    
    @MAR_Spent := COALESCE((SELECT SUM(t_amount) FROM ftm_transactions t2 
              WHERE t2.t_category_id = c.c_id AND MONTH(t2.t_date) = 3), 0) AS MAR_Spent,
	@MAR_Balance := (@MAR_Budget - @MAR_Spent) AS MAR_Balance,
    CASE WHEN @MAR_Balance < 0 THEN concat("-", ROUND(((-1 * @MAR_Balance) / @MAR_Budget) * 100, 2)) ELSE ROUND((@MAR_Balance / @MAR_Budget) * 100, 2) END AS MAR_Balance_Percentage,
    
    -- April
    @APR_Budget := COALESCE((SELECT cb_amount FROM ftm_category_budget cb2 
              WHERE cb2.cb_category_id = cb.cb_category_id AND MONTH(cb2.cb_update_date) <= 4 
              ORDER BY cb2.cb_update_date DESC LIMIT 1), 0) AS APR_Budget,
    
    @APR_Spent := COALESCE((SELECT SUM(t_amount) FROM ftm_transactions t2 
              WHERE t2.t_category_id = c.c_id AND MONTH(t2.t_date) = 4), 0) AS APR_Spent,
	@APR_Balance := (@APR_Budget - @APR_Spent) AS APR_Balance,
    CASE WHEN @APR_Balance < 0 THEN concat("-", ROUND(((-1 * @APR_Balance) / @APR_Budget) * 100, 2)) ELSE ROUND((@APR_Balance / @APR_Budget) * 100, 2) END AS APR_Balance_Percentage,
    
    -- May
    @MAY_Budget := COALESCE((SELECT cb_amount FROM ftm_category_budget cb2 
              WHERE cb2.cb_category_id = cb.cb_category_id AND MONTH(cb2.cb_update_date) <= 5 
              ORDER BY cb2.cb_update_date DESC LIMIT 1), 0) AS MAY_Budget,
    
    @MAY_Spent := COALESCE((SELECT SUM(t_amount) FROM ftm_transactions t2 
              WHERE t2.t_category_id = c.c_id AND MONTH(t2.t_date) = 5), 0) AS MAY_Spent,
	@MAY_Balance := (@MAY_Budget - @MAY_Spent) AS MAY_Balance,
    CASE WHEN @MAY_Balance < 0 THEN concat("-", ROUND(((-1 * @MAY_Balance) / @MAY_Budget) * 100, 2)) ELSE ROUND((@MAY_Balance / @MAY_Budget) * 100, 2) END AS MAY_Balance_Percentage,
    
    -- June
    @JUN_Budget := COALESCE((SELECT cb_amount FROM ftm_category_budget cb2 
              WHERE cb2.cb_category_id = cb.cb_category_id AND MONTH(cb2.cb_update_date) <= 6 
              ORDER BY cb2.cb_update_date DESC LIMIT 1), 0) AS JUN_Budget,
    
    @JUN_Spent := COALESCE((SELECT SUM(t_amount) FROM ftm_transactions t2 
              WHERE t2.t_category_id = c.c_id AND MONTH(t2.t_date) = 6), 0) AS JUN_Spent,
	@JUN_Balance := (@JUN_Budget - @JUN_Spent) AS JUN_Balance,
    CASE WHEN @JUN_Balance < 0 THEN concat("-", ROUND(((-1 * @JUN_Balance) / @JUN_Budget) * 100, 2)) ELSE ROUND((@JUN_Balance / @JUN_Budget) * 100, 2) END AS JUN_Balance_Percentage,
    
    -- July
    @JUL_Budget := COALESCE((SELECT cb_amount FROM ftm_category_budget cb2 
              WHERE cb2.cb_category_id = cb.cb_category_id AND MONTH(cb2.cb_update_date) <= 7 
              ORDER BY cb2.cb_update_date DESC LIMIT 1), 0) AS JUL_Budget,
    
    @JUL_Spent := COALESCE((SELECT SUM(t_amount) FROM ftm_transactions t2 
              WHERE t2.t_category_id = c.c_id AND MONTH(t2.t_date) = 7), 0) AS JUL_Spent,
	@JUL_Balance := (@JUL_Budget - @JUL_Spent) AS JUL_Balance,
    CASE WHEN @JUL_Balance < 0 THEN concat("-", ROUND(((-1 * @JUL_Balance) / @JUL_Budget) * 100, 2)) ELSE ROUND((@JUL_Balance / @JUL_Budget) * 100, 2) END AS JUL_Balance_Percentage,
    
    -- August
    @AUG_Budget := COALESCE((SELECT cb_amount FROM ftm_category_budget cb2 
              WHERE cb2.cb_category_id = cb.cb_category_id AND MONTH(cb2.cb_update_date) <= 8 
              ORDER BY cb2.cb_update_date DESC LIMIT 1), 0) AS AUG_Budget,
    
    @AUG_Spent := COALESCE((SELECT SUM(t_amount) FROM ftm_transactions t2 
              WHERE t2.t_category_id = c.c_id AND MONTH(t2.t_date) = 8), 0) AS AUG_Spent,
	@AUG_Balance := (@AUG_Budget - @AUG_Spent) AS AUG_Balance,
    CASE WHEN @AUG_Balance < 0 THEN concat("-", ROUND(((-1 * @AUG_Balance) / @AUG_Budget) * 100, 2)) ELSE ROUND((@AUG_Balance / @AUG_Budget) * 100, 2) END AS AUG_Balance_Percentage,
    
    -- Spetember
    @SEP_Budget := COALESCE((SELECT cb_amount FROM ftm_category_budget cb2 
              WHERE cb2.cb_category_id = cb.cb_category_id AND MONTH(cb2.cb_update_date) <= 9 
              ORDER BY cb2.cb_update_date DESC LIMIT 1), 0) AS SEP_Budget,
    
    @SEP_Spent := COALESCE((SELECT SUM(t_amount) FROM ftm_transactions t2 
              WHERE t2.t_category_id = c.c_id AND MONTH(t2.t_date) = 9), 0) AS SEP_Spent,
	@SEP_Balance := (@SEP_Budget - @SEP_Spent) AS SEP_Balance,
    CASE WHEN @SEP_Balance < 0 THEN concat("-", ROUND(((-1 * @SEP_Balance) / @SEP_Budget) * 100, 2)) ELSE ROUND((@SEP_Balance / @SEP_Budget) * 100, 2) END AS SEP_Balance_Percentage,
    
    -- October
    @OCT_Budget := COALESCE((SELECT cb_amount FROM ftm_category_budget cb2 
              WHERE cb2.cb_category_id = cb.cb_category_id AND MONTH(cb2.cb_update_date) <= 10 
              ORDER BY cb2.cb_update_date DESC LIMIT 1), 0) AS OCT_Budget,
    
    @OCT_Spent := COALESCE((SELECT SUM(t_amount) FROM ftm_transactions t2 
              WHERE t2.t_category_id = c.c_id AND MONTH(t2.t_date) = 10), 0) AS OCT_Spent,
	@OCT_Balance := (@OCT_Budget - @OCT_Spent) AS OCT_Balance,
    CASE WHEN @OCT_Balance < 0 THEN concat("-", ROUND(((-1 * @OCT_Balance) / @OCT_Budget) * 100, 2)) ELSE ROUND((@OCT_Balance / @OCT_Budget) * 100, 2) END AS OCT_Balance_Percentage,
    
    -- November
    @NOV_Budget := COALESCE((SELECT cb_amount FROM ftm_category_budget cb2 
              WHERE cb2.cb_category_id = cb.cb_category_id AND MONTH(cb2.cb_update_date) <= 11 
              ORDER BY cb2.cb_update_date DESC LIMIT 1), 0) AS NOV_Budget,
    
    @NOV_Spent := COALESCE((SELECT SUM(t_amount) FROM ftm_transactions t2 
              WHERE t2.t_category_id = c.c_id AND MONTH(t2.t_date) = 11), 0) AS NOV_Spent,
	@NOV_Balance := (@NOV_Budget - @NOV_Spent) AS NOV_Balance,
    CASE WHEN @NOV_Balance < 0 THEN concat("-", ROUND(((-1 * @NOV_Balance) / @NOV_Budget) * 100, 2)) ELSE ROUND((@NOV_Balance / @NOV_Budget) * 100, 2) END AS NOV_Balance_Percentage,
    
    -- December
    @DEC_Budget := COALESCE((SELECT cb_amount FROM ftm_category_budget cb2 
              WHERE cb2.cb_category_id = cb.cb_category_id AND MONTH(cb2.cb_update_date) <= 12 
              ORDER BY cb2.cb_update_date DESC LIMIT 1), 0) AS DEC_Budget,
    
    @DEC_Spent := COALESCE((SELECT SUM(t_amount) FROM ftm_transactions t2 
              WHERE t2.t_category_id = c.c_id AND MONTH(t2.t_date) = 12), 0) AS DEC_Spent,
	@DEC_Balance := (@DEC_Budget - @DEC_Spent) AS DEC_Balance,
    CASE WHEN @DEC_Balance < 0 THEN concat("-", ROUND(((-1 * @DEC_Balance) / @DEC_Budget) * 100, 2)) ELSE ROUND((@DEC_Balance / @DEC_Budget) * 100, 2) END AS DEC_Balance_Percentage
    
FROM ftm_category c
LEFT JOIN ftm_category_budget cb ON cb.cb_category_id = c.c_id
GROUP BY c.c_category;
