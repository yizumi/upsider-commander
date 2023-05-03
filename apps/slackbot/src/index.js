const { App } = require('@slack/bolt');
const { getUserByKey, createUser } = require('./store/firebaseDatabase.js')

// Initialize the Bolt app with your app token and bot token
const app = new App({
  token: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Listen for the 'app_mention' event in a specific channel
app.event('app_mention', async ({ event, say }) => {
  const user = await getUserByKey(event.user)
  if (user) {
    await say(`Welcome back, <@{event.user}>!`);
  } else {
    await createUser(event.user, { id: event.user })
    await say(`Hello, <@{event.user}>!`);
  }
});

// Start the Bolt app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('Bot is running!');
})();