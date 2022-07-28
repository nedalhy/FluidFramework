/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
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
    jsonArray, jsonString, jsonBoolean, jsonNumber,
    ObjectForest,
    ITreeCursor,
} from "@fluid-internal/tree";

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

export type IProxyTableProps = IInspectorTableProps;

const toTableRows = ({ data: forest }: Partial<IInspectorRowData>, props: any,
    _options?: Partial<IToTableRowsOptions>, _pathPrefix?: string,
): IInspectorRowData[] => {
    const rootId = props.documentId;
    if (!forest) {
        return [];
    }
    const reader: ITreeCursor = forest.allocateCursor();
    const result = forest.tryGet(forest.root(forest.rootField), reader);
    const trees = forest.getRoot(forest.rootField);
    if (result === TreeNavigationResult.Ok && trees?.length) {
        return getDataFromCursor(reader, [], props.readOnly, rootId);
    }
    return [];
};

export const getForest = (data) => {
    const forest: ObjectForest = new ObjectForest();
    convertPSetSchema("Test:Person-1.0.0", forest.schema);
    if (data) {
        // Not sure how best to create data from Schema
        // eslint-disable-next-line @typescript-eslint/dot-notation
        window["__proxy"] = getForestProxy(data, forest, 0);
    }
    return forest;
};

const forestTableProps: Partial<IProxyTableProps> = {
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

export const ProxyTable = (props: IProxyTableProps) => {
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
                        case "String":
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
