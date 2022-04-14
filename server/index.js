require('dotenv').config();

const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const passport = require('passport');

const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');
const userRouter = require('./routes/user');

const startServer = async () => {
	const app = express();

	await mongoose.connect(process.env.DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use(
		cors({
			origin: 'http://localhost:3000',
			credentials: true,
		})
	);

	app.use(
		session({
			secret: process.env.SESSION_SECRET,
			resave: false,
			saveUninitialized: true,
			cookie: { secure: false },
			store: MongoStore.create({
				mongoUrl: process.env.DB_URI,
				mongoOptions: {
					useNewUrlParser: true,
					useUnifiedTopology: true,
				},
			}),
		})
	);

	require('./config/passport')(passport);
	app.use(passport.initialize());
	app.use(passport.session());

	app.use(userRouter);

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		playground: {
			settings: {
				'request.credentials': 'include',
			},
		},
		context: ({ req }) => {
			const { isAuthenticated, user } = req;
			return { isAuthenticated, user };
		},
	});

	await server.start();
	server.applyMiddleware({
		app,
		cors: {
			origin: 'http://localhost:3000',
			credentials: true,
		},
		path: '/graphql',
	});

	app.listen({ port: 4000 }, () =>
		console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
	);
};

startServer();
