/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import _ from "lodash";
import { proxyTargetSymbol, getTypeSymbol, UnwrappedEditableTree, Value, isPrimitive } from "@fluid-internal/tree";
import {
    IDataCreationOptions,
    IInspectorTableProps,
    InspectorTable,
    ModalManager,
    ModalRoot,
    fetchRegisteredTemplates,
    handlePropertyDataCreation,
    IToTableRowsProps,
    IToTableRowsOptions,
    nameCellRenderer,
    typeCellRenderer,
    defaultValueCellRenderer,
    NewDataForm,
    getShortId,
    IRowData,
} from "@fluid-experimental/property-inspector-table";

import { Tabs, Tab } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";

import { PropertyProxy } from "@fluid-experimental/property-proxy";

import { DataBinder } from "@fluid-experimental/property-binder";
import AutoSizer from "react-virtualized-auto-sizer";

import { theme } from "./theme";

const useStyles = makeStyles({
    activeGraph: {
        "flex-basis": "100%",
        "z-index": 1,
    },
    horizontalContainer: {
        display: "flex",
        flex: "1",
    },
    inspectorContainer: {
        "display": "flex",
        "flex-basis": "100%",
        "padding-left": "1px",
    },
    root: {
        "display": "flex",
        "flex-direction": "column",
        "font-family": "ArtifaktElement, Helvetica, Arial",
        "height": "100%",
        "justify-content": "flex-start",
        "overflow": "hidden",
    },
    sideNavContainer: {
        display: "flex",
    },
    verticalContainer: {
        "display": "flex",
        "flex-basis": "100%",
        "flex-direction": "column",
        "justify-content": "space-between",
    },
    tableContainer: {
        display: "flex",
        height: "100%",
        width: "100%",
    },
}, { name: "InspectorApp" });

interface PropertyRow<T = UnwrappedEditableTree> extends IRowData<T> {
    context?: string;
    typeid: string;
    isReference?: boolean;
    parent?: T;
    value: Value;
    name: string;
}

export const handleDataCreationOptionGeneration = (rowData: PropertyRow, nameOnly: boolean):
    IDataCreationOptions => {
    if (nameOnly) {
        return { name: "property" };
    }
    const templates = fetchRegisteredTemplates();
    return { name: "property", options: templates };
};

const tableProps: Partial<IInspectorTableProps> = {
    columns: ["name", "value", "type"],
    dataCreationHandler: handlePropertyDataCreation,
    dataCreationOptionGenerationHandler: handleDataCreationOptionGeneration,
    expandColumnKey: "name",
    width: 1000,
    height: 600,
};

const getChildren = (data, pathPrefix?: string): IInspectorRow[] => {
    const rows: IInspectorRow[] = [];
    if (data === undefined) {
        return rows;
    }
    for (const key of Object.keys(data)) {
        const { value, type } = data[key];
        if (value !== undefined) {
            const row: IInspectorRow = {
                id: `${pathPrefix}/${key}`,
                name: key,
                context: "single",
                children: [],
                isReference: false,
                value,
                typeid: type || "",
                parent: data,
            };
            rows.push(row);
        } else if (editableTreeProxySymbol in data[key] && Object.keys(data[key]).length) {
            const row: IInspectorRow = {
                id: `${pathPrefix}/${key}`,
                name: key,
                context: "single",
                children: getChildren(data[key], `${pathPrefix}/${key}`),
                isReference: false,
                typeid: type || "",
                parent: data,
            };
            rows.push(row);
        }
    }
    return rows;
};

const jsonTableProps: Partial<IInspectorTableProps> = {
    ...tableProps,
    toTableRows: (
        {
            data, id = "",
        }: IInspectorRow,
        props: IToTableRowsProps,
        options: Partial<IToTableRowsOptions> = {},
        pathPrefix: string = "",
    ): IInspectorRow[] => {
        const rows: IInspectorRow[] = [];
        if (data === undefined) {
            return rows;
        }
        const root: IInspectorRow = {
            name: "root",
            id: "root",
            context: "single",
            typeid: data.type || "",
        };
        root.children = getChildren(data, root.id);
        rows.push(root);
        return rows;
    },
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        {...other}
      >
        {value === index && (children)}
      </div>
    );
}

export const InspectorApp = (props: any) => {
    const classes = useStyles();
    const [json, setJson] = useState(person);
    const [tabIndex, setTabIndex] = useState(0);

    const { dataBinder, editableTree } = inspectorProps;

    const editableForestProxy = buildProxy(editableTree, json, true);

    const onJsonEdit = ({ updated_src }) => {
        setJson(updated_src);
    };

    const traverse = (jsonObj, pathPrefix = "", expanded) => {
        expanded[getShortId(pathPrefix)] = true;
        for (const key of Object.keys(jsonObj)) {
            const { value } = jsonObj[key];
            if (value !== undefined) {
                expanded[getShortId(pathPrefix, key)] = true;
            } else if (editableTreeProxySymbol in jsonObj[key] && Object.keys(jsonObj[key]).length) {
                traverse(jsonObj[key], `${pathPrefix}/${key}`, expanded);
            }
        }
    };

    const jsonTableProps: Partial<IInspectorTableProps> = {
        ...tableProps,
        expandAll: (data) => {
            const expanded = {};
            traverse(data, "root", expanded);
            return expanded;
        },
        fillExpanded: () => { },
        generateForm: () => true,
        dataCreationHandler: async (_rowData, name: string, typeid: string, context: string) => {
            console.log(`Creating a property with the these values: ${name}, ${typeid}, ${context}`);
        },
        addDataForm: ({ handleCancelCreate, handleCreateData, rowData, options, styleClass }) => (
            <div className={styleClass}>
                <NewDataForm
                    onCancelCreate={handleCancelCreate}
                    onDataCreate={handleCreateData}
                    options={options}
                    rowData={rowData}
                    hasId={(_rowData, id) => Object.keys(rowData.parent).indexOf(id) !== -1}
                    getParentType={() => rowData.parent.type as string}
                    getParentContext={() => "single"} // @TODO
                />
            </div>
        ),
        columnsRenderers: {
            name: nameCellRenderer,
            value: defaultValueCellRenderer({
                onSubmit: (_val, props) => {
                    // const { rowData } = props;
                    // @TODO enable this line when EditableTree allow edits
                    // rowData.parent[rowData.name] = val;
                    // json[rowData.id] = val;
                    // setJson({ ...json });
                    console.log(_val, props);
                },
            }),
            type: typeCellRenderer,
        },
        toTableRows: (
            {
                data, id = "",
            }: PropertyRow,
            props: IToTableRowsProps,
            options: Partial<IToTableRowsOptions> = {},
            pathPrefix: string = "",
        ): PropertyRow[] => {
            const rows: PropertyRow[] = [];
            if (data === undefined || Object.keys(data).length === 0) {
                return rows;
            }
            const root: PropertyRow = {
                name: "root",
                id: getShortId("root"),
                context: "single",
                typeid: data[getTypeSymbol]().name || "",
                value: undefined,
            };
            root.children = getChildren(data, "root");
            rows.push(root);
            return rows;
        },
    };
    return (
        <MuiThemeProvider theme={theme}>
            <ModalManager>
                <ModalRoot />
                <div className={classes.root}>
                    <div className={classes.horizontalContainer}>
                        <div className={classes.editor}>
                            <ReactJson src={json} onEdit={onJsonEdit} />
                        </div>
                        <div className={classes.verticalContainer}>
                            <Tabs value={tabIndex} onChange={(event, newTabIndex) => setTabIndex(newTabIndex)}>
                                <Tab label="Editable Tree" id="tab-json" />
                                <Tab label="PropertyDDS" id="tab-propertyDDS" />
                            </Tabs>
                            <div className={classes.tableContainer}>
                                <AutoSizer>
                                    {
                                        ({ width, height }) =>
                                            <div className={classes.horizontalContainer}>
                                                <TabPanel value={tabIndex} index={1}>
                                                    <MyInspectorTable
                                                        width={width}
                                                        height={height}
                                                        dataBinder={dataBinder}
                                                        {...inspectorProps}
                                                    />
                                                </TabPanel>
                                                <TabPanel value={tabIndex} index={0}>
                                                    <InspectorTable
                                                        readOnly={false}
                                                        {...jsonTableProps}
                                                        width={width}
                                                        height={height}
                                                        {...inspectorProps}
                                                        data={editableForestProxy}
                                                    />
                                                </TabPanel>
                                            </div>
                                    }
                                </AutoSizer>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalManager>
        </MuiThemeProvider>);
};

export function renderApp(container: any, element: HTMLElement) {
    const { propertyTree, editableTree } = container.initialObjects;

    const dataBinder = new DataBinder();

    dataBinder.attachTo(propertyTree);

    ReactDOM.render(<InspectorApp dataBinder={dataBinder} editableTree={editableTree} />, element);
}
