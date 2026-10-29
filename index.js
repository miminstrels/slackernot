require("dotenv").config();

const axios = require("axios");
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.command("/slackernot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/slackernot-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/slackernot-help - Check available commands
/slackernot-ping - Check bot latency
/slackernot-catfact - Get a cat fact
/slackernot-dadjoke - Get a dad joke
/slackernot-duck - Get a random duck image
/slackernot-fox - Get a random fox image
/slackernot-joke - Get a random joke
/slackernot-dogfact - Get a dog fact`
  });
});

app.command('/slackernot-dogfact', async ({ ack, respond }) => {
  await ack();

    (async () => {
        try {
            const response = await axios.get('https://dogapi.dog/api/v2/facts');
            await respond ({ text: `Dog Fact:\n${response.data.data[0].attributes.body}`});
        } catch (err) {
            await respond({ text: 'Failed to fetch a dog fact.' });
        }
    })();
});

app.command("/slackernot-catfact", async ({ ack, respond }) => {
  await ack();
  
  try {
  const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/slackernot-dadjoke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json"
      }
    });
    await respond({ text: `Dad Joke:\n${response.data.joke}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a dad joke." });
  }
});

app.command("/slackernot-duck", async ({ ack, respond }) => {
  await ack();

  try {
   const response = await axios.get("https://random-d.uk/api/random");
    await respond({
      text: `Duck Image:\n${response.data.url}`,
      blocks: [
        {
          type: "image",
          title: {
            type: "plain_text",
            text: "Here's your duck image!",
          },
          block_id: "image4",
          image_url: response.data.url,
          alt_text: "Random Duck Image",
        },
      ],
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a duck image." });
  }
});

app.command("/slackernot-fox", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://randomfox.ca/floof/");
    await respond({
      text: `Fox Image:\n${response.data.image}`,
      blocks: [
        {
          type: "image",
          title: {
            type: "plain_text",
            text: "Here's your fox image!",
          },
          block_id: "image4",
          image_url: response.data.image,
          alt_text: "Random Fox Image",
        },
      ],
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a fox image." });
  }
});

app.command("/slackernot-joke", async ({ ack, respond }) => {
  await ack();
  
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text: `${response.data.setup} ${response.data.punchline}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});


(async () => {
  await app.start();
  console.log("bot is running!");
})();
