/// <reference types="react" />
export declare type COVIDStatisticsType = {
    name: string;
    descrtiption: string;
    cases: string;
    active: string;
    casesPerOneMillion: string;
    deaths: string;
    deathsPerOneMillion: string;
    population: string;
    recovered: string;
    state: string;
    tests: string;
    testsPerOneMillion: string;
    todayCases: string;
    todayDeaths: string;
};
declare type ConvertCSVToTableProps = {
    name: string;
    dataUrl: string;
};
declare function ConvertCSVToTable(props: ConvertCSVToTableProps): JSX.Element;
export default ConvertCSVToTable;
