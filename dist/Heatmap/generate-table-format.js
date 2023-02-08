import * as React from 'react';
import { useState, useEffect } from 'react';
import Papa from "papaparse";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableSortLabel } from '@mui/material';
function ConvertCSVToTable(props) {
    const [rows, setRows] = useState([]);
    const [orderDirection, setOrderDirection] = useState('asc');
    useEffect(() => {
        async function getData() {
            const response = await fetch(props.dataUrl);
            const reader = response.body.getReader();
            const result = await reader.read(); // raw array
            const decoder = new TextDecoder('utf-8');
            const csv = decoder.decode(result.value); // the csv text
            const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
            const rows = results.data; // array of objects
            setRows(rows);
        }
        getData();
    }, []); // [] means just do this once, after initial render
    const sortArray = (arr, property, orderBy) => {
        switch (orderBy) {
            case 'asc':
            default:
                return arr.sort((a, b) => Number(a[property]) > Number(b[property]) ? 1 : Number(b[property]) > Number(a[property]) ? -1 : 0);
            case 'desc':
                return arr.sort((a, b) => Number(a[property]) < Number(b[property]) ? 1 : Number(b[property]) < Number(a[property]) ? -1 : 0);
        }
    };
    const handleSortRequest = () => {
        setRows(sortArray(rows, props.name, orderDirection));
        orderDirection == 'asc' ? setOrderDirection('desc') : setOrderDirection('asc');
    };
    return (React.createElement(Paper, { variant: "outlined", sx: { width: '100%', overflow: 'hidden' } },
        React.createElement(TableContainer, { sx: { maxHeight: 500 } },
            React.createElement(Table, { sx: { minWidth: 500, minHeight: 500 }, "aria-label": "Table format for COVID data" },
                React.createElement(TableHead, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableCell, null, "Name"),
                        React.createElement(TableCell, { onClick: handleSortRequest },
                            React.createElement(TableSortLabel, { active: true, direction: orderDirection }, props.name)))),
                React.createElement(TableBody, null, rows.map((row, i) => (React.createElement(TableRow, { key: i, sx: { '&:last-child td, &:last-child th': { border: 0 } } },
                    React.createElement(TableCell, { component: "th", scope: "row" }, row.name),
                    React.createElement(TableCell, { align: "left" }, row[props.name])))))))));
}
export default ConvertCSVToTable;
