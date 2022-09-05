const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 7070;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dbData = fs.readFileSync('./database.json');
const dbInfo = JSON.parse(dbData);
const mysql = require('mysql');

const connection = mysql.createConnection({
	host: dbInfo.host,
	user: dbInfo.user,
	password: dbInfo.password,
	port: dbInfo.port,
	database: dbInfo.database,
	insecureAuth: true
});
connection.connect();

app.get('/main/get', (request, response) => {
	// response.send("Success your main loaded");
	let sql = "SELECT * FROM TESTTABLE";
	connection.query(sql, (err, rows, fields) => {
			if (err) {
				console.log(err);
				alert("데이터 조회에 실패했습니다.");
			} else {
				console.log(rows);
				response.send(rows);
			}
		}
	)
});

app.post("/main/post", (request, response) => {
	const data = {
		name: 'master',
		date: 'NOW()'
	};
	let sql = "INSERT INTO TESTTABLE(NAME, DATE) VALUES(?)"; // insert or update
	let parameter = [data.name, data.date];
	connection.query(sql, parameter, (err, rows, fields) => {
			if (err) {
				console.log(err);
				alert("데이터 저장에 실패했습니다.");
			} else {
				response.send(rows);
			}
		}
	);
});

app.delete('/main/delete/:id', (request, response) => {
	let sql = "DELETE FROM TESTTABLE WHERE SEQ = ?";
	let parameter = [request.param.id];
	connection.query(sql, parameter, (err, rows, fields) => {
		if (err) {
				console.log(err);
				alert("데이터 삭제에 실패했습니다.");
			} else {
				response.send(rows);
			}
	});
});

app.listen(port, () => console.log(`Listening on port ${port}`));