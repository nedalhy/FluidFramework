import * as React from "react";

import {
    IInspectorRow,
    IInspectorTableProps,
    InspectorTable,
    IToTableRowsOptions,
    IToTableRowsProps,
    typeidToIconMap,
} from "@fluid-experimental/property-inspector-table";
import { Box, Chip, Switch, TextField, FormLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { TreeType, TreeNavigationResult } from "@fluid-internal/tree";
import { JsonType, JsonCursor } from "../jsonCursor";

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

const mapJsonTypesToStrings = (type: TreeType) => {
    switch (type) {
        case JsonType.Array:
            return "Array";
        case JsonType.String:
            return "String";
        case JsonType.Boolean:
            return "Boolean";
        case JsonType.Number:
            return "Number";
        case JsonType.Null:
            return "Null";
        case JsonType.Object:
            return "Object";
        default:
            return "Unknown Type";
    }
};

function toTableRows({ data, id }: Partial<IInspectorRow>, props: IToTableRowsProps,
    _options?: Partial<IToTableRowsOptions>, _pathPrefix?: string): IInspectorRow[] {
    const res: IInspectorRow[] = [];
    const jsonCursor = new JsonCursor(data);
    for (const key of jsonCursor.keys) {
        const len = jsonCursor.length(key);
        for (let idx = 0; idx < len; idx++) {
            const result = jsonCursor.down(key, idx);
            if (result === TreeNavigationResult.Ok) {
                res.push({
                    id: key as string,
                    name: key as string,
                    value: jsonCursor.value || data[key],
                    type: mapJsonTypesToStrings(jsonCursor.type) as string,
                    children:
                        jsonCursor.type === JsonType.Object || jsonCursor.type === JsonType.Array
                            ? toTableRows({ data: data[key] }, props)
                            : [],
                } as any);
            }
        }
        jsonCursor.up();
    }

    return res;
}

export type IJsonTableProps = IInspectorTableProps;

const jsonTableProps: Partial<IJsonTableProps> = {
    columns: ["name", "value", "type"],
    expandColumnKey: "name",
    toTableRows,
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

export const JsonTable = (props: IJsonTableProps) => {
    const classes = useStyles();

    return <InspectorTable
        {...jsonTableProps}
        columnsRenderers={
            {
                type: ({ rowData }) => {
                    return <Box className={classes.typesBox}>
                        <Chip
                            label={rowData.type}
                            className={classes.typesCell} />
                    </Box>;
                },
                value: ({ rowData, readOnly }) => {
                    const { type, value } = rowData;
                    switch (type) {
                        case "Boolean":
                            return <Switch
                                color="primary"
                                checked={value as boolean}
                                value={rowData.name}
                                disabled={readOnly}
                            />;

                        case "String":
                            return <TextField value={value}
                                disabled={readOnly} type="string" />;
                        case "Number":
                            return <TextField value={value}
                                disabled={readOnly} type="number" />;
                        case "Array":
                            return <FormLabel> {`[${value.length}]`}</FormLabel>;
                        default:
                            return <div> </div>;
                    }
                },
            }
        }
        {...props}
    />;
};
