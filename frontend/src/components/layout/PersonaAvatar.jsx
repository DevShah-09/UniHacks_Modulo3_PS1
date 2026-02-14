import React, { useEffect, useRef, useState } from 'react';
import StreamingAvatar, { AvatarQuality, TaskType } from '@heygen/streaming-avatar';
import api from '../../api/axios';

// Test/demo avatars - update with available IDs from your account
const AVATAR_CONFIGS = {
  innovator: {
    avatarId: 'default',
    voiceId: 'default',
  },
  riskEvaluator: {
    avatarId: 'default',
    voiceId: 'default',
  },
  strategist: {
    avatarId: 'default',
    voiceId: 'default',
  },
};

const PersonaAvatar = ({ persona, textToSpeak, onSpeakingStart, onSpeakingEnd }) => {
  const [stream, setStream] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const mediaStream = useRef(null);

  // Initialize Avatar Session
  useEffect(() => {
    let mounted = true;

    const initAvatar = async () => {
      if (avatar) return; // Already initialized

      setIsLoading(true);
      setError('');

      try {
        console.log('🎬 Starting avatar initialization for persona:', persona);
        
        // 1. Get Token from backend
        console.log('🔑 Requesting HeyGen streaming token...');
        const tokenResponse = await api.post('/ai/heygen-token');
        console.log('✅ Token response received');
        const token = tokenResponse.data?.data?.token;
        
        if (!token) {
          throw new Error('🚫 No token received from backend - check server logs');
        }
        console.log('✅ Token obtained (length:', token.length, ')');

        // 2. Create Avatar Instance
        console.log('🎥 Creating StreamingAvatar instance with token...');
        const newAvatar = new StreamingAvatar({
          token: token,
        });

        // 3. Setup Event Listeners BEFORE starting
        newAvatar.on('avatar_start_talking', () => {
          console.log('🔊 Avatar started speaking');
          if (onSpeakingStart) onSpeakingStart();
        });

        newAvatar.on('avatar_stop_talking', () => {
          console.log('🔇 Avatar stopped speaking');
          if (onSpeakingEnd) onSpeakingEnd();
        });

        newAvatar.on('stream_disconnected', () => {
          console.log('⚠️  Avatar stream disconnected');
        });

        newAvatar.on('stream_ready', () => {
          console.log('✅ Avatar stream ready');
        });

        // 4. Start Avatar Session
        const config = AVATAR_CONFIGS[persona] || AVATAR_CONFIGS.innovator;
        console.log('🎭 Starting avatar session with config:', config);

        // Initialize/start the avatar
        await newAvatar.createStartAvatar({
          quality: AvatarQuality.Low,
          avatarName: config.avatarId,
          voiceId: config.voiceId,
        });
        
        console.log('✅ Avatar session created successfully');

        if (mounted) {
          setAvatar(newAvatar);
          
          // Attach video stream
          const mediaStream = newAvatar.mediaStream;
          if (mediaStream && mediaStream.current) {
            mediaStream.current.srcObject = newAvatar.mediaStream;
            try {
              await mediaStream.current.play();
            } catch (playErr) {
              console.warn('⚠️  Could not auto-play video:', playErr.message);
            }
          }
        }

      } catch (err) {
        console.error('❌ Avatar initialization failed');
        console.error('  Error type:', err.constructor.name);
        console.error('  Error message:', err.message);
        console.error('  Status:', err.response?.status);
        console.error('  Data:', err.response?.data);
        console.error('  Full error:', err);
        
        const errorMsg = err.message || 'Avatar initialization failed';
        if (mounted) setError(`❌ ${errorMsg}`);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initAvatar();

    return () => {
      mounted = false;
      if (avatar) {
        console.log('🛑 Cleaning up avatar session');
        avatar.stopAvatar?.().catch(err => console.warn('Cleanup warning:', err));
      }
    };
  }, []); // Only run once on mount

  // Handle persona changes - would need to recreate session
  useEffect(() => {
    if (avatar && persona) {
      console.log('📍 Persona changed to:', persona);
      // Could implement avatar switching here if needed
    }
  }, [persona, avatar]);



  // Speak Text
  useEffect(() => {
    if (avatar && textToSpeak && textToSpeak.trim().length > 0) {
      console.log('💬 Sending text to avatar:', textToSpeak.substring(0, 50) + '...');
      avatar.speak({
        text: textToSpeak,
        task_type: TaskType.REPEAT,
      }).catch(err => {
        console.error('❌ Error speaking:', err.message);
      });
    }
  }, [avatar, textToSpeak]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#2A2C38]">
          <p className="text-gray-400 animate-pulse">Initializing Avatar...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#2A2C38]">
          <div className="text-red-400 text-sm px-4 text-center">
            <p className="font-semibold mb-2">Avatar Error</p>
            <p>{error}</p>
            <p className="text-xs text-gray-400 mt-2">Check browser console for details</p>
          </div>
        </div>
      )}

      <video
        ref={mediaStream}
        autoPlay
        playsInline
        muted={false}
        className="w-full h-full object-cover"
        style={{ pointerEvents: 'none' }}
      />

      {/* Overlay to show current persona */}
      {!error && (
        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white/80">
          {persona}
        </div>
      )}
    </div>
  );
};

export default PersonaAvatar;
