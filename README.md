CultureStack
CultureStack is an innovative platform designed to enhance psychological safety and foster a positive team culture through advanced AI technologies. It provides a safe space for employees to express themselves, receive constructive AI feedback, and engage with their organization meaningfully.

Key Features
AI Persona Feedback

Receive instant, multi-perspective feedback on your writing from specialized AI personas:

The Innovator: Encourages creativity and out-of-the-box thinking.

The Risk Evaluator: Identifies potential pitfalls and safety concerns.

The Strategist: Aligns ideas with long-term goals and execution.

(Powered by Google Gemini & HeyGen Streaming Avatars)

Psychological Safety Engine

Harsh Word Detection: Real-time analysis of content to ensure constructive communication.

Safety Slider: Users choose their visibility level (Public, Team, or Anonymous), empowering them to speak up without fear.

Intelligent Podcast Hub

Upload & Transcribe: Automatically transcribe audio content using AssemblyAI.

AI Analysis: Get headers, summaries, and sentiment analysis for every podcast episode.

Real-Time Collaboration

Video Meetings: Integrated Jitsi Meet for instant, secure video conferencing.

Community Feed: Share reflections, upvote constructive ideas, and discuss with colleagues.

Direct Messaging: Real-time chat powered by Socket.io.

Knowledge Hub

A centralized resource center to search and discover cultural artifacts, guides, and best practices.

Technology Stack
Frontend

React 19 (Vite)

TailwindCSS v4

Socket.io Client

Jitsi Meet External API

Backend

Node.js & Express

MongoDB (Mongoose)

Socket.io (Real-time updates)

AI Integrations

Google Gemini: Generative text and persona logic

AssemblyAI: Speech-to-text and audio intelligence

HeyGen: Interactive streaming avatars (visual personas)

Getting Started
Prerequisites

Node.js (v18+)

MongoDB (Local or Atlas)

API Keys (AssemblyAI, Google Gemini, HeyGen)

Installation

Clone the repository

git clone https://github.com/DevShah-09/UniHacks_Modulo3_PS1.git
cd UniHacks_Modulo3_PS1


Backend Setup

cd backend
npm install
# Create a .env file with your API keys (see .env.example)
npm run dev


Frontend Setup

cd frontend
npm install
npm run dev


Access the App

Open http://localhost:5173
 in your browser.

Usage Highlights

Write Page: Draft your thoughts, check the Safety Score, and get AI feedback before publishing.

Meet Page: Create instant video rooms for Team Standups or Brainstorms.

Podcasts: Upload a team meeting recording and get an auto-generated summary in minutes.

Made with love for UniHacks Modulo 3
