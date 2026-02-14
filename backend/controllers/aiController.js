const axios = require('axios');

// @desc    Get HeyGen Streaming Token
// @route   POST /api/ai/heygen-token
// @access  Private
const getHeyGenToken = async (req, res) => {
  try {
    console.log('🎬 HeyGen token request received');
    console.log('🔑 API Key present:', !!process.env.HEYGEN_API_KEY);
    console.log('🔑 API Key length:', process.env.HEYGEN_API_KEY?.length);

    const response = await axios.post(
      'https://api.heygen.com/v1/streaming.create_token',
      {},
      {
        headers: {
          'x-api-key': process.env.HEYGEN_API_KEY,
        },
      }
    );

    console.log('✅ HeyGen token received successfully');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('❌ Error fetching HeyGen token:', error.response?.data || error.message);
    console.error('❌ Status:', error.response?.status);
    console.error('❌ Headers:', error.response?.headers);
    res.status(500).json({
      message: 'Failed to fetch HeyGen token',
      error: error.response?.data || error.message
    });
  }
};

module.exports = {
  getHeyGenToken,
};
