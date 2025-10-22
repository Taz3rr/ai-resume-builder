# 🧪 Testing Checklist for Hackathon MVP

Use this checklist to test all features before the hackathon presentation.

## ✅ Pre-Testing Setup

- [ ] Dev server running at http://localhost:5173
- [ ] Browser console open (F12) to check for errors
- [ ] Test on Chrome/Edge for best experience
- [ ] Have microphone permissions ready

---

## 🌐 Landing Page

### Language Selection
- [ ] Dropdown shows all 10 languages
- [ ] Language changes immediately on selection
- [ ] No emoji flags visible (clean UI)
- [ ] Dropdown is mobile-friendly

### UI/UX
- [ ] Gradient background loads correctly
- [ ] Hero text is eye-catching and readable
- [ ] Feature cards display properly
- [ ] "Get Started" button is prominent
- [ ] Animations work smoothly (fadeIn, slideUp)

### Translations
Test each language:
- [ ] English
- [ ] Hindi (हिंदी)
- [ ] Odia (ଓଡ଼ିଆ)
- [ ] Marathi (मराठी)
- [ ] Tamil (தமிழ்)
- [ ] Telugu (తెలుగు)
- [ ] Bengali (বাংলা)
- [ ] Gujarati (ગુજરાતી)
- [ ] Kannada (ಕನ್ನಡ)
- [ ] Punjabi (ਪੰਜਾਬੀ)

---

## 💬 Chat Interface

### Conversational Flow
- [ ] Welcome message appears
- [ ] Questions asked in correct order:
  1. Phone number
  2. Email address
  3. Home address
  4. Trade/profession
  5. Years of experience
  6. Key skills
  7. Certifications
  8. Education
  9. Completion message

### Text-to-Speech (🔊)
- [ ] Speaker button appears next to bot messages
- [ ] Click speaker button - voice plays
- [ ] Voice uses correct language
- [ ] Voice is clear and understandable
- [ ] Check console for "Using voice: [name]" log
- [ ] Test in multiple languages
- [ ] Stop button (⏹️) appears while speaking
- [ ] Stop button actually stops speech

### Voice Input (🎤)
- [ ] Microphone button appears in input area
- [ ] Click mic - browser asks for permission
- [ ] Speak - text appears in input field
- [ ] Voice recognition works in selected language
- [ ] Red dot indicates active listening
- [ ] Can type manually if voice fails

### Progress Indicator
- [ ] Progress bar appears at top
- [ ] Shows percentage (0% → 100%)
- [ ] Updates as you complete steps
- [ ] Reaches 100% at completion

### Control Buttons
- [ ] **Reset button** - Clears all data and starts over
- [ ] **Fill Sample Data** - Populates with Maharashtra electrician example
- [ ] Sample data fills all fields correctly
- [ ] Sample data matches selected language

---

## 📄 Resume Preview

### Real-Time Updates
- [ ] Resume updates as you type
- [ ] All sections appear:
  - Name and contact info
  - Trade/profession
  - Skills (bullet points)
  - Work experience
  - Certifications
  - Education
- [ ] Text wrapping works correctly
- [ ] No overlapping content

### ATS-Friendly Format
- [ ] Clean, simple layout
- [ ] Proper heading hierarchy
- [ ] No complex formatting or images
- [ ] Readable font (sans-serif)
- [ ] Adequate spacing

---

## 📥 Export Features

### PDF Download
- [ ] "Download PDF" button visible
- [ ] Click - PDF downloads immediately
- [ ] PDF filename: `Resume_[Name].pdf`
- [ ] PDF looks professional
- [ ] All content visible in PDF
- [ ] No cut-off text
- [ ] Open PDF in viewer - renders correctly

### WhatsApp Share
- [ ] "Share on WhatsApp" button visible
- [ ] Click - WhatsApp opens (web or app)
- [ ] Pre-filled message in selected language
- [ ] PDF attached to message
- [ ] Works on both mobile and desktop

### Print Resume
- [ ] "Print" button visible
- [ ] Click - print dialog opens
- [ ] Print preview looks clean
- [ ] Buttons hidden in print view
- [ ] Proper page breaks
- [ ] Can save as PDF via print dialog

---

## 💾 Offline & Persistence

### LocalStorage
- [ ] Fill resume data
- [ ] Refresh page (F5)
- [ ] Data persists - resume still there
- [ ] Close browser completely
- [ ] Reopen - data still saved
- [ ] Reset button clears localStorage

### Offline Mode
- [ ] Disconnect internet
- [ ] App still loads (from cache)
- [ ] Can fill resume offline
- [ ] Voice input still works
- [ ] TTS still works
- [ ] Can't share WhatsApp (expected)

---

## 📱 Responsive Design

### Desktop (1920x1080)
- [ ] Layout uses full width nicely
- [ ] Two-column layout (chat + preview)
- [ ] No horizontal scrolling
- [ ] Buttons properly sized

### Tablet (768x1024)
- [ ] Single column layout
- [ ] Chat on top, preview below
- [ ] Readable text
- [ ] Touch-friendly buttons

### Mobile (375x667)
- [ ] Stacked layout
- [ ] Text readable without zoom
- [ ] Buttons easy to tap
- [ ] Dropdown works on mobile
- [ ] Microphone button accessible
- [ ] No content cutoff

---

## 🐛 Error Handling

### Voice Features
- [ ] Microphone blocked - Shows error message
- [ ] Unsupported browser - Graceful fallback
- [ ] Speech synthesis fails - Logs error

### Input Validation
- [ ] Can skip questions (not mandatory)
- [ ] Empty inputs handled gracefully
- [ ] Long text wraps properly

### Edge Cases
- [ ] Very long names (50+ characters)
- [ ] Special characters in inputs
- [ ] Unicode characters (Indian languages)
- [ ] Rapid clicking buttons (no crashes)

---

## 🎨 UI Polish

### Animations
- [ ] Landing page fades in smoothly
- [ ] Chat messages slide up
- [ ] Buttons have hover effects
- [ ] Progress bar animates smoothly

### Colors & Contrast
- [ ] Text readable on all backgrounds
- [ ] Button colors eye-catching
- [ ] Gradient background not overwhelming
- [ ] Print version uses white background

### Accessibility
- [ ] Tab navigation works
- [ ] Buttons have clear labels
- [ ] Speaker icons easy to understand
- [ ] Color contrast sufficient

---

## 🚀 Performance

### Load Times
- [ ] Landing page loads < 2 seconds
- [ ] No layout shifts during load
- [ ] Images/icons load quickly
- [ ] Smooth transitions

### Runtime
- [ ] No console errors
- [ ] No memory leaks (check DevTools)
- [ ] Smooth scrolling
- [ ] Fast input response

---

## 🌍 Cross-Language Testing

Test complete flow in at least 3 languages:
1. **English** (baseline)
2. **Hindi** (most common)
3. **Marathi/Tamil** (regional)

For each language:
- [ ] Landing page translated
- [ ] Questions translated
- [ ] Sample data in language
- [ ] Resume sections translated
- [ ] Export messages translated
- [ ] TTS speaks in language
- [ ] Voice input understands language

---

## 📊 Demo Scenarios

### Scenario 1: Illiterate User
- [ ] Use only speaker buttons (🔊)
- [ ] Use only voice input (🎤)
- [ ] Never type anything
- [ ] Complete full resume
- [ ] Download PDF

### Scenario 2: Fast Track
- [ ] Click "Fill Sample Data"
- [ ] Modify one or two fields
- [ ] Download PDF
- [ ] Share on WhatsApp

### Scenario 3: Multi-Language
- [ ] Start in English
- [ ] Switch to Hindi mid-way
- [ ] Continue filling resume
- [ ] Data persists after language change

### Scenario 4: Mobile Worker
- [ ] Open on mobile phone
- [ ] Fill resume using touch
- [ ] Use voice input
- [ ] Share via WhatsApp (most common for blue-collar)

---

## 🏆 Hackathon Presentation Checklist

### Working Demo
- [ ] Have 2-3 complete resumes ready to show
- [ ] Demonstrate in at least 2 languages
- [ ] Show voice input feature
- [ ] Show text-to-speech feature
- [ ] Demo WhatsApp share

### Key Points to Highlight
- [ ] **Accessibility**: TTS + Voice Input for illiterate users
- [ ] **Free & Open Source**: No API costs, no vendor lock-in
- [ ] **Privacy-First**: All data local, nothing sent to servers
- [ ] **Offline**: Works without internet
- [ ] **10 Languages**: English + 9 Indian regional languages
- [ ] **ATS-Friendly**: Optimized for Applicant Tracking Systems

### Be Ready to Explain
- [ ] Why browser TTS instead of cloud TTS (billing issue)
- [ ] How offline persistence works (localStorage)
- [ ] Target users: blue-collar workers with limited digital literacy
- [ ] Real-world use case: daily wage workers, electricians, plumbers, etc.
- [ ] Scalability: Can add more languages, features easily

---

## 🔧 Known Limitations (Be Honest!)

- [ ] **TTS Voice Quality**: Browser voices vary by OS/browser
- [ ] **Voice Recognition**: Needs good internet for first use
- [ ] **PDF Formatting**: Basic format (can be improved)
- [ ] **No AI Suggestions**: MVP focused on data collection
- [ ] **Odia TTS**: Falls back to Hindi (rare to have Odia voices)

---

## 📝 Testing Notes

**Date/Time**: _______________
**Browser**: _______________
**OS**: _______________

### Bugs Found:
1. _______________
2. _______________
3. _______________

### Features Working Well:
1. _______________
2. _______________
3. _______________

### Suggestions for Tonight:
1. _______________
2. _______________
3. _______________

---

## ⚡ Quick Fix Guide

If something breaks:

1. **Console errors**: Check browser DevTools (F12)
2. **Voice not working**: Check microphone permissions
3. **Data lost**: Check localStorage in DevTools
4. **Server crashed**: Restart with `npm run dev`
5. **Build fails**: Delete `node_modules`, run `npm install`

---

**Good luck with your hackathon! 🎉**

**Testing Tip**: Test systematically - don't skip steps. Each checkmark builds confidence for presentation!
