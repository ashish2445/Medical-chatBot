// src/utils/messageProcessor.js
import medicalKnowledge from "../data/medicalKnowledge";

/**
 * Enhanced message processor with better pattern matching and response generation
 * @param {string} userInput - The user's message text
 * @returns {string} - The bot's response
 */
export const processMessage = (userInput) => {
  const input = userInput.toLowerCase().trim();
  
  // Check for greetings
  if (input.match(/^(hi|hello|hey|howdy|greetings|good morning|good afternoon|good evening).*/i)) {
    return "Hello! I'm here to help with your health questions. What would you like to know about today?";
  }
  
  // Check for thanks
  if (input.match(/^(thanks|thank you|thx|thank).*/i)) {
    return "You're welcome! I'm happy to help. Is there anything else you'd like to know about your health?";
  }
  
  // Check for goodbyes
  if (input.match(/^(bye|goodbye|see you|farewell|talk later).*/i)) {
    return "Take care! Remember to consult healthcare professionals for personalized medical advice. Come back anytime for general health information.";
  }
  
  // Check for general queries about the bot
  if (input.includes("who are you") || input.includes("what can you do") || input.includes("how do you work")) {
    return "I'm MediBot, a virtual health assistant developed with evidence-based medical information. I can provide general information about common health conditions, symptoms, medications, and wellness tips. While I strive for accuracy, I'm not a substitute for professional medical advice. What health topic would you like to know about?";
  }
  
  // Check for medication combinations
  if (input.includes("take together") || (input.includes("and") && 
      (input.includes("medicine") || input.includes("medication") || input.includes("drug")))) {
    // Check specific combinations
    if ((input.includes("paracetamol") && input.includes("ibuprofen")) || 
        (input.includes("acetaminophen") && input.includes("ibuprofen")) ||
        (input.includes("tylenol") && input.includes("advil"))) {
      return medicalKnowledge["paracetamol and ibuprofen"];
    }
  }
  
  // Enhanced pattern matching for symptoms
  const symptomPatterns = {
    headache: /headache|head pain|migraine|head ache/i,
    fever: /fever|high temperature|feeling hot|elevated temperature/i,
    cough: /cough|coughing|hack|chest cough/i,
    "sore throat": /sore throat|throat pain|painful throat|strep/i,
    "stomach pain": /stomach pain|stomach ache|abdominal pain|tummy ache|belly pain/i,
    "back pain": /back pain|backache|back ache|pain in (my|the) back/i,
    "chest pain": /chest pain|pain in (my|the) chest|chest tightness|chest pressure/i,
    "shortness of breath": /shortness of breath|hard to breathe|difficulty breathing|can't breathe/i,
    "joint pain": /joint pain|arthritis pain|painful joints/i,
    fatigue: /fatigue|tired|exhausted|no energy|low energy|feeling weak/i,
    diabetes: /diabetes|blood sugar|high sugar|low sugar|diabetic/i,
    "high blood pressure": /high blood pressure|hypertension|elevated blood pressure/i,
    "low blood pressure": /low blood pressure|hypotension/i,
    "cold and flu": /cold|flu|influenza|runny nose|stuffy nose|congestion/i,
    allergy: /allergy|allergic|allergies|hay fever/i,
  };
  
  // Check against symptom patterns
  for (const [condition, pattern] of Object.entries(symptomPatterns)) {
    if (input.match(pattern) && medicalKnowledge[condition]) {
      return medicalKnowledge[condition];
    }
  }
  
  // Check against medical knowledge base - exact matches first
  for (const [key, value] of Object.entries(medicalKnowledge)) {
    if (input === key) {
      return value;
    }
  }
  
  // Check against medical knowledge base - partial matches with improved relevance
  const matchedTerms = [];
  for (const [key, value] of Object.entries(medicalKnowledge)) {
    // Split the input into words and check if any key terms are present
    const words = input.split(/\s+/);
    if (words.some(word => key.includes(word)) || input.includes(key)) {
      matchedTerms.push({ key, value, relevance: calculateRelevance(input, key) });
    }
  }
  
  // Sort by relevance and return the most relevant match
  if (matchedTerms.length > 0) {
    matchedTerms.sort((a, b) => b.relevance - a.relevance);
    return matchedTerms[0].value;
  }
  
  // Enhanced contextual response generation based on query type
  
  // Medication questions
  if (input.match(/can i take|should i take|how (much|many)|dosage|dose|medication|medicine|drug|pill/i)) {
    return generateMedicationResponse(input);
  }
  
  // Symptom questions
  if (input.match(/symptom|pain|hurt|ache|feeling|feel|experiencing|suffering|have a/i)) {
    return generateSymptomResponse(input);
  }
  
  // Treatment questions
  if (input.match(/treat|cure|heal|remedy|help with|treatment|therapy|manage|reduce|relieve/i)) {
    return generateTreatmentResponse(input);
  }
  
  // Diet and nutrition questions
  if (input.match(/eat|food|diet|nutrition|meal|vitamin|supplement|healthy eating|nutritional|macro/i)) {
    return generateDietResponse(input);
  }
  
  // Exercise questions
  if (input.match(/exercise|workout|training|fitness|physical activity|cardio|strength|active/i)) {
    return generateExerciseResponse(input);
  }
  
  // Prevention questions
  if (input.match(/prevent|avoid|reduce risk|stop|protection|shield|guard against/i)) {
    return generatePreventionResponse(input);
  }
  
  // Check for diagnostic questions
  if (input.match(/do i have|is it|could it be|diagnosed with|test for|signs of|symptoms of/i)) {
    return "I understand you may be concerned about your symptoms. While I can provide general information, I cannot diagnose specific conditions. Your symptoms could be related to various conditions, and proper diagnosis requires a healthcare provider's evaluation. They can perform appropriate tests and assessments to determine the cause of your symptoms. If you're experiencing concerning symptoms, please don't delay seeking medical attention.";
  }
  
  // Default response for completely unknown queries
  return generateGeneralResponse(input);
};

/**
 * Calculate relevance score between user input and medical knowledge key term
 * @param {string} input - User's query
 * @param {string} key - Medical knowledge key term
 * @returns {number} - Relevance score
 */
const calculateRelevance = (input, key) => {
  // Calculate what percentage of words in the key are found in the input
  const inputWords = new Set(input.split(/\s+/));
  const keyWords = key.split(/\s+/);
  
  let matchCount = 0;
  for (const word of keyWords) {
    if (inputWords.has(word) || input.includes(word)) {
      matchCount++;
    }
  }
  
  // If the key is a single word and it's contained in the input, high relevance
  if (keyWords.length === 1 && input.includes(key)) {
    return 0.9;
  }
  
  // If the input is a question specifically about the key term, high relevance
  if (input.includes(`what is ${key}`) || 
      input.includes(`tell me about ${key}`) || 
      input.includes(`information on ${key}`)) {
    return 0.95;
  }
  
  // Calculate percentage of matching words
  return matchCount / keyWords.length;
};

/**
 * Generate a thoughtful response about medications
 * @param {string} input - User's query
 * @returns {string} - Generated response
 */
const generateMedicationResponse = (input) => {
  return "Regarding your medication question, it's important to follow proper dosage guidelines and understand potential interactions. Medications should be taken as prescribed by your healthcare provider or as directed on the label. The effectiveness and safety of medications can vary based on individual factors including age, weight, medical conditions, and other medications you may be taking. For specific advice about your situation, please consult with your doctor or pharmacist who can provide personalized guidance based on your medical history.";
};

/**
 * Generate a thoughtful response about symptoms
 * @param {string} input - User's query
 * @returns {string} - Generated response
 */
const generateSymptomResponse = (input) => {
  return "The symptoms you're describing could be related to several different conditions. Symptoms are your body's way of communicating that something might need attention. When evaluating symptoms, healthcare providers consider factors like duration, severity, frequency, and accompanying symptoms. While I can provide general information, I can't evaluate your specific situation. If your symptoms are severe, persistent, worsening, or concerning, I recommend consulting with a healthcare provider who can properly assess your condition and provide appropriate guidance.";
};

/**
 * Generate a thoughtful response about treatments
 * @param {string} input - User's query
 * @returns {string} - Generated response
 */
const generateTreatmentResponse = (input) => {
  return "Effective treatments depend on the specific condition and individual factors. Treatment approaches may include lifestyle modifications, medications, therapeutic procedures, or a combination of these. What works best varies from person to person based on the severity of the condition, overall health, medical history, and other individual factors. For the most effective treatment plan, it's important to consult with a healthcare provider who can evaluate your specific situation and recommend appropriate options tailored to your needs.";
};

/**
 * Generate a thoughtful response about diet and nutrition
 * @param {string} input - User's query
 * @returns {string} - Generated response
 */
const generateDietResponse = (input) => {
  return "Nutrition plays a fundamental role in overall health and can significantly impact various health conditions. A balanced diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. Specific dietary needs vary based on age, gender, activity level, health conditions, and individual goals. Some health conditions may benefit from specialized dietary approaches under professional guidance. For personalized nutrition advice tailored to your specific health needs and goals, consider consulting with a registered dietitian or your healthcare provider.";
};

/**
 * Generate a thoughtful response about exercise
 * @param {string} input - User's query
 * @returns {string} - Generated response
 */
const generateExerciseResponse = (input) => {
  return "Regular physical activity offers numerous health benefits, including improved cardiovascular health, stronger muscles and bones, better weight management, enhanced mood, and reduced risk of many chronic diseases. The general recommendation for adults is at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous activity weekly, plus muscle-strengthening activities twice weekly. However, the ideal exercise plan should be tailored to individual factors like age, fitness level, health conditions, and personal goals. Before starting a new exercise program, especially if you have existing health concerns, it's advisable to consult with your healthcare provider.";
};

/**
 * Generate a thoughtful response about prevention
 * @param {string} input - User's query
 * @returns {string} - Generated response
 */
const generatePreventionResponse = (input) => {
  return "Preventive healthcare focuses on measures taken to prevent diseases rather than treating them after they occur. Key preventive measures include maintaining a healthy diet, regular physical activity, adequate sleep, stress management, avoiding tobacco and limiting alcohol, maintaining a healthy weight, and getting recommended vaccinations and screenings. Early detection through regular check-ups is also important. Specific preventive strategies may vary depending on age, gender, family history, and individual risk factors. For personalized preventive health recommendations, consult with your healthcare provider.";
};

/**
 * Generate a general response for queries that don't match known patterns
 * @param {string} input - User's query
 * @returns {string} - Generated response
 */
const generateGeneralResponse = (input) => {
  const topics = extractPossibleTopics(input);
  
  if (topics.length > 0) {
    return `I don't have specific information about "${input}". It might be related to ${topics.join(", ")}, but for accurate information about your question, I recommend consulting with a healthcare provider. They can provide guidance tailored to your specific situation. Is there another health topic I can help you with?`;
  }
  
  return "I don't have specific information about that health topic. For accurate information, diagnosis, and treatment advice, please consult with a qualified healthcare provider. They can provide personalized guidance based on your specific situation. Is there another health question I can help you with?";
};

/**
 * Extract possible related medical topics from user input
 * @param {string} input - User's query
 * @returns {array} - Array of possibly related topics
 */
const extractPossibleTopics = (input) => {
  const words = input.toLowerCase().split(/\s+/);
  const topics = [];
  const commonTerms = {
    "pain": "pain management",
    "heart": "cardiovascular health",
    "blood": "cardiovascular health or blood tests",
    "head": "headaches or neurological issues",
    "stomach": "digestive health",
    "breathing": "respiratory health",
    "skin": "dermatological conditions",
    "sleep": "sleep health",
    "weight": "weight management",
    "stress": "stress management",
    "anxiety": "mental health",
    "depression": "mental health",
    "diet": "nutrition",
    "vitamin": "nutritional supplements",
    "exercise": "physical activity",
    "fever": "infectious diseases",
    "allergy": "allergic conditions",
    "pregnant": "pregnancy and prenatal care",
    "baby": "pediatric health",
    "child": "pediatric health",
    "senior": "geriatric health",
    "elderly": "geriatric health",
    "cancer": "oncology",
    "diabetes": "endocrinology",
    "thyroid": "endocrinology",
    "joint": "orthopedic health",
    "bone": "orthopedic health",
    "eye": "vision health",
    "ear": "hearing health",
    "dental": "oral health",
    "tooth": "oral health",
    "teeth": "oral health",
    "brain": "neurology",
    "nerve": "neurology",
    "lung": "pulmonology",
    "kidney": "nephrology",
    "liver": "hepatology",
    "immune": "immunology",
    "infection": "infectious disease",
    "surgery": "surgical procedures",
    "injury": "trauma care",
    "wound": "wound care",
    "medication": "pharmacology",
    "vaccine": "immunization",
    "genetic": "genetics",
    "hormone": "endocrinology",
    "mental": "mental health",
    "rehabilitation": "physical therapy",
    "chronic": "chronic disease management"
  };
  
  for (const word of words) {
    if (commonTerms[word]) {
      topics.push(commonTerms[word]);
    }
  }
  
  return [...new Set(topics)]; // Remove duplicates
};

export default processMessage;