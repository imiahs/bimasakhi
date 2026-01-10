// api/zoho-callback.js
export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing" });
  }

  return res.status(200).json({
    success: true,
    message: "Zoho authorization code received",
    code
  });
}