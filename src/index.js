import { router } from './flaregram/utils/router'; // Import the request router
import { bot } from './flaregram/bot'; // Import the configured bot
import Replicate from "replicate"; // Import the Replicate library for using the Whisper API

// Initialize the Replicate API with the authentication token
const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

// Adding Event Listener, to handle the incoming requests
addEventListener('fetch', (event) => {
  event.respondWith(router.handle(event.request));
});

// Function to handle the /start command, sending a welcome message
export async function startCommand(body) {
  const user_id = body.message.from.id;
  const firstname = body.message.chat.first_name;
  const chatId = body.message.chat.id;

  const messageParams = {
    chat_id: chatId,
    text: `🎙️ Olá, [${firstname}](tg://user?id=${user_id})! Mande um áudio para que eu possa transcrever. Tamanho máximo de 20mb.`,
    parse_mode: "markdown"
  };

  // Send the welcome message
  await bot.message.sendMessage(messageParams);
}

// Function to handle receiving audio messages
export async function handleAudioMessage(body) {
  const chatId = body.message.chat.id;

  try {
    let fileId;

    // Check the type of audio message received
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

    // Construct the file URL
    var fileInfo = await bot.message.getFile({
      file_id: fileId
    });

    fileInfo = fileInfo.result;
    const fileSize = fileInfo.file_size;
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.file_path}`;

    // Set feedback message based on file size
    let feedbackMessage = fileSize > 10 * 1024 * 1024 ?
      "⌛ Aguarde, estou transcrevendo seu áudio. Como o arquivo é grande, pode demorar um pouco." :
      "⌛ Aguarde, estou transcrevendo seu áudio...";

    // Send the feedback message to user
    var sentMessage = await bot.message.sendMessage({
      chat_id: chatId,
      text: feedbackMessage
    });

    // Configure input data for the Replicate API
    const input_data = {
      audio: fileUrl,
      language: "pt"
    };

    // Call the Replicate API for audio transcription
    const response = await replicate.run(
      REPLICATE_OPENAI_RUN,
      {
        input: input_data
      }
    );

    // Get the transcription and send it as a message
    const transcription = response.segments.map(segment => segment.text).join('');
    await bot.message.sendMessage({
      chat_id: chatId,
      text: transcription
    });

    // Delete the feedback message
    await bot.message.deleteMessage({
      chat_id: chatId,
      message_id: sentMessage.result.message_id
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    await bot.message.sendMessage({
      chat_id: chatId,
      text: "Ocorreu um erro ao processar o áudio. Por favor, tente novamente."
    });
  }
}

// Function to handle updates (e.g., incoming messages)
export async function updateHandler(obj) {
  if (obj.message) {
    if (obj.message.text || obj.message.text === '/start') {
      await startCommand(obj);
    } else if (obj.message.voice || obj.message.audio || (obj.message.document && obj.message.document.mime_type.startsWith('audio/'))) {
      await handleAudioMessage(obj);
    }
  }
}
