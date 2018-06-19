require('dotenv').config();
import http from 'http';
import express from 'express';
import io from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import faker from 'faker';
const uuidv1 = require('uuid/v1');

const app = express();

const server = http.createServer(app);

const realtime = io(server);

app.use(cors());
app.use(bodyParser.json());

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
			title: faker.lorem.word(),
			thumbnail: faker.image.image()
		});
		total--;
	}
	res.send(category);
});

app.get('/api/home_banner', (req, res) => {
	let total = req.query.total;
	let banner = [];
	while (total > 0) {
		banner.push({
			title: faker.lorem.sentence(),
			subTitle: faker.lorem.sentence(),
			description: faker.lorem.sentences(),
			thumbnail: faker.image.image()
		});
		total--;
	}
	res.send(banner);
});

app.get('/api/question', (req, res) => {
	let total = req.query.total;
	let questions = [];
	while (total > 0) {
		questions.push({
			username: faker.name.findName(),
			avatar: faker.image.avatar(),
			stars: faker.random.number()
		});
		total--;
	}
	res.send(questions);
});

const users = [];

app.get('/api/user', (req, res) => {
	const queryAll = req.query.filter;
	let result = {};
	if (queryAll.indexOf('all') != -1) {
		result.users = users;
	} else {
		result.hasError = true;
	}
	res.send(result);
});

app.post('/api/user/sign_up', (req, res) => {
	const user = {
		username: req.body.username
	};
	user.userId = uuidv1();
	users.push(user);
	res.send({ success: true });
});

app.post('/api/user/log_in', (req, res) => {
	const user = {
		username: req.body.username
	};
	const result = users.find(e => {
		console.log('user log in ', e.username, user.username);
		return e.username === user.username;
	});
	if (result) {
		const token = uuidv1();
		res.send({ token, user: result });
	} else {
		res.send({ success: false });
	}
});

app.post('/api/user/create_a_call', (req, res) => {
	const callData = {
		callerId: req.body.callerId,
		recipientId: req.body.recipientId,
		signalData: req.body.signalData
	};
	realtime.emit('hasACall', callData);
	res.send({ success: true, callData });
});

app.post('/api/user/anwser_a_call', (req, res) => {
	const callData = {
		callerId: req.body.callerId,
		recipientId: req.body.recipientId,
		signalData: req.body.signalData
	};
	realtime.emit('hasAnAnwser', callData);
	res.send({ success: true, callData });
});

realtime.on('connection', socket => {
	console.log('a user connected ');
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
});

app.post('/auth', (req, res) => {
	const body = {
		email: req.body.email,
		password: req.body.password
	};
	if (body.email && body.password) {
		const token = {
			access_token: uuidv1(),
			expires_in: faker.random.number(),
			token_type: 'Bearer'
		};
		const user = {
			created_at: faker.date.past(),
			updated_at: faker.date.past(),
			username: faker.name.findName(),
			email: body.email,
			id: faker.random.number(),
			info: {
				gender: 'female'
			},
			instructor_cv: faker.internet.url(),
			instructor_description: 'HTML_Text or JSON here',
			query: null,
			type: 'instructor'
		};
		res.send({ token, user });
	} else {
		const error = {
			code: 401,
			message: 'Password is not correct',
			payload: {}
		};
		res.send({ error });
	}
});

// app.get('/courses?offset=0&limit=2', (req, res) => {
// 	const { offset, limit } = req.query;
// 	const items = [];
// 	for(let i = 0; i < limit; i++) {
// 		const item = {
// 			amount_credit: faker.finance.amount(),
// 			banner: faker.image.image(),
// 			created_at: faker.date.past(),
// 			updated_at: faker.date.past(),
// 			created_by: 2,
// 			created_by_user: {
// 				created_at: faker.date.past(),
// 				updated_at: faker.date.past(),
// 				username: faker.name.findName(),
// 				email: faker.internet.email(),
// 				id: faker.random.number(),
// 				info: {
// 					gender: 'female'
// 				},
// 				instructor_cv: faker.internet.url(),
// 				instructor_description: 'HTML_Text or JSON here',
// 				query: null,
// 				type: 'instructor'
// 			},
// 			description: faker.lorem.sentence(),
// 			id: faker.random.number(),
// 			is_public: true,
// 			lessons: [],
// 			query: null,
// 			short_description: faker.lorem.sentence(),
// 			start: faker.date.past(),
// 			title: faker.lorem.sentence(),
// 			type: 'live',
// 			user_enrolls: [],
// 			user_instructors: [],
// 			video_demo: null
// 		};
// 	}
// 	const result = {
// 		items: [],
// 		pagination: {
// 			limit: limit,
// 			offset: offset,
// 			total: 100
// 		}
// 	};
// });

server.listen(process.env.PORT, () =>
	console.log('server listen in port: ', process.env.PORT)
);
