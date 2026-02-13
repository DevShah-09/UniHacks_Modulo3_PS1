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
}

// @desc    Analyze a post and generate AI feedback
// @param   {String} postContent - The content of the post to analyze
// @return  {Object} Object containing summary, mentorFeedback, and criticFeedback
const analyzePost = async (postContent) => {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      console.warn('GOOGLE_API_KEY not set. Skipping AI analysis.');
      return {
        summary: '',
        mentor: '',
        critic: ''
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert mentor and critic. Analyze the following company reflection post and provide feedback in JSON format.

Post Content:
"${postContent}"

Provide your response as a valid JSON object with exactly these three fields (keep responses concise):
{
  "summary": "A single sentence summary of the post's main idea",
  "mentorFeedback": "A supportive and encouraging comment (1-2 sentences) that acknowledges the reflection's value",
  "criticFeedback": "A logical critique pointing out potential risks or areas to reconsider (1-2 sentences)"
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
      critic: feedbackData.criticFeedback || ''
    };
  } catch (error) {
    console.error('Error analyzing post with AI:', error.message);
    // Return empty feedback on error to prevent route failure
    return {
      summary: '',
      mentor: '',
      critic: ''
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

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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
    console.error('Error refining text with AI:', error.message);
    // Return original text on error to prevent route failure
    return rantText;
  }
};

module.exports = { analyzePost, refineText };