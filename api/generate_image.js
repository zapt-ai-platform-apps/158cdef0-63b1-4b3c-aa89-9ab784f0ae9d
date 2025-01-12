import * as Sentry from "@sentry/node";
import { authenticateUser } from "./_apiUtils.js";

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

export default async function handler(req, res) {
  try {
    await authenticateUser(req);
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { prompt } = req.body;

    // Integrate with image generation API, e.g., DALL-E
    // For example purposes, we'll mock the image URL
    const imageUrl = "https://via.placeholder.com/512";

    res.status(200).json({ data: imageUrl });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}