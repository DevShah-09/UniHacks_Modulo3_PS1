let GoogleGenerativeAI = null;
let genAI = null;

try {
  // require lazily — if the package is not installed we fall back to a no-op implementation
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
  if (process.env.GOOGLE_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
} catch (err) {
  console.warn('@google/generative-ai not available; AI features will be disabled.');
  console.error('Generative AI Load Error:', err);
}

// @desc    Analyze a post and generate AI feedback from multiple personas
// @param   {String} postContent - The content of the post to analyze
// @return  {Object} Object containing feedback from all personas
const analyzePost = async (postContent) => {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      console.warn('GOOGLE_API_KEY not set. Skipping AI analysis.');
      return {
        summary: '',
        mentor: '',
        critic: '',
        strategist: '',
        executionManager: '',
        riskEvaluator: '',
        innovator: ''
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `You are an expert team of advisors. Analyze the following company reflection post and provide feedback from 5 different personas in JSON format.

Post Content:
"${postContent}"

Provide your response as a valid JSON object with exactly these seven fields (keep responses concise, 1-2 sentences each):
{
  "summary": "A single sentence summary of the post's main idea",
  "mentorFeedback": "A supportive and encouraging comment acknowledging the reflection's value",
  "criticFeedback": "A logical critique pointing out potential risks or areas to reconsider",
  "strategistFeedback": "Strategic implications and long-term thinking perspective",
  "executionManagerFeedback": "Practical advice on how to implement or action this reflection",
  "riskEvaluatorFeedback": "Potential risks, downsides, or unintended consequences",
  "innovatorFeedback": "Creative ideas to build on this reflection or new perspectives"
}

Return ONLY the JSON object, no additional text.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the JSON response
    let feedbackData;
    try {
      feedbackData = JSON.parse(responseText);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        feedbackData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }

    return {
      summary: feedbackData.summary || '',
      mentor: feedbackData.mentorFeedback || '',
      critic: feedbackData.criticFeedback || '',
      strategist: feedbackData.strategistFeedback || '',
      executionManager: feedbackData.executionManagerFeedback || '',
      riskEvaluator: feedbackData.riskEvaluatorFeedback || '',
      innovator: feedbackData.innovatorFeedback || ''
    };
  } catch (error) {
    console.error('Error analyzing post with AI:', error.message);
    // Return empty feedback on error to prevent route failure
    return {
      summary: '',
      mentor: '',
      critic: '',
      strategist: '',
      executionManager: '',
      riskEvaluator: '',
      innovator: ''
    };
  }
};

// @desc    Refine raw text (rant) into constructive professional reflection
// @param   {String} rantText - The raw text to refine
// @return  {String} Refined, professional text safe for corporate environment
const refineText = async (rantText) => {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      console.warn('GOOGLE_API_KEY not set. Skipping text refinement.');
      return rantText;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `You are an expert at transforming raw, emotional feedback into constructive, professional reflections. 
    
Raw text:
"${rantText}"

Rewrite this text to be:
- Constructive and professional
- Safe for a corporate environment
- Focused on solutions and learnings rather than complaints
- Respectful and positive in tone
- While preserving the core concerns and emotions

Return ONLY the refined text, no explanations or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const refinedText = result.response.text().trim();

    return refinedText;
  } catch (error) {
    const fs = require('fs');
    try {
      fs.appendFileSync('./log.txt', 'REFINE ERROR: ' + error + '\n', 'utf8');
      fs.appendFileSync('./log.txt', 'REFINE ERROR MESSAGE: ' + error.message + '\n', 'utf8');
    } catch (e) {
      // ignore
    }
    console.error('Error refining text with AI:', error.message);
    // Return original text on error to prevent route failure
    return rantText;
  }
};

module.exports = { analyzePost, refineText };