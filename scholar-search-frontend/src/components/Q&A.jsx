import { useState, useEffect } from "react";
import React from "react";
import MicrophoneComponent from "./microphone";
import './Q&A.css'

export default function QandA(props) {
    const [question, setQuestion] = useState("");
    const [transcript, setTranscript] = useState("");

    useEffect(() => {
        // Fetch data when searchQuery changes
        const fetchQuestion = async () => {
            try {
                const requestBody = { query: props.query };
        
                // Make a POST request to your API endpoint with the request body
                const response = await fetch('/api/question', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Set the content type to JSON
                    },
                    body: JSON.stringify(requestBody), // Convert the data to JSON format
                });
        
                if (!response.ok) {
                    throw new Error('Failed to fetch question');
                }
          
              const data = await response.json();
              setQuestion(data.question);
            } catch (error) {
              console.error('Error fetching summary:', error);
            }
          };
        
        fetchQuestion();
      }, [props.practiceMode]);

    return (
        <div>
            <div className="question">Question: {question}</div>
            <MicrophoneComponent transcript={transcript} setTranscript={setTranscript}/>
        </div>
    )
}