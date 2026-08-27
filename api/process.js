export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });

  }


  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbx3qW2bLf9aec5FYUoJRuv87X10VvzRFSFHZL5YDfjFCGmoK3If5tT_sUZzqAVkgKKe/exec";


  try {

    const response =
      await fetch(
        APPS_SCRIPT_URL,
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(req.body)

        }
      );


    const text =
      await response.text();


    let data;


    try {

      data =
        JSON.parse(text);

    } catch {

      data = {

        ok: false,

        error:
          "Apps Script returned invalid JSON",

        raw:
          text

      };

    }


    return res
      .status(response.ok ? 200 : 500)
      .json(data);


  } catch (error) {

    return res.status(500).json({

      ok: false,

      error:
        error.message

    });

  }

}
