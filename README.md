# Medical Chatbot

A React-based medical chatbot that provides general health information and guidance.

## Features

- User-friendly chat interface
- Pre-loaded medical knowledge base
- Emergency keyword detection
- Clear medical disclaimers
- Responsive design for all devices

## Tech Stack

- React (with Hooks)
- Tailwind CSS
- Lucide React (for icons)

## Project Structure

```
medical-chatbot/
├── public/
│   ├── index.html
│   ├── favicon.ico
├── src/
│   ├── components/
│   │   ├── ChatBot.jsx          # Main chatbot component
│   │   ├── ChatMessage.jsx      # Individual message component
│   │   ├── ChatInput.jsx        # User input component
│   │   └── Header.jsx           # Header component
│   ├── data/
│   │   └── medicalKnowledge.js  # Medical knowledge database
│   ├── utils/
│   │   ├── messageProcessor.js  # Logic for processing messages
│   │   └── emergencyDetector.js # Logic for detecting emergencies
│   ├── hooks/
│   │   └── useChatbot.js        # Custom hook for chatbot logic
│   ├── App.jsx
│   └── index.js
├── package.json
├── tailwind.config.js
└── README.md
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Important Disclaimer

This chatbot provides general health information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## Development

### Adding to Medical Knowledge Base

To add more medical information, modify the `medicalKnowledge.js` file in the `data` directory:

```javascript
// src/data/medicalKnowledge.js

const medicalKnowledge = {
  // Add new entries here
  "new-condition": "Information about the condition...",
  ...
};
```

### Emergency Keywords

To update the emergency keywords that trigger urgent care advisories, modify the `emergencyDetector.js` file:

```javascript
// src/utils/emergencyDetector.js

export const emergencyKeywords = [
  // Add new emergency keywords here
  "new emergency keyword",
  ...
];
```

## License

medical chatbot link is here : https://medabot.netlify.app/



This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
