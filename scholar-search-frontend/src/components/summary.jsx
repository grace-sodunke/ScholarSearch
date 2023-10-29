import React from "react";
import { useState, useEffect } from "react";

export default function Summary(props){
    // const[summary, setSummary] = useState("");

    useEffect(() => {
        // Fetch data when searchQuery changes
        const fetchSummary = async () => {
            try {
              const requestBody = { query: props.query };
          
              // Make a POST request to your API endpoint with the request body
              const response = await fetch('/api/querySearch', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json', // Set the content type to JSON
                },
                body: JSON.stringify(requestBody), // Convert the data to JSON format
              });
          
              if (!response.ok) {
                throw new Error('Failed to fetch summary');
              }
          
              const data = await response.json();
              props.setSummary(data.summary);
            } catch (error) {
              console.error('Error fetching summary:', error);
            }
          };
        
        fetchSummary();
      }, [props.query]);

    return(
        <div>
            <h2>Summary</h2>
            <p>{props.summary}</p>
        </div>
    )
}