import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function captureLogo() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Create a minimal HTML to render the SVG with a white rounded-square background
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          margin: 0; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          height: 100vh; 
          background-color: transparent;
        }
        .logo-container {
          width: 200px;
          height: 200px;
          background-color: white;
          border-radius: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f0;
        }
        svg {
          width: 120px;
          height: 120px;
          color: #5A5A40;
        }
      </style>
    </head>
    <body>
      <div class="logo-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-fingerprint">
          <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.02-.3 3"/>
          <path d="M14 22a10 10 0 0 0-4.4-20.1"/>
          <path d="M18 12a6 6 0 0 0-5.93-6"/>
          <path d="M2 12a10 10 0 0 1 18.1-5.6"/>
          <path d="M22 12a10 10 0 0 0-5-8.7"/>
          <path d="M5.3 16.1A10 10 0 0 1 14 2"/>
          <path d="M8.53 16.11a6 6 0 0 1 9.95-2.67"/>
          <path d="M9 22a5 5 0 0 1-2-4"/>
          <path d="M13 18a2 2 0 0 0 3.3-1.5"/>
          <path d="M14 15a10 10 0 0 1-5.1 8.7"/>
          <path d="M16 14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2"/>
          <path d="M19 17a7 7 0 0 0-1.2-3.6"/>
          <path d="M20 22a10 10 0 0 0 .7-1.7"/>
          <path d="M3 12a10 10 0 0 1 5-8.7"/>
        </svg>
      </div>
    </body>
    </html>
  `;
  
  await page.setContent(htmlContent);
  const element = await page.$('.logo-container');
  if (element) {
    const screenshotPath = path.join(process.cwd(), 'public', 'images', 'logo_fingerprint.png');
    await element.screenshot({ path: screenshotPath, omitBackground: true });
    console.log(`Logo saved to ${screenshotPath}`);
  }
  
  await browser.close();
}

captureLogo().catch(console.error);
