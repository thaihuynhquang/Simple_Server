require('dotenv').config();
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
	res.status(200);
	res.json({
		info: 'welcome to my world! :)'
	});
});

app.listen(process.env.PORT, () =>
	console.log('server listen in port: ', process.env.PORT)
);
