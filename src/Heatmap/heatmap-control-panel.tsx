import * as React from 'react';
import {useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import TableModal from './table-modal';


type GeoMapControlPanelProps = {
    name: String,
    dimensions: Map<string, string>,
    onChange: Function,
	onChangeBorderWidth: Function,
	dataUrl: string,
	borderWidth: number
}

function GeoMapControlPanel(props: GeoMapControlPanelProps) {
	const menuItems: any = [];
	const [property, setProperty] = useState(props.dimensions.keys().next().value);
	
	
    props.dimensions.forEach((value: any, key: any) => {
        menuItems.push(<MenuItem key={key} value={key}>{value.label}</MenuItem>);
    });

	const handleChange = (event: SelectChangeEvent) => {
		const eventTargetValue = event.target.value;
		props.onChange(eventTargetValue);
		setProperty(eventTargetValue);
	}

	return (
		<>
		<div className="control-panel" style={{top:90, right:130}}>
			<p className="title">{props.name}</p>
			<FormControl fullWidth>
				{/* <InputLabel shrink id="choose-stats-label">Choose a Statistic</InputLabel> */}
				<Select
					labelId="outlined-choose-stats-label"
					label="Choose a Statistic"
					id="choose-stats"
					defaultValue={props.dimensions.keys().next().value}
					onChange={handleChange}
					variant="outlined"
				>
					{menuItems}
				</Select>
				<TableModal name={property} dataUrl={props.dataUrl}/>	
				{/* <FormControlLabel control={<input type={"checkbox"} checked={check} onChange={handleCheckboxChange} />} label="View Pattern Layer" /> */}
				<div key={'borderWidth'} className="input">
					<label>Border Width</label>
					<input
					type="range"
					value={props.borderWidth}
					min={1}
					max={7}
					step={1}
					onChange={evt => props.onChangeBorderWidth(evt.target.value)}
					/>
				</div>
			</FormControl>
			
		</div>
		
		</>
	);
}

export default GeoMapControlPanel;