// src/utils/nlpProcessor.js

/**
 * Simple NLP utilities for enhancing chatbot understanding
 * This module provides basic natural language processing functions
 * without external dependencies
 */

// Entity types for medical NLP
export const EntityTypes = {
    SYMPTOM: "symptom",
    MEDICATION: "medication",
    CONDITION: "condition",
    BODY_PART: "bodyPart",
    TIME_PERIOD: "timePeriod",
    DOSAGE: "dosage",
    FREQUENCY: "frequency"
  };
  
  // Common medical terms/entities by category
  const medicalEntities = {
    [EntityTypes.SYMPTOM]: [
      "pain", "ache", "fever", "cough", "rash", "swelling", "fatigue", 
      "nausea", "dizziness", "headache", "vomiting", "diarrhea", "insomnia",
      "congestion", "runny nose", "sore throat", "shortness of breath",
      "chest pain", "difficulty breathing", "numbness", "tingling"
    ],
    [EntityTypes.MEDICATION]: [
      "antibiotic", "painkiller", "aspirin", "ibuprofen", "acetaminophen", 
      "tylenol", "advil", "motrin", "benadryl", "antihistamine", "insulin",
      "inhaler", "pill", "capsule", "tablet", "syrup", "medicine", "medication",
      "prescription", "over the counter", "otc", "dose", "drug"
    ],
    [EntityTypes.CONDITION]: [
      "cold", "flu", "covid", "diabetes", "hypertension", "allergy", "asthma",
      "migraine", "arthritis", "depression", "anxiety", "infection", "disease",
      "syndrome", "disorder", "condition", "illness", "virus", "bacterial"
    ],
    [EntityTypes.BODY_PART]: [
      "head", "chest", "stomach", "back", "arm", "leg", "foot", "hand", "eye",
      "ear", "nose", "throat", "heart", "lung", "liver", "kidney", "joint",
      "muscle", "skin", "neck", "shoulder", "knee", "ankle", "wrist", "elbow"
    ],
    [EntityTypes.TIME_PERIOD]: [
      "day", "week", "month", "year", "hour", "minute", "morning", "afternoon",
      "evening", "night", "daily", "weekly", "monthly", "yesterday", "today",
      "tomorrow", "short term", "long term"
    ],
    [EntityTypes.DOSAGE]: [
      "mg", "milligram", "g", "gram", "ml", "milliliter", "tsp", "teaspoon",
      "tbsp", "tablespoon", "oz", "ounce", "dose", "unit", "patch", "drop"
    ],
    [EntityTypes.FREQUENCY]: [
      "daily", "twice daily", "once a day", "twice a day", "three times a day",
      "every day", "every other day", "weekly", "monthly", "hourly", "every hour",
      "every 4 hours", "every 6 hours", "every 8 hours", "every 12 hours",
      "morning", "afternoon", "evening", "night", "before meal", "after meal",
      "with food", "without food", "before bed", "when needed", "as needed", "prn"
    ]
  };
  
  // Common medical intent keywords
  const intentKeywords = {
    "information": ["what is", "tell me about", "information on", "details about", "learn about", "understand"],
    "symptom": ["feeling", "experiencing", "have", "symptom", "suffering from"],
    "treatment": ["treat", "cure", "remedy", "help with", "treatment for", "therapy for"],
    "diagnosis": ["do I have", "could I have", "is it", "diagnose", "diagnosis"],
    "medication": ["should I take", "medicine for", "drug for", "prescription for"],
    "sideEffect": ["side effect", "reaction to", "after taking"],
    "preventative": ["prevent", "avoid", "reduce risk", "lower chance"],
    "dosage": ["how much", "dosage", "dose", "take", "mg", "g", "ml"],
    "frequency": ["how often", "frequency", "times per day", "daily", "weekly"],
    "missedDose": ["missed", "forgot", "skipped", "didn't take", "late", "missed dose"],
    "interaction": ["interact", "together with", "combination", "mix", "while taking"],
    "emergency": ["emergency", "urgent", "immediately", "right away", "severe"]
  };
  
  /**
   * Extract medical entities from text input
   * @param {string} text - User input text
   * @returns {Object} Extracted entities by type
   */
  export const extractEntities = (text) => {
    const lowercaseText = text.toLowerCase();
    const result = {};
    
    // Extract entities for each type
    Object.entries(medicalEntities).forEach(([type, entities]) => {
      const found = entities.filter(entity => {
        // Check for whole word matches
        const regex = new RegExp(`\\b${entity}\\b`, 'i');
        return regex.test(lowercaseText);
      });
      
      if (found.length > 0) {
        result[type] = found;
      }
    });
    
    return result;
  };
  
  /**
   * Determine the primary intent of a medical question
   * @param {string} text - User's question
   * @returns {string} Primary intent category
   */
  export const determineIntent = (text) => {
    const lowercaseText = text.toLowerCase();
    let highestScore = 0;
    let primaryIntent = "information"; // Default intent
    
    // Score each intent category based on keyword matches
    Object.entries(intentKeywords).forEach(([intent, keywords]) => {
      let score = 0;
      
      keywords.forEach(keyword => {
        if (lowercaseText.includes(keyword)) {
          // Increase score for each keyword match
          score += 1;
          
          // Give bonus points for keywords at the beginning of the question
          if (lowercaseText.indexOf(keyword) < 10) {
            score += 0.5;
          }
        }
      });
      
      // Update primary intent if this one has a higher score
      if (score > highestScore) {
        highestScore = score;
        primaryIntent = intent;
      }
    });
    
    return primaryIntent;
  };
  
  /**
   * Check if a question is about a missed medication dose
   * @param {string} text - User's question
   * @returns {boolean} Whether the question is about a missed dose
   */
  export const isMissedDoseQuestion = (text) => {
    const lowercaseText = text.toLowerCase();
    
    // Check for "missed" + "dose/medication" patterns
    const missedTerms = ["missed", "forgot", "skipped", "didn't take", "late"];
    const doseTerms = ["dose", "medication", "medicine", "pill", "tablet", "drug"];
    
    const hasMissedTerm = missedTerms.some(term => lowercaseText.includes(term));
    const hasDoseTerm = doseTerms.some(term => lowercaseText.includes(term));
    
    return hasMissedTerm && hasDoseTerm;
  };
  
  /**
   * Analyze medical query to extract all relevant information
   * @param {string} text - User's query
   * @returns {Object} Analysis results
   */
  export const analyzeMedicalQuery = (text) => {
    return {
      entities: extractEntities(text),
      intent: determineIntent(text),
      isMissedDose: isMissedDoseQuestion(text),
      originalQuery: text
    };
  };
  
  const nlpProcessor = {
    extractEntities,
    determineIntent,
    analyzeMedicalQuery,
    isMissedDoseQuestion,
    EntityTypes
  };

  export default nlpProcessor;