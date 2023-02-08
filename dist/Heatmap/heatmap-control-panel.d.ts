/// <reference types="react" />
declare type GeoMapControlPanelProps = {
    name: String;
    dimensions: Map<string, string>;
    onChange: Function;
    onChangeBorderWidth: Function;
    dataUrl: string;
    borderWidth: number;
};
declare function GeoMapControlPanel(props: GeoMapControlPanelProps): JSX.Element;
export default GeoMapControlPanel;
