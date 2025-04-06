// API Keys - In a production app, these should be stored securely server-side
const ELEVENLABS_API_KEY = "sk_4169347e0599305058abedbcc4def4f15b67cd4641f9602d";
const ELEVENLABS_AGENT_ID = "AkrUWgQtWF1pD1S59GQv";

// DOM Elements
const exerciseSelect = document.getElementById('exerciseSelect');
const analyzeBtn = document.getElementById('analyzeBtn');
const playAudioBtn = document.getElementById('playAudioBtn');
const feedbackContainer = document.getElementById('feedbackContainer');
const audioPlayer = document.getElementById('audioPlayer');
const videoPlaceholder = document.getElementById('videoPlaceholder');

// Mock movement data - In the real app, this would come from MoveNet
const mockMovementData = {
    squat: {
        exerciseType: "squat",
        repetitions: 5,
        formIssues: ["Knees going too far forward", "Back not straight enough"],
        metrics: {
            kneeAngle: 85, // Should be 90 degrees
            hipDepth: "inadequate",
            backAngle: 70 // Should be closer to 45 degrees
        }
    },
    pushup: {
        exerciseType: "pushup",
        repetitions: 8,
        formIssues: ["Elbows flaring out", "Hips sagging"],
        metrics: {
            elbowAngle: 80, // Should be 90 degrees
            bodyAlignment: "poor",
            depthOfMovement: "insufficient"
        }
    },
    lunge: {
        exerciseType: "lunge",
        repetitions: 6,
        formIssues: ["Front knee going beyond toes", "Torso leaning too far forward"],
        metrics: {
            kneeAlignment: "poor",
            stepLength: "too short",
            balance: "unstable"
        }
    }
};

// Pre-written feedback for our MVP
const exerciseFeedback = {
    squat: "I've analyzed your squat form. I noticed your knees are going too far forward, which can strain your joints. Try to keep your weight in your heels. Also, focus on keeping your back straighter throughout the movement. Your depth is a bit shallow - aim to get your thighs parallel to the ground. Overall, good effort but let's work on these form issues for better results and to prevent injury.",
    pushup: "Looking at your push-up form, I can see your elbows are flaring out too much. Try to keep them at about a 45-degree angle from your body. I also noticed your hips are sagging - engage your core to maintain a straight line from head to heels. Your depth could be improved too - aim to get your chest closer to the ground. Let's work on these adjustments to make your push-ups more effective.",
    lunge: "Analyzing your lunge form, I can see your front knee is extending beyond your toes, which puts unnecessary strain on the knee joint. Try taking a slightly longer step to prevent this. Your torso is leaning too far forward - keep it upright to engage your core properly. Your balance seems a bit unstable - focus on a solid foot placement and core engagement. These adjustments will help make your lunges more effective and safer."
};

// Event Listeners
analyzeBtn.addEventListener('click', analyzeExercise);
playAudioBtn.addEventListener('click', playAudioFeedback);

// Mock analysis function - In real app, this would process MoveNet data
function analyzeExercise() {
    // Show loading state
    feedbackContainer.innerHTML = "<p>Analyzing exercise...</p>";
    
    // Get selected exercise
    const selectedExercise = exerciseSelect.value;
    
    // Simulate analysis delay
    setTimeout(() => {
        // Display feedback
        feedbackContainer.innerHTML = `<h3>${selectedExercise.charAt(0).toUpperCase() + selectedExercise.slice(1)} Analysis</h3>
                                      <p>${exerciseFeedback[selectedExercise]}</p>`;
        
        // Generate audio with ElevenLabs
        generateAudioFeedback(exerciseFeedback[selectedExercise])
            .then(audioUrl => {
                audioPlayer.src = audioUrl;
                playAudioBtn.classList.remove('hidden');
            })
            .catch(error => {
                console.error('Error generating audio:', error);
                feedbackContainer.innerHTML += `<p style="color: red;">Error generating audio feedback. Please try again.</p>`;
            });
            
        // Update video placeholder with exercise image
        videoPlaceholder.innerHTML = `<img src="https://via.placeholder.com/400x300?text=${selectedExercise.toUpperCase()}" alt="${selectedExercise} form">`;
    }, 1500);
}

// Function to generate audio feedback using ElevenLabs
async function generateAudioFeedback(feedbackText) {
    // For MVP, we're using a simple voice synthesis endpoint rather than the full agent
    // In a complete implementation, you would use the agent-specific endpoint
    
    try {
        // Using a default voice ID - replace with your preferred voice
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
        console.error('Error in generateAudioFeedback:', error);
        throw error;
    }
}

// Function to use trained ElevenLabs agent - alternative implementation
async function useTrainedAgent(feedbackText, movementData) {
    try {
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/agents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                agent_id: ELEVENLABS_AGENT_ID,
                input_text: "How was my form?",
                voice_id: "21m00Tcm4TlvDq8ikWAM",
                context: JSON.stringify(movementData)
            })
        });
        
        if (!response.ok) {
            throw new Error(`Agent API error: ${response.status}`);
        }
        
        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
    } catch (error) {
        console.error('Error in useTrainedAgent:', error);
        throw error;
    }
}

// Function to play audio feedback
function playAudioFeedback() {
    audioPlayer.play();
}