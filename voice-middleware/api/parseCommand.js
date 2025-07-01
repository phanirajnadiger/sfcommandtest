export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { command } = req.body;

  try {
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ${process.env.OPENAI_API_KEY}',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Extract account name, products with quantities, and discount percentage. Respond in JSON like: {"account":"", "products":[{"name":"", "quantity":0}], "discount":0}'
          },
          {
            role: 'user',
            content: command
          }
        ]
      })
    });

    const json = await gptResponse.json();
    const parsedText = json.choices[0].message.content;

    return res.status(200).json({ parsed: parsedText });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
