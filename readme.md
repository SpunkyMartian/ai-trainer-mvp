# AI Personal Trainer/Rehab MVP

This is a minimal viable product (MVP) for an AI-powered personal trainer and rehabilitation assistant.

## Overview

This MVP demonstrates:
- A basic UI for exercise analysis
- Integration with ElevenLabs for voice feedback
- Mock data for exercise analysis (replacing real-time MoveNet processing)

## Files Included

- `index.html`: The main HTML file
- `app.js`: Core application logic
- `agent.js`: Alternative implementation for ElevenLabs agent integration

## Quick Setup

1. Download all files to a local directory
2. Open `index.html` in a modern web browser
3. Select an exercise from the dropdown
4. Click the "Analyze Exercise" button
5. Click "Play Audio Feedback" to hear the generated voice response

## API Integration

This MVP includes integration with:
- ElevenLabs Text-to-Speech API with your agent ID: `AkrUWgQtWF1pD1S59GQv`

## Notes for Further Development

To turn this MVP into a complete application, you would need to:

1. Integrate real-time MoveNet for pose detection through camera
2. Create a proper analysis engine for exercise form
3. Implement Claude for more dynamic feedback generation
4. Add HeyGen for video demonstrations
5. Build a proper user profile and progress tracking system
6. Move API keys to a secure backend

## Security Warning

In a production environment, never store API keys in client-side code. This MVP includes API keys in the JavaScript files for demonstration purposes only.