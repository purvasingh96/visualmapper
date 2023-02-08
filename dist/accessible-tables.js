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
export function AccessibleTables(props) {
    const defaultHeaders = [];
    const [rows, setRows] = useState([]);
    const [currCol, setCurrCol] = useState('cases');
    const [headers, setHeaders] = useState(defaultHeaders);
    const [orderDirection, setOrderDirection] = useState('asc');
    useEffect(() => {
        async function getData() {
            const response = await fetch(props.dataUrl);
            console.log(props.dataUrl);
            const reader = response.body.getReader();
            const result = await reader.read(); // raw array
            const decoder = new TextDecoder('utf-8');
            const csv = decoder.decode(result.value); // the csv text
            const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
            const rows = results.data; // array of objects
            setHeaders(results.meta.fields);
            setRows(rows);
        }
        getData();
    }, [props]); // [] means just do this once, after initial render
    const sortArray = (arr, property, orderBy) => {
        switch (orderBy) {
            case 'asc':
            default:
                return arr.sort((a, b) => isNaN(Number(a[property])) ? (a[property] > b[property] ? 1 : b[property] > a[property] ? -1 : 0) : Number(a[property]) > Number(b[property]) ? 1 : Number(b[property]) > Number(a[property]) ? -1 : 0);
            case 'desc':
                return arr.sort((a, b) => isNaN(Number(a[property])) ? (a[property] < b[property] ? 1 : b[property] < a[property] ? -1 : 0) : Number(a[property]) < Number(b[property]) ? 1 : Number(b[property]) < Number(a[property]) ? -1 : 0);
        }
    };
    const handleSortRequest = (property) => {
        setCurrCol(property);
        setRows(sortArray(rows, property, orderDirection));
        orderDirection == 'asc' ? setOrderDirection('desc') : setOrderDirection('asc');
    };
    return (React.createElement(Paper, { variant: "outlined" },
        React.createElement(TableContainer, { sx: { maxHeight: 700 } },
            React.createElement(Table, { stickyHeader: true, sx: { minWidth: 1200, minHeight: 1000 }, "aria-label": "Table format for COVID data" },
                React.createElement(TableHead, null,
                    React.createElement(TableRow, { sx: {
                            "& th": {
                                fontSize: "1.5rem",
                                color: "white",
                                backgroundColor: "grey"
                            }
                        } }, headers.map((header) => (React.createElement(TableCell, { onClick: () => handleSortRequest(header) },
                        React.createElement(TableSortLabel, { active: header === currCol, direction: header == currCol ? orderDirection : 'asc' }, header)))))),
                React.createElement(TableBody, null, rows.map((row, i) => (React.createElement(TableRow, { key: i, sx: { '&:last-child td, &:last-child th': { border: 0 } } },
                    React.createElement(TableCell, { component: "th", scope: "row" }, row.name),
                    row.description && React.createElement(TableCell, { align: "left" }, row.description),
                    row.tests && React.createElement(TableCell, { align: "left" }, row.tests),
                    row.cases && React.createElement(TableCell, { align: "left" }, row.cases),
                    row.deaths && React.createElement(TableCell, { align: "left" }, row.deaths),
                    row.todayCases && React.createElement(TableCell, { align: "left" }, row.todayCases),
                    row.todayDeaths && React.createElement(TableCell, { align: "left" }, row.todayDeaths),
                    row.recovered && React.createElement(TableCell, { align: "left" }, row.recovered),
                    row.active && React.createElement(TableCell, { align: "left" }, row.active),
                    row.casesPerOneMillion && React.createElement(TableCell, { align: "left" }, row.casesPerOneMillion),
                    row.deathsPerOneMillion && React.createElement(TableCell, { align: "left" }, row.deathsPerOneMillion),
                    row.testsPerOneMillion && React.createElement(TableCell, { align: "left" }, row.testsPerOneMillion),
                    row.population && React.createElement(TableCell, { align: "left" }, row.population)))))))));
}
