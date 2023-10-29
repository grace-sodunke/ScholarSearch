import React, {useEffect, useState} from 'react'

import {FaSearch} from 'react-icons/fa'
import './SearchBar.css'

export default function SearchBar(props) {
    const [helptext, setHelptext] = useState("Search for ...")
    const [query, setQuery] = useState('')

    useEffect(() => {
        setHelptext("Search for ...");
    }, [props.mode]);

    const handlekeyPress = (e) => {
        if (e.key === 'Enter') {
            setQuery(e.target.value.toLowerCase())
        }
    }

    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input type="text" placeholder={helptext} onChange={handlekeyPress} />
        </div>
    )

}

