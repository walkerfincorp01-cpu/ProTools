<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ProTools - Smart Multi-Utility Suite

Professional suite of financial calculators, PDF tools, and image utilities. Works offline.

View your app in AI Studio: https://ai.studio/apps/drive/171Al0snJA_HJi8drxggsAjJ5NRwRjYXZ

## 📥 How to Download / Code Kaise Download Kare

### Method 1: Using Git Clone (Recommended)
```bash
git clone https://github.com/walkerfincorp01-cpu/ProTools.git
cd ProTools
```

### Method 2: Download ZIP
1. Click the green **"Code"** button at the top of this repository
2. Click **"Download ZIP"**
3. Extract the ZIP file to your desired location
4. Open terminal/command prompt in the extracted folder

## 🚀 Run Locally / Locally Kaise Chalaye

**Prerequisites:**  
- Node.js (version 16 or higher) - Download from [nodejs.org](https://nodejs.org/)

**Steps:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set the GEMINI_API_KEY** (optional):
   - Create a file named `.env.local` in the project root
   - Add your Gemini API key: `GEMINI_API_KEY=your_key_here`

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser** and visit: `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## 📦 Available Tools

- Financial Calculators (Interest, SIP, EMI, Percentage)
- PDF Tools (Merge, Convert to Images)
- Image Tools (Resize, Convert to PDF)
- Text Tools (Counter, JSON Formatter)
- Unit Converter
- Invoice Generator
- Math Formulas Reference

## 🛠️ Troubleshooting

**Issue:** `npm install` fails
- **Solution:** Make sure you have Node.js version 16 or higher installed

**Issue:** Port 5173 is already in use
- **Solution:** The app will automatically use a different port. Check the terminal output.

**Issue:** App doesn't start
- **Solution:** Delete `node_modules` folder and `package-lock.json`, then run `npm install` again
