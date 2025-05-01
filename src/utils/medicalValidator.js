// src/utils/medicalValidator.js

/**
 * Medical information validation system
 * Ensures responses meet medical accuracy standards
 */

// Confidence level classifications
export const ConfidenceLevel = {
    HIGH: "high", // Well-established medical facts
    MEDIUM: "medium", // Generally accepted information with some variations
    LOW: "low", // Limited evidence or mixed research findings
    INFORMATIONAL: "informational" // General health information not specific to diagnosis
  };
  
  /**
   * Validates medical information and assigns confidence levels
   * @param {string} responseText - The text to validate
   * @param {string} medicalTopic - The medical topic being addressed
   * @returns {Object} Validation result with confidence level and annotations
   */
  export const validateMedicalInformation = (responseText, medicalTopic) => {
    // Start with a default result
    const result = {
      text: responseText,
      isValidated: true,
      confidenceLevel: ConfidenceLevel.MEDIUM,
      annotations: [],
      recommendConsultation: false
    };
  
    // Check if this topic requires professional consultation disclaimer
    if (requiresConsultationDisclaimer(medicalTopic)) {
      result.recommendConsultation = true;
      result.annotations.push({
        type: "consultation",
        message: "This topic requires professional medical evaluation."
      });
    }
  
    // Determine confidence level based on topic
    result.confidenceLevel = determineConfidenceLevel(medicalTopic);
  
    // Check for potentially harmful advice
    const harmCheck = containsHarmfulAdvice(responseText);
    if (harmCheck.contains) {
      result.isValidated = false;
      result.annotations.push({
        type: "warning",
        message: harmCheck.reason
      });
    }
  
    // Add appropriate disclaimer based on confidence level
    result.disclaimer = generateDisclaimer(result.confidenceLevel, medicalTopic);
  
    return result;
  };
  
  /**
   * Determines if a topic requires explicit consultation disclaimer
   * @param {string} topic - Medical topic
   * @returns {boolean} Whether consultation disclaimer is needed
   */
  const requiresConsultationDisclaimer = (topic) => {
    const consultationTopics = [
      "chest pain", "heart attack", "stroke", "cancer", "severe pain",
      "pregnancy complications", "mental health crisis", "suicidal",
      "severe injury", "breathing difficulty", "diagnosis", "treatment",
      "medication dosage", "prescription", "severe symptoms"
    ];
    
    return consultationTopics.some(t => 
      topic.toLowerCase().includes(t.toLowerCase())
    );
  };
  
  /**
   * Determines confidence level based on the medical topic
   * @param {string} topic - Medical topic
   * @returns {string} Confidence level
   */
  const determineConfidenceLevel = (topic) => {
    // Topics with high confidence (well-established medical knowledge)
    const highConfidenceTopics = [
      "diabetes symptoms", "hypertension", "common cold", 
      "flu symptoms", "vaccination", "hydration"
    ];
    
    // Topics with lower confidence (more variables or evolving research)
    const lowConfidenceTopics = [
      "alternative medicine", "emerging treatments", "diet effectiveness",
      "supplement benefits", "rare conditions", "new research"
    ];
    
    // Check topic against our confidence lists
    if (highConfidenceTopics.some(t => topic.toLowerCase().includes(t.toLowerCase()))) {
      return ConfidenceLevel.HIGH;
    } else if (lowConfidenceTopics.some(t => topic.toLowerCase().includes(t.toLowerCase()))) {
      return ConfidenceLevel.LOW;
    }
    
    // Default to medium confidence for general medical information
    return ConfidenceLevel.MEDIUM;
  };
  
  /**
   * Checks if response contains potentially harmful medical advice
   * @param {string} text - Response text
   * @returns {Object} Result of harmful content check
   */
  const containsHarmfulAdvice = (text) => {
    const harmfulPatterns = [
      {
        pattern: /stop (?:taking|using) (?:medication|medicine|prescribed)/i,
        reason: "Never suggest stopping prescribed medication without medical consultation"
      },
      {
        pattern: /(?:guaranteed|always|100% effective)/i,
        reason: "Medical treatments rarely have guarantees of effectiveness"
      },
      {
        pattern: /(?:cure|treat|heal) (?:cancer|alzheimer|diabetes|serious|chronic)/i,
        reason: "Avoid claiming cures for serious conditions"
      },
      {
        pattern: /instead of (?:seeing|consulting|visiting) (?:doctor|physician|healthcare)/i,
        reason: "Never recommend alternatives to professional medical care"
      }
    ];
    
    // Check text against harmful patterns
    for (const item of harmfulPatterns) {
      if (item.pattern.test(text)) {
        return { contains: true, reason: item.reason };
      }
    }
    
    return { contains: false };
  };
  
  /**
   * Generates appropriate medical disclaimer based on confidence level
   * @param {string} confidenceLevel - Confidence level
   * @param {string} topic - Medical topic
   * @returns {string} Appropriate disclaimer
   */
  const generateDisclaimer = (confidenceLevel, topic) => {
    const baseDisclaimer = "This information is general in nature and not a substitute for professional medical advice.";
    
    switch (confidenceLevel) {
      case ConfidenceLevel.HIGH:
        return `${baseDisclaimer} This represents widely accepted medical understanding of ${topic}.`;
      
      case ConfidenceLevel.LOW:
        return `${baseDisclaimer} The information about ${topic} may be evolving as medical research continues. Consult a healthcare provider for the most current guidance.`;
      
      case ConfidenceLevel.INFORMATIONAL:
        return `${baseDisclaimer} This information is provided for educational purposes only.`;
      
      default:
        return baseDisclaimer;
    }
  };
  
  /**
   * Enhances response with visual indicators of confidence
   * @param {string} response - Original response text
   * @param {Object} validationResult - Validation result
   * @returns {string} Enhanced response with visual indicators
   */
  export const enhanceResponseWithConfidence = (response, validationResult) => {
    let enhancedResponse = response;
    
    // Add visual confidence indicator based on level
    const confidenceIndicator = getConfidenceIndicator(validationResult.confidenceLevel);
    
    // Add annotations if any
    if (validationResult.annotations.length > 0) {
      const annotationText = validationResult.annotations
        .map(a => `${a.type === 'warning' ? '⚠️' : 'ℹ️'} ${a.message}`)
        .join('\n');
      enhancedResponse = `${enhancedResponse}\n\n${annotationText}`;
    }
    
    // Add consultation recommendation if needed
    if (validationResult.recommendConsultation) {
      enhancedResponse = `${enhancedResponse}\n\n👩‍⚕️ This topic requires evaluation by a healthcare professional.`;
    }
    
    // Add confidence indicator and disclaimer
    enhancedResponse = `${confidenceIndicator} ${enhancedResponse}\n\n${validationResult.disclaimer}`;
    
    return enhancedResponse;
  };
  
  /**
   * Gets confidence indicator symbol based on confidence level
   * @param {string} confidenceLevel - Confidence level
   * @returns {string} Confidence indicator symbol
   */
  const getConfidenceIndicator = (confidenceLevel) => {
    switch (confidenceLevel) {
      case ConfidenceLevel.HIGH:
        return "🟢"; // Green circle for high confidence
      case ConfidenceLevel.MEDIUM:
        return "🟠"; // Orange circle for medium confidence
      case ConfidenceLevel.LOW:
        return "🟡"; // Yellow circle for low confidence
      case ConfidenceLevel.INFORMATIONAL:
        return "ℹ️"; // Information symbol for general info
      default:
        return "";
    }
  };
  
  // Example usage:
  // 1. Process medical response
  // const rawResponse = processMessage(userInput);
  // 
  // 2. Validate the response
  // const validationResult = validateMedicalInformation(rawResponse, userInput);
  // 
  // 3. Enhance response with confidence indicators
  // const enhancedResponse = enhanceResponseWithConfidence(rawResponse, validationResult);
  // 
  // 4. Return the enhanced response to the user
  // return enhancedResponse;