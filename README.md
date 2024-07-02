# Whisper Transcribe Bot

Whisper Transcribe Bot is a Telegram bot designed to transcribe audio messages directly within the app with [Whisper on Replicate](https://replicate.com/openai/whisper). Using Flaregram to deploy a cloud worker to host 24/7.

## Objective

The primary goal of this bot is to provide users with a simple and efficient way to transcribe their audio messages. Users can send audio files to the bot, which then processes and sends the audio to Whisper, which is a general-purpose speech recognition model. The transcribed text is sent back to the user in the chat.

You can try the bot now at [https://t.me/EuTranscrevo_bot](https://t.me/EuTranscrevo_bot).

## Based on Flaregram

This project is based on [Flaregram](https://github.com/adityash4rma/flaregram), a super-light, blazing fast, easy-to-use Telegram HTTP bot API framework written in JavaScript. Flaregram simplifies communication with the Telegram Bot API and is ideal for deploying bots on Cloudflare Workers.

## Requirements

Before you begin, ensure you have the following installed:

- Node.js - [Download](https://nodejs.org/)
- NPM(Node Package Manager) - [Download/Install](https://www.npmjs.com/get-npm)
- Wrangler CLI - [Download](https://developers.cloudflare.com/workers/cli-wrangler/install-update)

## Installation / Usage

1. Clone the repository:
    ```sh
    git clone https://github.com/objetovazio/whisper-transcribe-bot.git
    cd whisper-transcribe-bot
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:

   Copy `wrangler_sample.toml` to `wrangler.toml` and update the following variables:

   ### BOT_TOKEN
   It is the Bot Token of your Telegram Bot, can be obtained from @botfather (on telegram), How to Get BOT_TOKEN
 
   ### WEBHOOK_URL
   The webhook url with the format cloudflare workers domain/bot, i.e. https://myworker.mysubdomain.workers.dev/bot, the endpoint should be /bot   and nothing else.
 
   ### SECRET_TOKEN (optional)
   The token is useful to ensure that the request sent from our bot is sent by us. Token should be 1-256 characters. Only characters A-Z, a-z, 0-9,  _ and - are allowed.
 
   ### DROP_PENDING_UPDATES (optional)
   Set True to drop all pending updates.

   ### REPLICATE_OPENAI_RUN
   The Replicate Whisper OpenIA model which you want to run. We are currently using ```openai/whisper:4d50797290df275329f202e48c76360b3f22b08d28c196cbc54600319435f8d2```.
   
   ### REPLICATE_API_TOKEN
   Your Replicate authentication token.

   ```toml
    # Mandatory Variables
    REPO_VERSION = "1.0.1"
    BOT_TOKEN = ""
    WEBHOOK_URL = ""
    REPLICATE_OPENAI_RUN = ''
    REPLICATE_API_TOKEN = ''

    # Optional Variables
    SECRET_TOKEN = ""
    DROP_PENDING_UPDATES = "True"
    ```

4. Deploy the bot to Cloudflare using Wrangler:
    ```sh
    npx wrangler login
    npx wrangler deploy
    ```

5. Setting up the Webhook `WEBHOOK_URL` through [Cloudflare Dashboard](https://dash.cloudflare.com/):

    * Goto your CF (Cloudflare) Dashboard and go to `Workers & Pages / Overview / samplebot`.
    * Now open your worker and goto the `Settings` tab, and click on the `Triggers` tab, and under `Routes` category you'll see your workers address, copy that. 
    * Now, on the `Settings` tab, and click on the `Variables` tab to access the ENV Variables.
    * Click on `Edit Variables`, and replace the `WEBHOOK_URL` with the workers address that you just copied, with the endpoint as `/bot`, that'd be `https://samplebot.yoursubdomain.workers.dev/bot`
    > ⚠️ The `/bot` endpoint is necessary on the `WEBHOOK_URL` var.
    * Now again, send a `POST` request to the `/set-webhook` endpoint of the workers address, that'd be `https://samplebot.yoursubdomain.workers.dev/set-webhook`

And the server would return,

```
Webhook was set
```

After everything's Done! time to message our brand new bot!

## License

![License Logo](https://www.gnu.org/graphics/agplv3-with-text-162x68.png)

_whisper-transcribe-bot © 2024 by Your Name is licensed under GNU AFFERO GENERAL PUBLIC LICENSE (GNU AGPL v3). To view a copy of this license_ [click here](https://www.gnu.org/licenses/agpl-3.0.en.html)
