import React, {useEffect, useState} from 'react'

import {FaSearch} from 'react-icons/fa'
import {Button} from 'react-bootstrap';
import './SearchBar.css'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SearchBar(props) {
    // const [helptext, setHelptext] = useState("Search for ...")
    const [query, setQuery] = useState('')

    // useEffect(() => {
    //     setHelptext("Search for ...");
    // }, [props.mode]);

    const handlekeyPress = (e) => {
        e.preventDefault()
        if (e.key === 'Enter') {
            setQuery(e.target.value.toLowerCase())
        }
    }

    useEffect(() => {
        // Fetch data when searchQuery changes
        const fetchSummary = async () => {
            try {
              const requestBody = { query };
          
              // Make a POST request to your API endpoint with the request body
              const response = await fetch('/api/summaries', {
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
      }, [query]);

    
    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input type="text" placeholder="Search for..." onChange={handlekeyPress} />
        </div>
    )

}

