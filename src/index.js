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
			time: faker.date.between(faker.date.past(), faker.date.recent()),
			message: faker.lorem.sentence()
		});
		total--;
	}
	res.send(messages);
});

app.get('/api/stream/user', (req, res) => {
	const streamData = {
		videoTitle: faker.lorem.sentence(),
		videoViews: faker.random.number(),
		time: faker.date.between(faker.date.past(), faker.date.recent()),
		username: faker.name.findName(),
		avatar: faker.internet.avatar()
	};
	res.send(streamData);
});

app.get('/api/stream/active', (req, res) => {
	let total = req.query.total;
	let activeStreams = [];
	while (total > 0) {
		activeStreams.push({
			videoTitle: faker.lorem.sentence(),
			author: faker.name.findName(),
			videoViews: faker.random.number(),
			videoThumbnail: faker.image.image()
		});
		total--;
	}
	res.send(activeStreams);
});

app.get('/api/course/popular', (req, res) => {
	let total = req.query.total;
	let popularCourses = [];
	while (total > 0) {
		popularCourses.push({
			videoTitle: faker.lorem.sentence(),
			author: faker.name.findName(),
			learner: faker.random.number(),
			videoThumbnail: faker.image.image(),
			coursePrice: faker.commerce.price()
		});
		total--;
	}
	res.send(popularCourses);
});

app.get('/api/course/upcoming', (req, res) => {
	let total = req.query.total;
	let upcomingCourses = [];
	while (total > 0) {
		upcomingCourses.push({
			videoTitle: faker.lorem.sentence(),
			author: faker.name.findName(),
			learner: faker.random.number(),
			videoThumbnail: faker.image.image(),
			coursePrice: faker.commerce.price()
		});
		total--;
	}
	res.send(upcomingCourses);
});

app.get('/api/category', (req, res) => {
	let total = req.query.total;
	let category = [];
	while (total > 0) {
		category.push({
			title: faker.lorem.sentence(),
			thumbnail: faker.image.image()
		});
		total--;
	}
	res.send(category);
});

app.listen(process.env.PORT, () =>
	console.log('server listen in port: ', process.env.PORT)
);
