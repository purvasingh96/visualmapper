import * as React from 'react';
import { useState } from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';
import TableModal from './table-modal';
function GeoMapControlPanel(props) {
    const menuItems = [];
    const [property, setProperty] = useState(props.dimensions.keys().next().value);
    props.dimensions.forEach((value, key) => {
        menuItems.push(React.createElement(MenuItem, { key: key, value: key }, value.label));
    });
    const handleChange = (event) => {
        const eventTargetValue = event.target.value;
        props.onChange(eventTargetValue);
        setProperty(eventTargetValue);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "control-panel", style: { top: 90, right: 130 } },
            React.createElement("p", { className: "title" }, props.name),
            React.createElement(FormControl, { fullWidth: true },
                React.createElement(Select, { labelId: "outlined-choose-stats-label", label: "Choose a Statistic", id: "choose-stats", defaultValue: props.dimensions.keys().next().value, onChange: handleChange, variant: "outlined" }, menuItems),
                React.createElement(TableModal, { name: property, dataUrl: props.dataUrl }),
                React.createElement("div", { key: 'borderWidth', className: "input" },
                    React.createElement("label", null, "Border Width"),
                    React.createElement("input", { type: "range", value: props.borderWidth, min: 1, max: 7, step: 1, onChange: evt => props.onChangeBorderWidth(evt.target.value) }))))));
}
export default GeoMapControlPanel;
