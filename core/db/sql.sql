/* Prompt configuration with new line

prompt \t \u@\h:\d>\n

*/

/* Agregation minute ------------------------------------------------ */

SELECT 
    DATE_FORMAT(time, '%Y-%m-%d %H:%i') AS date_trunc,
    source_id,
    AVG(value) as value,
    MIN(value) as min,
    MAX(value) as max,                                                                                      
    COUNT(*)   as count,
    1 as LEVEL
FROM
    data

GROUP BY date_trunc, source_id

/* Agregation minute ------------------------------------------------ */




/* Agregation hour */

SELECT 
    DATE_FORMAT(time, '%Y-%m-%d %H') AS date_trunc,
    source_id,
    AVG(value) as value,
    MIN(value) as min,
    MAX(value) as max,                                                                                      
    COUNT(*)   as count,
    1 as LEVEL
FROM
    data

GROUP BY date_trunc, source_id



/* -------------------------------------------------------------- */

CREATE TABLE `data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `source_id` int(11) DEFAULT NULL,
  `value` float DEFAULT NULL,
  `min` float DEFAULT NULL,
  `max` float DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `level` int(11) NOT NULL,
  PRIMARY KEY (`id`,`time`,`level`)
) ENGINE=InnoDB AUTO_INCREMENT=384116 DEFAULT CHARSET=latin1
;

CREATE TABLE `source` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `func` tinytext,
  `timer_id` int(11) DEFAULT NULL,
  `unit` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`,`name`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1
;

CREATE TABLE `timer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1
;

/* -------------------------------------------------------------- */



/* -------------------------------------------------------------- */
create or replace database history;    
use history;

/* create federated table -> remote access */
create or replace table source ENGINE=FEDERATED
connection='mysql://root:raspberry@192.168.1.10/history/source';

create or replace table timer ENGINE=FEDERATED
connection='mysql://root:raspberry@192.168.1.10/history/timer';

create or replace table data ENGINE=FEDERATED
connection='mysql://root:raspberry@192.168.1.10/history/data';
/* -------------------------------------------------------------- */




/* Create local copy from table --------------------------------- */
create or replace database history_copy;    
use history_copy;

create or replace table source
select * from history.source;   

create or replace table timer
select * from history.timer;   

create or replace table data
select * from history.data;   
/* Create local copy from table --------------------------------- */


show table status;

/* disc usage */
SELECT 
    table_name AS `Table`, 
    round(((data_length + index_length) / 1024 / 1024), 2) `Size (MB)` 
FROM information_schema.TABLES 
WHERE table_schema = "history";


OPTIMIZE TABLE data;




/* --------------------------------------------------------------- 
   agregate on minute base
   all over 2 hours in past
   delete level 0 data
*/
SET @time_range = now() - INTERVAL 2 HOUR;               
                                        
INSERT INTO data (time, source_id, value, min, max, count, level)
SELECT
    DATE_FORMAT(time, '%Y-%m-%d %H:%i') AS date_trunc,
    source_id  as source_id,
    AVG(value) as value,
    MIN(value) as min,
    MAX(value) as max,                                                                                     
    COUNT(*)   as count,
    1          as LEVEL
FROM
    data
WHERE time < @time_range                                                                                    
  AND level = 0
GROUP BY date_trunc, source_id;

DELETE FROM data
WHERE time < @time_range                                                                                    
  AND level = 0;







/* --------------------------------------------------------------- 
    store procedure calc_level1


*/

USE `history`;
DROP procedure IF EXISTS `calc_level1`;

DELIMITER $$
USE `history`$$
CREATE DEFINER=`root`@`192.168.1.%` PROCEDURE `calc_level1`()

BEGIN
	/* --------------------------------------------------------------- 
	   agregate on minute base
	   all over 2 hours in past
	   delete level 0 data
	*/
	SET @time_range = now() - INTERVAL 2 HOUR;               
											
	INSERT INTO data (time, source_id, value, min, max, count, level)
	SELECT
		DATE_FORMAT(time, '%Y-%m-%d %H:%i') AS date_trunc,
		source_id  as source_id,
		AVG(value) as value,
		MIN(value) as min,
		MAX(value) as max,                                                                                     
		COUNT(*)   as count,
		1          as LEVEL
	FROM
		data
	WHERE time < @time_range                                                                                    
	  AND level = 0
	GROUP BY date_trunc, source_id;

	DELETE FROM data
	WHERE time < @time_range                                                                                    
	  AND level = 0;

	OPTIMIZE TABLE data;

END;$$

DELIMITER ;
/* --------------------------------------------------------------- */

