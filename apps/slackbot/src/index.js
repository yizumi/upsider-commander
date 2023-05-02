const { App } = require('@slack/bolt');
// Initialize the Bolt app with your app token and bot token
const app = new App({
  token: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Listen for the 'app_mention' event in a specific channel
app.event('app_mention', async ({ event, say }) => {
  // Extract the user's name from the mention text
  const name = event.text.match(/<@(.+?)>/)[1];

  // Respond with a greeting
  await say(`Hello, <@${name}>!`);
});

// Start the Bolt app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('Bot is running!');
})();