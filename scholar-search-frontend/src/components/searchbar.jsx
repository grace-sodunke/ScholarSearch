import React, {useEffect, useState} from 'react'

import {FaSearch} from 'react-icons/fa'
import {Button} from 'react-bootstrap';
import './SearchBar.css'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SearchBar(props) {
    // const [helptext, setHelptext] = useState("Search for ...")
    

    // useEffect(() => {
    //     setHelptext("Search for ...");
    // }, [props.mode]);

    const handlekeyPress = (e) => {
        // e.preventDefault()
        if (e.key === 'Enter') {
            props.setQuery(e.target.value.toLowerCase())
            props.setPracticeMode(false)
            // console.log("practicemode set to false due to enter keypress")
        }
    }


    
    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input type="text" placeholder="Search for..." onKeyUp={handlekeyPress} />
        </div>
    )

}

