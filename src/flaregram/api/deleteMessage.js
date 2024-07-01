//// flaregram © 2024 by Aditya Sharma is licensed under Attribution-NonCommercial 4.0 International. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/


import { ErrorStr, colors } from '../utils/strings.js';

/// --------- Copy Single Message Function ---------- ///
export async function f_deleteMessage(body) {
  try {
  const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`;

  /// Making mandatory params ///
  let param_chat_id = '';
  let param_message_id = '';

  if (body.chat_id != undefined) {
    param_chat_id = body.chat_id;
  } else {
    throw new Error(ErrorStr.undefinedParameter + colors.yellow + `chat_id` + colors.white);
  };

  if (body.message_id != undefined) {
    param_message_id = body.message_id;
  } else {
    throw new Error(ErrorStr.undefinedParameter + colors.yellow + `message_id` + colors.white);
  }

  const payload = {
    chat_id: param_chat_id,
    message_id: param_message_id,
  };
    

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  }).then(response => response.json())
  .then(response => {
    if (response.ok == false){
    console.error(ErrorStr.telegramError + colors.yellow + response.description + colors.white)
    console.error(colors.red + `ERROR =>  ` + colors.yellow + `Cannot Delete Message - msg: ${payload.message_id}` + colors.white)
    };

    return response
  });

  return response;
  } catch (error){
    console.error(error)
  };
}

