import React from 'react';
import { useContext } from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { CategContext } from '../context/CategContext';

export const Categories = ({ selCateg, setSelCateg }) => {
    const { categories } = useContext(CategContext);

    const handleChange = (event) => {
        const { value, checked } = event.target;
        setSelCateg((prev) =>
            checked ? [...prev, value] : prev.filter((categ) => categ !== value)
        );
    };

    return (
        <FormGroup>
            {categories &&
                categories.map((obj) => (
                    <FormControlLabel
                        key={obj.id}
                        control={
                            <Checkbox
                                value={obj.name}
                                onChange={handleChange}
                                checked={selCateg.includes(obj.name)}
                            />
                        }
                        label={obj.name}
                    />
                ))}
        </FormGroup>
    );
};
