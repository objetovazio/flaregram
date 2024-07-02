# Whisper Transcribe Bot

Whisper Transcribe Bot is a Telegram bot designed to transcribe audio messages directly within the app with [Whisper on Replicate](https://replicate.com/openai/whisper). Using Flaregram to deploy a cloud worker to host 24/7.

## Objective

The primary goal of this bot is to provide users with a simple and efficient way to transcribe their audio messages. Users can send audio files to the bot, which then processes and sends the audio to Whisper, which is a general-purpose speech recognition model. The transcribed text is sent back to the user in the chat.

You can try the bot now at [https://t.me/EuTranscrevo_bot](https://t.me/EuTranscrevo_bot).

## Based on Flaregram

This project is based on Flaregram, a light-weight, blazing fast, easy-to-use, Telegram HTTP bot API framework written in JavaScript. It runs on Cloudflare Workers and uses Wrangler too.

<p align=center>
<img alt="build" src="https://img.shields.io/static/v1?label=Build&message=Unstable&color=ff1743&logo=github">
<img alt="GitHub package.json dynamic" src="https://img.shields.io/github/package-json/version/adityash4rma/flaregram?color=ff1743">
<img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/adityash4rma/flaregram?color=ff1743">
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/adityash4rma/flaregram?color=ff1743">
<img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/adityash4rma/flaregram">
<img alt="GitHub Discussions" src="https://img.shields.io/github/discussions/adityash4rma/flaregram?color=ff1743">
</p>
<br>

<p align = "center">
<img src="https://telegra.ph/file/32b8407ce6ba4fe9d8d8c.png" width=400 />
</p>

## Requirements

Before you begin, ensure you have the following installed:

- [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update)

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
   
   ```toml
   [vars]
   REPO_VERSION = "1.0.0"
   BOT_TOKEN = "your_telegram_bot_token"
   WEBHOOK_URL = "your_webhook_url"
   REPLICATE_OPENAI_RUN = "your_replicate_openai_run"
   REPLICATE_API_TOKEN = "your_replicate_api_token"

4. Deploy the bot to Cloudflare using Wrangler:
    ```sh
    wrangler deploy
    ```

5. Interact with the bot via Telegram.

## License

![License Logo](https://www.gnu.org/graphics/agplv3-with-text-162x68.png)

_whisper-transcribe-bot © 2024 by Your Name is licensed under GNU AFFERO GENERAL PUBLIC LICENSE (GNU AGPL v3). To view a copy of this license_ [click here](https://www.gnu.org/licenses/agpl-3.0.en.html)

## Code Overview

### index.js

The main file of the bot. It includes the following functionalities:

- **Event Listener**: Listens for incoming requests and routes them.
- **startCommand**: Handles the `/start` command by sending a welcome message.
- **sendWelcome**: Sends a welcome message to users.
- **handleAudioMessage**: Processes incoming audio messages, sends them to the Whisper API for transcription, and returns the transcribed text.
- **updateHandler**: Handles updates, such as incoming messages, and routes them to the appropriate functions.

#### Example: startCommand Function

```javascript
export async function startCommand(body) {
  const user_id = body.message.from.id;
  const firstname = body.message.chat.first_name;
  const chatId = body.message.chat.id;

  const messageParams = {
    chat_id: chatId,
    text: `🎙️ Olá, [${firstname}](tg://user?id=${user_id})! Mande um áudio para que eu possa transcrever. Tamanho máximo de 20mb.`,
    parse_mode: "markdown"
  };

  await bot.message.sendMessage(messageParams);
}
