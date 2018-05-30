require('dotenv').config();
import express from 'express';
import cors from 'cors';
import faker from 'faker';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
	res.status(200);
	res.json({
		info: 'welcome to my world! :)'
	});
});

app.get('/api/chat/me', (req, res) => {
	let total = req.query.total;
	let messages = [];
	while (total > 0) {
		messages.push({
			username: faker.name.findName(),
			avatar: faker.internet.avatar(),
			time: faker.date.recent(),
			message: faker.lorem.sentence()
		});
		total--;
	}
	res.send(messages);
});

app.listen(process.env.PORT, () =>
	console.log('server listen in port: ', process.env.PORT)
);
