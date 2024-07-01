import { router } from './flaregram/utils/router';
import { bot } from './flaregram/bot';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

// Adding Event Listener, to handle the incoming requests
addEventListener('fetch', (event) => {
  event.respondWith(router.handle(event.request));
});

export async function startCommand(body) {
  const user_id = body.message.from.id;
  const firstname = body.message.chat.first_name;
  const chatId = body.message.chat.id;

  const messageParams = {
    chat_id: chatId,
    text: `🎙️ Olá [${firstname}](tg://user?id=${user_id})! Mande um áudio para que eu possa transcrever.`,
    parse_mode: "markdown"
  };

  await bot.message.sendMessage(messageParams);
}

export async function sendWelcome(body) {
  
  const chatId = body.message.chat.id;

  const messageParams = {
    chat_id: chatId,
    text: "🎙️ Olá! Mande um áudio para que eu possa transcrever."
  };

  await bot.message.sendMessage(messageParams);
}

export async function handleAudioMessage(body) {
  const chatId = body.message.chat.id;

  try {
    let fileId;

    if (body.message.voice) {
      fileId = body.message.voice.file_id;
    } else if (body.message.audio) {
      fileId = body.message.audio.file_id;
    } else if (body.message.document && body.message.document.mime_type.startsWith('audio/')) {
      fileId = body.message.document.file_id;
    } else {
      const messageParams = {
        chat_id: chatId,
        text: "Este tipo de arquivo de áudio não é suportado. Tente convertê-lo!"
      };
      await bot.message.sendMessage(messageParams);
      return;
    }

    // Construct file URL
    const fileData = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`;

    // Fetch file details
    var result = null
    await fetch(fileData)
    .then((response) => response.json())
    .then((json) => result = json.result);

    const fileSize = result.file_size;
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${result.file_path}`;

    let feedbackMessage = fileSize > 10 * 1024 * 1024 ?
      "⌛ Aguarde, estou transcrevendo seu áudio. Como o arquivo é grande, pode demorar um pouco." :
      "⌛ Aguarde, estou transcrevendo seu áudio...";

    var sentMessage = await bot.message.sendMessage({
      chat_id: chatId,
      text: feedbackMessage
    });

    const input_data = {
      audio: fileUrl,
      language: "pt"
    };

    const response = await replicate.run(
      REPLICATE_OPENAI_RUN,
      {
        input: input_data
      }
    );

    const transcription = response.segments.map(segment => segment.text).join('');
    await bot.message.sendMessage({
      chat_id: chatId,
      text: transcription
    });

    const urlDeleteMessage = `https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage?chat_id=${chatId}&message_id=${sentMessage.result.message_id}`;
    var deleted = await fetch(urlDeleteMessage)
    .then((response) => response.json())

  } catch (error) {
    console.error(`Error: ${error}`);
    await bot.message.sendMessage({
      chat_id: chatId,
      text: "Ocorreu um erro ao processar o áudio. Por favor, tente novamente."
    });
  }
}

export async function updateHandler(obj) {
  if (obj.message) {
    if (obj.message.text === '/start') {
      await startCommand(obj);
    } else if (obj.message.text) {
      await sendWelcome(obj);
    } else if (obj.message.voice || obj.message.audio || (obj.message.document && obj.message.document.mime_type.startsWith('audio/'))) {
      await handleAudioMessage(obj);
    }
  }
}
