import React from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { useNavigate } from 'react-router-dom';

export const SearchBox = ({ items }) => {
    const navigate = useNavigate();

    const handleOnSelect = (item) => {
        navigate(`/detail/${item.id}`);
    };

    return (
        <div style={{ width: '100%' }}>
            <ReactSearchAutocomplete
                items={items}
                onSelect={handleOnSelect}
                placeholder="Search posts..."
                styling={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    zIndex: 1000,
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                }}
            />
        </div>
    );
};
