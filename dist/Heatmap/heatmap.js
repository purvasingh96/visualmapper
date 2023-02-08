import * as React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import ReactMap, { Source, Layer, GeolocateControl, FullscreenControl, NavigationControl } from 'react-map-gl';
import { scaleOrdinal, scaleQuantize } from 'd3-scale';
import { extent } from 'd3-array';
import GeoMapControlPanel from './heatmap-control-panel';
import { ACCESS_TOKEN } from '../constants/constants';
import { Container } from 'react-bootstrap';
import { Typography } from '@mui/material';
import LegendControl from 'mapboxgl-legend';
import '../styles/mapbox-gl-export.scss';
export function Heatmap(props) {
    const MAPBOX_TOKEN = ACCESS_TOKEN;
    const legendItems = ['_layerId', 'name', 'density', 'population', 'state', 'updated'];
    const colors = (specifier) => {
        var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
        while (i < n)
            colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
        return colors;
    };
    function convertHex(hexCode, opacity = 1) {
        var hex = hexCode.replace('#', '');
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        var r = parseInt(hex.substring(0, 2), 16), g = parseInt(hex.substring(2, 4), 16), b = parseInt(hex.substring(4, 6), 16);
        /* Backward compatibility for whole number based opacity values. */
        if (opacity > 1 && opacity <= 100) {
            opacity = opacity / 100;
        }
        return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    }
    const schemeCategory10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");
    const scale = scaleOrdinal(schemeCategory10);
    const toLabel = (text) => {
        let spaced = text.replace(/([A-Z])/g, ' $1');
        let capped = spaced.charAt(0).toUpperCase() + spaced.slice(1);
        let shrunk = capped.replace(' Per One ', '/');
        return shrunk.replace(/(Today)\s(\w+)/, '$2 $1');
    };
    const [patternLayerVisibility, setPatternLayerVisibility] = useState('none');
    const [title, setTitle] = useState('');
    const [hoverInfo, setHoverInfo] = useState(null);
    const [allData, setAllData] = useState({ json: undefined, dimensionMap: undefined });
    const [heatMapLayer, setHeatMapLayer] = useState(null);
    const [patternLayer, setPatternLayer] = useState(null);
    const [lineLayer, setLineLayer] = useState(null);
    const [mapRef, setMapRef] = useState(null);
    const [borderWidth, setBorderWidth] = useState(1);
    const [dimension, setDimension] = useState({
        value: "cases",
        label: 'Cases',
        color: '#1f77b4',
    });
    useEffect(() => {
        /* global fetch */
        fetch(props.geojsonUrl)
            .then(resp => resp.json())
            .then(json => {
            setAllData({ json: json, dimensionMap: splitDimensions(json) });
            setTitle(json.name);
            mapRef === null || mapRef === void 0 ? void 0 : mapRef.flyTo({ center: [json.initialViewState[0], json.initialViewState[1]], duration: 2000 });
            if (allData) {
                const dataLegend = new LegendControl({
                    // Show all properties in selected layers
                    layers: {
                        'dataLayer': ['fill-color']
                    },
                    toggler: true
                });
                const patternLegend = new LegendControl({
                    // Show all properties in selected layers
                    layers: {
                        'patternLayer': ['fill-pattern'],
                    },
                    toggler: true
                });
                mapRef === null || mapRef === void 0 ? void 0 : mapRef.addControl(patternLegend, "bottom-left");
                mapRef === null || mapRef === void 0 ? void 0 : mapRef.addControl(dataLegend, "bottom-left");
            }
        })
            .catch(err => console.error('Could not load data', err)); // eslint-disable-line
    }, [props, mapRef]);
    const quantizeProperty = (jsonData, dimz, property, color) => {
        let domain = [];
        let fillProperty;
        jsonData.features.forEach((f) => {
            let x = +f.properties[dimz.value];
            domain.push(x);
        });
        // extent: calculates min and max in an array
        if (property == "color") {
            if (extent(domain)[0] === extent(domain)[1]) {
                fillProperty = convertHex(color, 0.2);
            }
            else {
                const opacity = scaleQuantize()
                    .domain(extent(domain))
                    .range([0.2, 0.35, 0.5, 0.65, 0.8]);
                fillProperty = [
                    'step',
                    ['get', dimz.value],
                    convertHex(color, 0.1),
                    opacity.invertExtent(0.2)[0],
                    convertHex(color, 0.2),
                    opacity.invertExtent(0.35)[0],
                    convertHex(color, 0.35),
                    opacity.invertExtent(0.5)[0],
                    convertHex(color, 0.5),
                    opacity.invertExtent(0.65)[0],
                    convertHex(color, 0.65),
                    opacity.invertExtent(0.8)[0],
                    convertHex(color, 0.8)
                ];
            }
        }
        else {
            if (extent(domain)[0] === extent(domain)[1]) {
                fillProperty = "tmpoly-plus-100-black";
            }
            else {
                const opacity = scaleQuantize()
                    .domain(extent(domain))
                    .range([0.2, 0.35, 0.5, 0.65, 0.8]);
                fillProperty = [
                    'step',
                    ['get', dimz.value],
                    "tmpoly-plus-100-black",
                    opacity.invertExtent(0.2)[0],
                    "tmpoly-circle-light-100-black",
                    opacity.invertExtent(0.35)[0],
                    "tmpoly-grid-light-200-black",
                    opacity.invertExtent(0.5)[0],
                    "tmpoly-line-vertical-down-light-100-black",
                    opacity.invertExtent(0.65)[0],
                    "tmpoly-caret-200-black",
                    opacity.invertExtent(0.8)[0],
                    "tmpoly-caret-200-black",
                ];
            }
        }
        return fillProperty;
    };
    const data = useMemo(() => {
        if (allData.json) {
            setHeatMapLayer({
                id: 'dataLayer',
                type: 'fill',
                source: {
                    type: "geojson",
                    data: allData.json
                },
                paint: {
                    "fill-outline-color": "black",
                    'fill-color': quantizeProperty(allData.json, dimension, "color", allData.dimensionMap.get(dimension.value).color)
                },
            });
            setPatternLayer({
                id: 'patternLayer',
                type: 'fill',
                source: {
                    type: "geojson",
                    data: allData.json
                },
                paint: {
                    "fill-outline-color": "black",
                    'fill-color': allData.dimensionMap.get(dimension.value).color,
                    'fill-pattern': quantizeProperty(allData.json, dimension, "pattern", 'none')
                },
            });
            console.log('border width type: ', typeof borderWidth);
            console.log('border width: ', borderWidth);
            setLineLayer({
                id: 'lineLayer',
                type: 'line',
                source: {
                    type: "geojson",
                    data: allData.json
                },
                paint: {
                    'line-color': '#000',
                    'line-width': Number(borderWidth)
                },
            });
        }
        return allData;
    }, [allData, dimension, borderWidth]);
    const onHover = useCallback(event => {
        const { features, lngLat: { lng, lat }, point: { x, y } } = event;
        const hoveredFeature = features && features[0];
        // prettier-ignore
        setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y, lng, lat });
    }, []);
    function splitDimensions(allData) {
        let index = 0;
        let dimensionsMap = new Map();
        Object.keys(allData.features[0].properties).forEach((d) => {
            if (!legendItems.includes(d)) {
                const label = toLabel(d);
                const color = scale(index.toString());
                dimensionsMap.set(d, { label: label, color: color });
                index++;
            }
        });
        if (dimensionsMap) {
            setDimension({
                value: dimensionsMap.keys().next().value,
                label: dimensionsMap.values().next().value.label,
                color: dimensionsMap.values().next().value.color,
            });
        }
        return dimensionsMap;
    }
    ;
    return (React.createElement(Container, { fluid: true }, data.json && (React.createElement(React.Fragment, null,
        React.createElement(Typography, { variant: "h6", "aria-label": title }, title),
        React.createElement(ReactMap, { style: { border: '3px solid black', width: '90vw', height: '80vh', position: 'relative' }, ref: (ref) => setMapRef(ref), initialViewState: {
                zoom: 1.5
            }, mapStyle: "mapbox://styles/purvasingh/clb2khfje000j14mjt6dwbau8", mapboxAccessToken: MAPBOX_TOKEN, interactiveLayerIds: ['dataLayer', 'patternLayer'], onMouseMove: onHover, renderWorldCopies: false },
            React.createElement(GeolocateControl, { showUserHeading: true, position: 'top-left' }),
            React.createElement(FullscreenControl, { position: "top-left" }),
            React.createElement(NavigationControl, { position: "top-left" }),
            React.createElement("div", null,
                React.createElement(Source, { type: "geojson", data: data.json },
                    React.createElement(Layer, { ...heatMapLayer }),
                    React.createElement(Layer, { ...patternLayer }),
                    React.createElement(Layer, { ...lineLayer })),
                hoverInfo && dimension && (React.createElement("div", { className: "tooltip-custom", style: { left: hoverInfo.x, top: hoverInfo.y } },
                    React.createElement("div", null,
                        "State: ",
                        hoverInfo.feature.properties.name),
                    React.createElement("div", null,
                        "Population:",
                        ' ',
                        hoverInfo.feature.properties.population.toLocaleString()),
                    React.createElement("div", null,
                        allData.dimensionMap.get(dimension.value).label,
                        ":",
                        ' ',
                        hoverInfo.feature.properties[dimension.value].toLocaleString()))))),
        dimension && React.createElement(GeoMapControlPanel, { name: "COVID-19 STATE-BY-STATE DAILY STATISTIC HEATMAP LAYER", dimensions: data.dimensionMap, onChange: (e) => {
                setDimension({
                    value: e.toLocaleString(),
                    label: allData.dimensionMap.get(e.toLocaleString()).label,
                    color: allData.dimensionMap.get(e.toLocaleString()).color,
                });
            }, onChangeBorderWidth: value => setBorderWidth(value), dataUrl: props.dataUrl, borderWidth: borderWidth })))));
}
