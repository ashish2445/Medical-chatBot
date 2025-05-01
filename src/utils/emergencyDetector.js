// src/utils/emergencyDetector.js

/**
 * Keywords that may indicate a medical emergency
 * These should prompt immediate medical attention
 */
export const emergencyKeywords = [
    "chest pain",
    "shortness of breath",
    "difficulty breathing",
    "stroke",
    "severe bleeding",
    "unconscious",
    "passed out",
    "seizure",
    "heart attack",
    "anaphylaxis",
    "severe allergic reaction",
    "suicide",
    "suicidal",
    "emergency",
    "broken bone",
    "head injury",
    "severe burn",
    "poisoning",
    "overdose",
    "drowning",
    "choking",
    "severe abdominal pain",
    "cannot move",
    "paralysis",
    "sudden vision loss",
    "sudden numbness",
    "coughing blood",
    "vomiting blood"
  ];
  
  /**
   * Check if user input contains emergency keywords
   * @param {string} input - The user's message 
   * @returns {boolean} - True if emergency keywords are detected
   */
  export const isEmergency = (input) => {
    return emergencyKeywords.some(keyword => input.includes(keyword));
  };
  
  export default isEmergency;