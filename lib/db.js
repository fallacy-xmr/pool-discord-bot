const config = require("../config.json");
const mysql = require('mysql');
const pool  = mysql.createPool(config.DB.connection);
const { table, address, discord } = config.DB.structure

module.exports = {
	createLink: function(userid, xmraddr, callback) {
		
		pool.query('SELECT count(*) AS count FROM '+table+' WHERE '+discord+'= ?', [userid], function (error, results, fields) {
			if (error) {
				callback(true);
				return;
			}
			if (results[0].count > 0) {
				sql = 'UPDATE '+table+' SET '+address+'=? WHERE '+discord+'=?';
			} else {
				sql = 'INSERT INTO '+table+' ('+address+','+discord+') VALUES (?,?)';
			}
			pool.query(sql, [xmraddr, userid], function (error, results, fields) {
				if (error) {
					callback(true);
				} else {
					callback(false);
				}
			});
		});

	},
	getUserAddress: function(userid, callback) {

		pool.query('SELECT '+address+' AS address FROM '+table+' WHERE '+discord+'=?', [userid], function (error, results, fields) {
			if ((error) || (results.length < 1)) {
				callback(true);
				return;
			}

			callback(false, results[0].address);
		});
		
	},
	removeLink : function(userid, callback) {

		pool.query('DELETE FROM '+table+' WHERE '+discord+'=?', [userid], function (error, results, fields) {
			if ((error) || (results.length < 1)) {
				callback(true);
				return;
			}

			callback(false);
		});
		
	},
	close : function() {
		pool.end();
	}
}
