import * as React from "react";

import { Box, Chip, Switch, TextField, FormLabel, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
    IInspectorTableProps,
    InspectorTable,
    IToTableRowsOptions,
    typeidToIconMap,
} from "@fluid-experimental/property-inspector-table";

import { TreeNavigationResult,
    JsonCursor,
    FieldKey,
    jsonArray, jsonString, jsonBoolean, jsonNumber, jsonObject,
    buildForest, Cursor, ObjectForest, brand, TextCursor } from "@fluid-internal/tree";

import { PropertyFactory } from "@fluid-experimental/property-properties";

import { IInspectorRowData, getDataFromCursor } from "../cursorData";

import { convertPSetSchema } from "../schemaConverter";
import { getForestProxy } from "../forestProxy";

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

export type IForestTableProps = IInspectorTableProps;

const toTableRows = ({ data: forest }: Partial<IInspectorRowData>, props: any,
    _options?: Partial<IToTableRowsOptions>, _pathPrefix?: string,
): IInspectorRowData[] => {
    const rootId = props.documentId;
    if (!forest) {
        return [];
    }
    const reader: Cursor = forest.allocateCursor();
    const result = forest.tryGet(forest.root(forest.rootField), reader);
    const trees = forest.getRoot(forest.rootField);
    if (result === TreeNavigationResult.Ok && trees?.length) {
        const root: IInspectorRowData = {
            id: rootId,
            name: "/",
            type: jsonObject.name,
            children: [],
        };
        for (let idx = 0; idx < trees?.length; idx++) {
            const treeId = `${rootId}/${String(idx)}`;
            reader.set(forest.rootField, idx);
            const tree: IInspectorRowData = {
                id: treeId,
                type: jsonObject.name,
                name: `/${String(idx).padStart(3, "0")}`,
                children: getDataFromCursor(reader, [], props.readOnly, treeId as FieldKey),
            };
            root.children?.push(tree);
        }
        return [root];
    }
    return [];
};

export const getForest = (data) => {
    const forest: ObjectForest = buildForest();
    convertPSetSchema("Test:Person-1.0.0", forest.schema);
    if (data) {
        const cursor = new JsonCursor(data);
        const cursor2 = new JsonCursor({ foo: " bar ", buz: { fiz: 1 } });
        // Not sure how best to create data from Schema
        const textCursor = new TextCursor({
            type: brand("Test:Person-1.0.0"),
            fields: {
                name: [{ value: "Adam", type: brand("String") }],
                address: [{
                    fields: {
                        street: [{ value: "treeStreet", type: brand("String") }],
                    },
                    type: brand("Test:Address-1.0.0"),
                 }],
            },
        });
        const proxy = getForestProxy(textCursor, forest, 2);
        // eslint-disable-next-line @typescript-eslint/dot-notation
        window["__proxy"] = proxy;
        const newRange = forest.add([cursor, cursor2, textCursor]);
        // const newRange = forest.add([textCursor]);
        forest.attachRangeOfChildren({ index: 0, range: forest.rootField }, newRange);
    }
    return forest;
};

const forestTableProps: Partial<IForestTableProps> = {
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
    addDataForm: () => {
        return (<Box sx={{ display: "flex", flexDirection: "column", height: "160px" }}>
            <Box sx={{ display: "flex", height: "75px" }}>
                <TextField label="name"></TextField>
                <TextField label="value"></TextField>
            </Box>
            <Box sx={{ display: "flex", height: "75px" }}>
                <Button>Cancel</Button>
                <Button>Create</Button>
            </Box>
        </Box>);
    },
    generateForm: () => {
        return true;
    },
    // TODO: // Fix types
    rowIconRenderer: (rowData: any) => {
        console.log(rowData.type);
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

export const ForestTable = (props: IForestTableProps) => {
    const classes = useStyles();

    return <InspectorTable
        {...forestTableProps}
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
