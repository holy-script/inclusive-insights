import express from "express";
import cors from "cors";
import history from "connect-history-api-fallback";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { ChatGPTAPI } from "chatgpt";

dotenv.config();

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

app.post("/detect", async (req, res) => {
	console.log(req.body.chat);
	const presence = await biasPresent(req.body.chat);
	if (presence == "Error Occurred") res.status(500).send(presence);
	else res.send(`Bias Presence: ${presence}`);
});

app.use("/", async (req, res) => {
	res.send("Hello, world!");
});

app.listen(3000, () => {
	console.log("Server is running on port 3000.");
});
