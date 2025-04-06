// This is an alternative implementation that uses the ElevenLabs agent directly
// To use this, replace the generateAudioFeedback function in app.js with useElevenLabsAgent

async function useElevenLabsAgent(exerciseType) {
    const ELEVENLABS_API_KEY = "sk_4169347e0599305058abedbcc4def4f15b67cd4641f9602d";
    const ELEVENLABS_AGENT_ID = "AkrUWgQtWF1pD1S59GQv";
    
    // Get mock data for the selected exercise
    const movementData = mockMovementData[exerciseType];
    
    try {
        // Using ElevenLabs Agent API
        // Note: The exact endpoint may vary based on your agent's configuration
        const response = await fetch('https://api.elevenlabs.io/v1/agents/text-to-speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                agent_id: ELEVENLABS_AGENT_ID,
                input_text: `Analyze my ${exerciseType} form and provide feedback`,
                voice_id: "21m00Tcm4TlvDq8ikWAM", // Replace with your preferred voice ID
                model_id: "eleven_turbo_v2",
                context: JSON.stringify({
                    exercise_type: movementData.exerciseType,
                    form_issues: movementData.formIssues,
                    repetitions: movementData.repetitions,
                    performance_metrics: movementData.metrics
                })
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('ElevenLabs agent error details:', errorData);
            throw new Error(`ElevenLabs agent error: ${response.status}`);
        }
        
        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
    } catch (error) {
        console.error('Error using ElevenLabs agent:', error);
        // Fall back to the basic text-to-speech if agent fails
        return generateBasicAudioFeedback(exerciseFeedback[exerciseType]);
    }
}

// Fallback function for basic text-to-speech
async function generateBasicAudioFeedback(feedbackText) {
    const ELEVENLABS_API_KEY = "sk_4169347e0599305058abedbcc4def4f15b67cd4641f9602d";
    
    try {
        // Using a default voice ID
        const voiceId = "21m00Tcm4TlvDq8ikWAM"; 
        
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: feedbackText,
                model_id: 'eleven_turbo_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.status}`);
        }
        
        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
    } catch (error) {
        console.error('Error in fallback audio generation:', error);
        throw error;
    }
}