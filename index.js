require('dotenv').config();
const { MongoClient } = require('mongodb');
var admin = require('firebase-admin');
admin.initializeApp({
	credential: admin.credential.cert({
		projectId: process.env.FIREBASE_PROJECT_ID,
		privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
	}),
	projectId: process.env.FIREBASE_PROJECT_ID,
});
let db;

const sendNotification = async () => {
	const tokens = db.collection('devicetokens').find({}).toArray();

	const tokensList = tokens ? tokens.map((token) => token.token) : [];

	await admin.messaging().sendToDevice(tokensList, {
		notification: {
			title: 'title',
			body: 'message',
		},
	});
};

const connectDatabase = async () => {
	const client = new MongoClient(`${process.env.MONGO_PATH}`);
	await client.connect();

	console.log('Database connected');

	db = client.db('test');
};

async function index() {
	try {
		await connectDatabase();
		await sendNotification();
		console.log('Notifications sent');
	} catch (error) {
		console.error(error);
	}
}

index();
