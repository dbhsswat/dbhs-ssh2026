export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { toEmail, toName, subject, message } = req.body;
  if (!toEmail || !subject || !message) return res.status(400).json({ error: 'Missing fields' });

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: 'Deep SWAT — SSH 2026', email: 'dbhsswat@gmail.com' },
        to: [{ email: toEmail, name: toName || toEmail }],
        subject: subject,
        textContent: message
      })
    });
    if (response.ok) return res.status(200).json({ success: true });
    const err = await response.json();
    return res.status(500).json({ error: err.message || 'Brevo error' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
