# TelegramBioBot
This is a simple bot that stores a small introduction (a 'bio') for use in Telegram groups.

# Deployment
While it's planned to support Heroku deployments in the (hopefully near!) future, for now it can be executed on your local development machine:
1. Clone this repo to your computer/smartphone/smart fridge:
```
git clone https://github.com/WaseemAlkurdi/TelegramBioBot
```

2. Go to the bot's directory:
```
cd TelegramBioBot
```

3. Create a bot on Telegram (it's easy to do that, just chat with Telegram's BotFather: https://t.me/BotFather), then copy the bot token that BotFather gave you.
The bot token is like the key to your bot, without it, it can't be operated by TelegramBioBot.
Then, either specify the token inside a file called `.env` (create it if it doesn't exist), then run the bot:
```
echo 'BOT_TOKEN=paste_token_here' > .env
node bot.js
```
Or specify it on the commandline: 
```
env BOT_TOKEN=paste_token_here node bot.js
```
If you don't specify the bot token, the program won't start, helpfully reminding you to specify the token

# Contact
For any questions, contact @WaseemAlkurdi on Telegram ... pull requests are welcome!
