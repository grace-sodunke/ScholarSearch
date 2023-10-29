import React, {useEffect, useState} from 'react'

import {FaSearch} from 'react-icons/fa'


export default function SearchBar(props) {
    const [helptext, setHelptext] = useState('Search for ...')
    const [query, setQuery] = useState('')

    useEffect(() => {
        setHelptext('');
    }, [props.mode]);

    const handleSearch = (e) => {
        e.preventDefault()
        setQuery(e.target.value.toLowerCase())
    }

    return (
        <div className="searchbar">
            <label>Search</label>
            <FaSearch id="search-icon" />
            <input type="text" placeholder={setHelptext} onChange={handleSearch} />
        </div>
    )

}

