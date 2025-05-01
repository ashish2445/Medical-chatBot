// src/utils/symptomsChecker.js

/**
 * Basic symptoms checker utility
 * Helps identify common symptom patterns and provides general guidance
 */

// Common symptom categories and associated symptoms
export const symptomCategories = {
    respiratory: [
      "cough", "shortness of breath", "wheezing", "congestion", 
      "runny nose", "sore throat", "difficulty breathing"
    ],
    digestive: [
      "nausea", "vomiting", "diarrhea", "constipation", "abdominal pain",
      "stomach ache", "heartburn", "indigestion", "bloating"
    ],
    neurological: [
      "headache", "dizziness", "confusion", "memory issues", "fainting",
      "numbness", "tingling", "seizure", "tremor", "balance problems"
    ],
    cardiovascular: [
      "chest pain", "palpitations", "rapid heartbeat", "irregular heartbeat",
      "shortness of breath", "swelling in legs", "high blood pressure"
    ],
    musculoskeletal: [
      "joint pain", "muscle pain", "back pain", "stiffness", "swelling",
      "limited mobility", "muscle weakness"
    ],
    dermatological: [
      "rash", "itching", "hives", "skin changes", "discoloration",
      "dry skin", "excessive sweating", "lumps", "sores"
    ],
    general: [
      "fever", "fatigue", "weakness", "weight loss", "weight gain",
      "night sweats", "chills", "lethargy", "malaise"
    ]
  };
  
  // Common conditions with associated symptoms
  export const commonConditions = [
    {
      name: "Common Cold",
      symptoms: ["cough", "congestion", "runny nose", "sore throat", "sneezing", "mild fever"],
      urgency: "low",
      guidance: "Rest, stay hydrated, and use over-the-counter medications to manage symptoms. Consult a healthcare provider if symptoms persist beyond 10 days or worsen significantly."
    },
    {
      name: "Flu (Influenza)",
      symptoms: ["fever", "chills", "cough", "body aches", "fatigue", "headache", "sore throat"],
      urgency: "medium",
      guidance: "Rest, hydrate, and manage fever with appropriate medication. High-risk individuals (elderly, pregnant women, those with chronic conditions) should consult a healthcare provider promptly."
    },
    {
      name: "Gastroenteritis",
      symptoms: ["nausea", "vomiting", "diarrhea", "abdominal pain", "fever", "headache"],
      urgency: "medium",
      guidance: "Focus on hydration with clear fluids. If unable to keep fluids down, experiencing severe pain, or noticing blood in stool/vomit, seek medical attention."
    },
    {
      name: "Migraine",
      symptoms: ["severe headache", "light sensitivity", "sound sensitivity", "nausea", "visual disturbances"],
      urgency: "low to medium",
      guidance: "Rest in a dark, quiet room. Over-the-counter pain relievers may help. Consult a doctor for recurring migraines to discuss preventive treatments."
    },
    {
      name: "Allergic Reaction",
      symptoms: ["rash", "itching", "hives", "swelling", "runny nose", "watery eyes", "sneezing"],
      urgency: "varies",
      guidance: "For mild reactions, antihistamines may help. For breathing difficulties, severe swelling, or dizziness, seek emergency care immediately as this may be anaphylaxis."
    }
  ];
  
  /**
   * Identify potential symptoms in user text
   * @param {string} userInput - User's description of their symptoms
   * @returns {Array} Array of identified symptoms
   */
  export const identifySymptoms = (userInput) => {
    const input = userInput.toLowerCase();
    const foundSymptoms = [];
    
    // Check for symptoms in each category
    Object.values(symptomCategories).forEach(categorySymptoms => {
      categorySymptoms.forEach(symptom => {
        if (input.includes(symptom)) {
          foundSymptoms.push(symptom);
        }
      });
    });
    
    return foundSymptoms;
  };
  
  /**
   * Match symptoms to potential conditions
   * @param {Array} symptoms - Array of identified symptoms
   * @returns {Array} Potential matching conditions
   */
  export const matchConditions = (symptoms) => {
    if (!symptoms || symptoms.length === 0) {
      return [];
    }
    
    const matches = [];
    
    commonConditions.forEach(condition => {
      // Calculate how many symptoms match this condition
      const matchingSymptoms = condition.symptoms.filter(s => 
        symptoms.includes(s)
      );
      
      // If at least 2 symptoms match, consider it a potential match
      if (matchingSymptoms.length >= 2) {
        matches.push({
          ...condition,
          matchCount: matchingSymptoms.length,
          matchedSymptoms: matchingSymptoms
        });
      }
    });
    
    // Sort by number of matching symptoms (highest first)
    return matches.sort((a, b) => b.matchCount - a.matchCount);
  };
  
  /**
   * Generate symptom guidance based on user input
   * @param {string} userInput - User's description
   * @returns {Object} Guidance information
   */
  export const generateSymptomGuidance = (userInput) => {
    // Extract symptoms from user input
    const symptoms = identifySymptoms(userInput);
    
    // Match symptoms to potential conditions
    const potentialConditions = matchConditions(symptoms);
    
    // Prepare response
    if (symptoms.length === 0) {
      return {
        identified: false,
        message: "I couldn't identify specific symptoms from your description. Please provide more details about what you're experiencing."
      };
    }
    
    if (potentialConditions.length === 0) {
      return {
        identified: true,
        symptoms: symptoms,
        message: `I noticed you mentioned ${symptoms.join(", ")}. These symptoms could be related to various conditions. Please provide more details for a better assessment, or consult with a healthcare provider for proper evaluation.`
      };
    }
    
    // Check for any high urgency conditions
    const highUrgencyCondition = potentialConditions.find(c => c.urgency === "high");
    if (highUrgencyCondition) {
      return {
        identified: true,
        symptoms: symptoms,
        conditions: potentialConditions,
        urgency: "high",
        message: `Your symptoms (${symptoms.join(", ")}) may indicate ${highUrgencyCondition.name} or other serious conditions. Please seek medical attention promptly.\n\n${highUrgencyCondition.guidance}`
      };
    }
    
    // General response with top matching condition
    const topCondition = potentialConditions[0];
    return {
      identified: true,
      symptoms: symptoms,
      conditions: potentialConditions,
      urgency: topCondition.urgency,
      message: `Based on the symptoms you described (${symptoms.join(", ")}), one possibility could be ${topCondition.name}. Other conditions are also possible.\n\n${topCondition.guidance}\n\nThis is not a diagnosis. Please consult with a healthcare provider for proper evaluation.`
    };
  };
  
  const symptomsChecker = {
    identifySymptoms,
    matchConditions,
    generateSymptomGuidance
  };

  export default symptomsChecker;