import * as Sentry from "@sentry/node";
import { authenticateUser } from "./_apiUtils.js";
import formidable from 'formidable';
import fs from 'fs';
import { parse } from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

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

    const form = new formidable.IncomingForm();
    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { pdf } = data.files;

    if (!pdf) {
      res.status(400).json({ error: 'No PDF file uploaded' });
      return;
    }

    const dataBuffer = fs.readFileSync(pdf.filepath);
    const pdfData = await parse(dataBuffer);
    const text = pdfData.text;

    // Integrate with AI to interpret the text
    // For example purposes, mock interpretation
    const interpretation = "This is a mock interpretation of the PDF content.";

    res.status(200).json({ interpretation });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}