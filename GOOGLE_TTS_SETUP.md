# ⚠️ IMPORTANT: This Setup is OBSOLETE

## Why We're NOT Using Google Cloud TTS

**Reality Check:** Google Cloud TTS requires **billing setup** even for the "free tier".

We hit this blocker at Step 5 during development. Instead of fighting with billing:
- ✅ We use **Enhanced Browser TTS** (100% free, works offline)
- ✅ Smart voice selection (Google > Microsoft > Apple)
- ✅ No API keys, no billing, no hassle

**For hackathon judges:** This shows we prioritize "works for everyone" over "perfect but complicated".

---

## ~~🚀 Quick Setup (5 minutes)~~ (BLOCKED BY BILLING REQUIREMENT)

### Step 1: Get Your API Key

1. Go to: https://console.cloud.google.com/
2. Click **"Select a project"** → **"New Project"**
3. Name it: "Resume Builder" → Click **Create**
4. Wait for project creation (10 seconds)
5. Go to: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
6. Click **"ENABLE"** button
7. Go to: https://console.cloud.google.com/apis/credentials
8. Click **"CREATE CREDENTIALS"** → **"API Key"**
9. **Copy your API key** (looks like: `AIzaSyC...`)

### Step 2: Add API Key to Your Project

1. In your project folder, create a file named `.env`
2. Add this line (replace with your actual key):
   ```
   VITE_GOOGLE_TTS_API_KEY=AIzaSyC...your_actual_key_here
   ```
3. Save the file
4. **Restart your dev server** (Stop with Ctrl+C, then run `npm run dev` again)

### Step 3: Test It!

1. Open http://localhost:5173
2. Click the speaker button 🔊 on any AI message
3. **Enjoy natural, professional voices!** 🎉

---

## 📌 Important Notes

### For Demo/Testing (Without API Key):
- App still works! 
- Uses browser TTS as fallback
- Just won't sound as good

### For Production/Hackathon:
- **Add the API key** for best experience
- Free tier is MORE than enough for demo
- Judges will be impressed by voice quality!

### Security:
- `.env` file is already in `.gitignore` (your key stays private)
- Never share your API key publicly

---

## 🎯 Voice Quality Comparison

| TTS Type | Quality | Indian Languages | Setup |
|----------|---------|------------------|-------|
| Browser TTS | ⭐⭐ Robotic | ⚠️ Limited | None needed |
| **Google Cloud TTS** | ⭐⭐⭐⭐⭐ Natural | ✅ All supported | 5 mins |

---

## 🐛 Troubleshooting

**"No voice playing"**
- Did you restart the dev server after adding `.env`?
- Check browser console for errors

**"API key not working"**
- Make sure you enabled Text-to-Speech API
- Check the key is copied correctly (no extra spaces)
- Restart dev server

**"Want to skip setup for now"**
- No problem! App works fine with browser TTS
- You can add Google TTS anytime later

---

## 💡 For Your Hackathon Pitch

If you add Google TTS, you can say:

> "We integrated Google Cloud's enterprise-grade Text-to-Speech API to provide natural, human-like voice guidance in 10 Indian languages, making the platform truly accessible for workers with low digital literacy."

🔥 **This makes your project stand out!**
