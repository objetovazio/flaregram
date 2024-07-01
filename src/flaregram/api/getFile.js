//// flaregram © 2024 by Aditya Sharma is licensed under Attribution-NonCommercial 4.0 International. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/

import { ErrorStr, colors } from "../utils/strings.js";

/// --------- Copy Single Message Function ---------- ///
export async function f_getFile(body) {
  try {
    var param_file_id = "";

    /// Making mandatory params ///
    if (body.file_id != undefined) {
      param_file_id = body.file_id;
    } else {
      throw new Error(
        ErrorStr.undefinedParameter + colors.yellow + `file_id` + colors.white
      );
    }

    const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${param_file_id}`;

    const payload = {
      file_id: param_file_id,
    };

    const response = await fetch(API_URL, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.ok == false) {
          console.error(
            ErrorStr.telegramError +
              colors.yellow +
              response.description +
              colors.white
          );
          console.error(
            colors.red +
              `ERROR =>  ` +
              colors.yellow +
              `Cannot Get File - msg: ${payload.message_id}` +
              colors.white
          );

          return null
        }

        return response
      });

    return response;
  } catch (error) {
    console.error(error);
  }
}
