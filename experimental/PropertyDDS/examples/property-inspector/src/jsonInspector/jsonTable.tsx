import * as React from "react";

import { Box, Chip, Switch, TextField, FormLabel, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
    IInspectorTableProps,
    InspectorTable,
    IToTableRowsOptions,
    IToTableRowsProps,
    typeidToIconMap,
} from "@fluid-experimental/property-inspector-table";
import AutoSizer from "react-virtualized-auto-sizer";

import {
    // TreeNavigationResult,
    jsonArray, jsonString, jsonBoolean, jsonNumber, JsonCursor,
    // ObjectForest, TextCursor, brand,
} from "@fluid-internal/tree";
import { PropertyFactory } from "@fluid-experimental/property-properties";
// import { convertPSetSchema } from "../schemaConverter";
// import { getForestProxy } from "../forestProxy";

import { IInspectorRowData, getDataFromCursor } from "../cursorData";

const useStyles = makeStyles({
    boolColor: {
        color: "#9FC966",
    },
    constAndContextColor: {
        color: "#6784A6",
        flex: "none",
    },
    defaultColor: {
        color: "#808080",
    },
    typesCell: {
        color: "#EC4A41",
        height: "25px",
    },
    enumColor: {
        color: "#EC4A41",
        flex: "none",
    },
    numberColor: {
        color: "#32BCAD",
    },
    stringColor: {
        color: "#0696D7",
    },
    tooltip: {
        backgroundColor: "black",
        maxWidth: "100vw",
        overflow: "hidden",
        padding: "4px 8px",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    typesBox: {
        display: "flex",
        width: "100%",
    },
}, { name: "JsonTable" });

PropertyFactory.register({
    typeid: "Test:GeodesicLocation-1.0.0",
    properties: [
        { id: "lat", typeid: "Float64" },
        { id: "lon", typeid: "Float64" },
    ],
});

PropertyFactory.register({
    typeid: "Test:CartesianLocation-1.0.0",
    properties: [
        { id: "coords", typeid: "Float64", context: "array" },
    ],
});

PropertyFactory.register({
    typeid: "Test:Address-1.0.0",
    inherits: ["Test:GeodesicLocation-1.0.0", "Test:CartesianLocation-1.0.0"],
    properties: [
        { id: "street", typeid: "String" },
        { id: "city", typeid: "String" },
        { id: "zip", typeid: "String" },
        { id: "country", typeid: "String" },
    ],
});

PropertyFactory.register({
    typeid: "Test:Person-1.0.0",
    inherits: ["NodeProperty"],
    properties: [
        { id: "name", typeid: "String" },
        { id: "age", typeid: "Int32" },
        { id: "salary", typeid: "Float64" },
        { id: "address", typeid: "Test:Address-1.0.0" },
        { id: "friends", typeid: "String", context: "map" },
    ],
});

// export const toTableRows = ({ data: forest }: Partial<IInspectorRowData>, props: IToTableRowsProps,
//     _options?: Partial<IToTableRowsOptions>, _pathPrefix?: string,
// ): IInspectorRowData[] => {
//     const reader = forest.allocateCursor();
//     const result = (forest as ObjectForest).tryGet(reader.buildAnchor(), reader);
//     if (result === TreeNavigationResult.Ok) {
//         return getDataFromCursor(reader, [], props.readOnly);
//     }
//     return [];
// };

const toTableRows = ({ data, id = "root" }: Partial<IInspectorRowData>, props: IToTableRowsProps,
    _options?: Partial<IToTableRowsOptions>, _pathPrefix?: string,
): IInspectorRowData[] => {
    const jsonCursor = new JsonCursor(data);
    return getDataFromCursor(jsonCursor, [], props.readOnly);
};

export type IJsonTableProps = IInspectorTableProps;

const jsonTableProps: Partial<IJsonTableProps> = {
    columns: ["name", "value", "type"],
    expandColumnKey: "name",
    toTableRows,
    dataCreationOptionGenerationHandler: () => ({
        name: "property",
        templates: {
            primitives: ["Json.Number"],
        },
    }),
    dataCreationHandler: async () => { },
    addDataForm: ({ styleClass }) => {
        return (
            <AutoSizer defaultHeight={200} defaultWidth={200}>
                {({ width, height }) => (
                    <div style={{
                        height: `${height - 20}px`,
                        width: `${width - 20}px`,
                    }}>
                        <Box
                            className={styleClass}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}>
                            <Box sx={{ display: "flex", height: "75px" }}>
                                <TextField label="name"></TextField>
                                <TextField label="value"></TextField>
                            </Box>
                            <Box sx={{ display: "flex", height: "75px" }}>
                                <Button>Cancel</Button>
                                <Button>Create</Button>
                            </Box>
                        </Box>
                    </div>)
                }
            </AutoSizer >);
    },
    generateForm: () => {
        return true;
    },
    // TODO: // Fix types
    rowIconRenderer: (rowData: any) => {
        switch (rowData.type) {
            case "String":
            case "Array":
                return typeidToIconMap[rowData.type] as React.ReactNode;
            default:
                break;
        }
    },
    width: 1000,
    height: 600,
};

// export const getForest = (data: any = {}) => {
//     const forest = new ObjectForest();
//     convertPSetSchema("Test:Person-1.0.0", forest.schema);
//     if (data) {
//         // Not sure how best to create data from Schema
//         const cursor = new TextCursor({
//             type: brand("Test:Person-1.0.0"),
//             fields: {
//                 name: [{ value: "Adam", type: brand("String") }],
//                 address: [{
//                     fields: {
//                         street: [{ value: "treeStreet", type: brand("String") }],
//                     },
//                     type: brand("Test:Address-1.0.0"),
//                  }],
//             },
//         });
//         const proxy = getForestProxy(cursor);
//         // window.proxy = proxy;
//         const newRange = forest.add([cursor]);
//         const dst = { index: 0, range: forest.rootField };
//         forest.attachRangeOfChildren(dst, newRange);
//     }
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//     return forest;
// };

export const JsonTable = (props: IJsonTableProps) => {
    const classes = useStyles();
    return <InspectorTable
        {...jsonTableProps}
        columnsRenderers={
            {
                name: ({ rowData, cellData, renderCreationRow, tableProps: { readOnly } }) => {
                    return (
                        rowData.isNewDataRow && !readOnly
                            ? renderCreationRow(rowData)
                            : cellData
                    ) as React.ReactNode;
                },
                type: ({ rowData }) => {
                    if (rowData.isNewDataRow) {
                        return <div></div>;
                    }
                    return <Box className={classes.typesBox}>
                        <Chip
                            label={rowData.type}
                            className={classes.typesCell} />
                    </Box>;
                },
                value: ({ rowData, tableProps: { readOnly = false } }) => {
                    const { type, value } = rowData;
                    switch (type) {
                        case jsonBoolean.name:
                            return <Switch
                                size="small"
                                color="primary"
                                checked={value as boolean}
                                value={rowData.name}
                                disabled={!!readOnly}
                            />;

                        case jsonString.name:
                            return <TextField value={value}
                                disabled={!!readOnly} type="string" />;
                        case jsonNumber.name:
                            return <TextField value={value}
                                disabled={!!readOnly} type="number" />;
                        case jsonArray.name:
                            return <FormLabel> {value}</FormLabel>;
                        default:
                            return <div></div>;
                    }
                },
            }
        }
        {...props}
    />;
};
