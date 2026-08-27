export default async function handler(req, res) {

  /*
   * Only POST is allowed.
   */
  if (req.method !== 'POST') {

    return res.status(405).json({
      ok: false,
      error: 'Method not allowed.'
    });

  }


  /*
   * Read Google Apps Script URL
   * from Vercel environment variables.
   */
  const gasUrl =
    process.env.GAS_WEB_APP_URL;


  if (!gasUrl) {

    return res.status(500).json({

      ok: false,

      error:
        'GAS_WEB_APP_URL is not configured in Vercel.'

    });

  }


  try {

    /*
     * Forward request to
     * Google Apps Script.
     */
    const gasResponse =
      await fetch(
        gasUrl,
        {

          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(
              req.body
            )

        }
      );


    const responseText =
      await gasResponse.text();


    let result;


    try {

      result =
        JSON.parse(
          responseText
        );

    }

    catch(error) {

      return res.status(502).json({

        ok: false,

        error:
          'Google Apps Script returned an invalid response.',

        detail:
          responseText.substring(
            0,
            500
          )

      });

    }


    /*
     * Return Apps Script result
     * back to browser.
     */
    return res
      .status(
        gasResponse.ok
          ? 200
          : 502
      )
      .json(
        result
      );

  }

  catch(error) {

    return res.status(502).json({

      ok: false,

      error:
        error.message ||
        String(error)

    });

  }

}
