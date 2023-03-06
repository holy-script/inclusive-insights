import express from "express";
import cors from "cors";
import history from "connect-history-api-fallback";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { ChatGPTAPI } from "chatgpt";
import path from "path";
import url from "url";
import https from "https";
import fsync from "fs";

dotenv.config();

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const biasPresent = async (msg) => {
	const api = new ChatGPTAPI({
		apiKey: process.env.OPENAI_API_KEY,
		systemMessage: `${process.env.BIAS_DETECTION_PROMPT}`,
	});

	const res = await api.sendMessage(msg);

	if (res.text == "1") return true;
	else if (res.text == "0") return false;
	else return "Error Occurred";
};

const creatGuidance = async (speaker, situation) => {
	const api = new ChatGPTAPI({
		apiKey: process.env.OPENAI_API_KEY,
		systemMessage: `${process.env.NARRATION_PROMPT}`,
	});

	const res = await api.sendMessage(
		`Create a narrative dialogue with "${speaker}" thinking about the situation of bias "${situation}"`
	);

	return res.text;
};

const createEmpathy = async (speaker, situation) => {
	const api = new ChatGPTAPI({
		apiKey: process.env.OPENAI_API_KEY,
		systemMessage: `${process.env.NARRATION_PROMPT}`,
	});

	const res = await api.sendMessage(
		`Create a response in the style of "${speaker}" for the situation "${situation}"`
	);

	return res.text;
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		optionsSuccessStatus: 200,
		credentials: true,
	})
);
app.use((req, res, next) => {
	res.header(
		"Access-Control-Allow-Headers",
		"x-access-token, Origin, Content-Type, Accept"
	);
	next();
});
app.use(history());

app.post("/guidance", async (req, res) => {
	console.log(req.body.chat);
	const presence = await biasPresent(req.body.chat);
	if (presence == "Error Occurred") res.status(500).send(presence);
	else {
		if (presence) {
			const guidance = await creatGuidance(
				req.body.speaker,
				req.body.chat
			);
			res.send(guidance);
		} else res.send("Please input a situation of bias.");
	}
});

app.post("/empathy", async (req, res) => {
	console.log(req.body.chat);
	const presence = await biasPresent(req.body.chat);
	if (presence == "Error Occurred") res.status(500).send(presence);
	else {
		if (presence) {
			const empathy = await createEmpathy(
				req.body.speaker,
				req.body.chat
			);
			res.send(empathy);
		} else res.send("Please input a situation of bias.");
	}
});

app.use("/", async (req, res) => {
	res.send("Hello, world!");
});

https
	.createServer(
		{
			cert: fsync.readFileSync(path.join(__dirname, "certificate.crt")),
			key: fsync.readFileSync(path.join(__dirname, "private.key")),
		},
		app
	)
	.listen(3000);
console.log("Listening at http://localhost:3000");
