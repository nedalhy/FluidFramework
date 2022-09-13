/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import _ from "lodash";
import {
    getEditableTree, getTypeSymbol, ISharedTree, isPrimitive,
    SimpleObservingDependent, singleTextCursor, UnwrappedEditableTree, Value
} from "@fluid-internal/tree";
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

import { Tabs, Tab, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";

import { PropertyProxy } from "@fluid-experimental/property-proxy";

import { DataBinder } from "@fluid-experimental/property-binder";
import AutoSizer from "react-virtualized-auto-sizer";

import { initData, person } from "./personData";

import { theme } from "./theme";
\
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
    editor: {
        container: {
            width: "100%",
        },
        body: {
            width: undefined,
            display: "flex",
        },
        outerBox: {
            width: "100%",
        },
        contentBox: {
            width: undefined,
            flex: 1,
        },
        warningBox: {
            width: "100%",
        },
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

const getChildren = (data, pathPrefix: string, addDataRow = true): PropertyRow[] => {
    const rows: PropertyRow[] = [];
    if (data === undefined) {
        return rows;
    }

    for (const key of Object.keys(data)) {
        const schema = data[getTypeSymbol](key);
        const type = schema.name;
        let value = data[key];
        if (isPrimitive(schema) || type === "String") {
            // // Strings are special case, its represented as sequence
            // if (type === "String") {
            //     value = value.entries.join("");
            // }

            const row: PropertyRow = {
                id: getShortId(pathPrefix, key),
                name: key,
                context: "single",
                children: undefined,
                isReference: false,
                value,
                typeid: type || "",
                parent: data,
            };
            rows.push(row);
        } else {
            const row: PropertyRow = {
                id: getShortId(pathPrefix, key),
                name: key,
                context: "single",
                children: getChildren(data[key], `${pathPrefix}/${key}`, true),
                isReference: false,
                typeid: type || "",
                parent: data,
                value: undefined,
            };
            rows.push(row);
        }
    }
    if (addDataRow) {
        rows.push({
            id: `${pathPrefix}/Add`,
            isNewDataRow: true,
            parent: data,
            value: "",
            typeid: "",
            name: "",
        });
    }
    return rows;
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

const MyInspectorTable = (props: any) => {
    const [proxifiedDDS, setProxifiedDDS] = useState<any>(undefined);

    const { dataBinder } = props;


    useEffect(() => {
        // Listening to any change the root path of the PropertyDDS, and rendering the latest state of the
        // inspector tree-table.
        dataBinder.registerOnPath("/", ["insert", "remove", "modify"], _.debounce(() => {
            // Create an ES6 proxy for the DDS, this enables JS object interface for interacting with the DDS.
            // Note: This is what currently inspector table expect for "data" prop.
            setProxifiedDDS(PropertyProxy.proxify(dataBinder.getPropertyTree().root));
        }, 20));
    }, [dataBinder]);


    return (<InspectorTable
        {...tableProps}
        {...props}
        data={proxifiedDDS}
    />);
}

export const InspectorApp = (inspectorProps: any) => {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = useState(0);
    const [proxyData, setProxyData] = useState([]);
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);



    const { dataBinder } = inspectorProps;
    const [context, editableForestProxy] = proxyData;

    useEffect(() => {
        const forest = (inspectorProps.editableTree as ISharedTree).forest;
        const dependent = new SimpleObservingDependent(() => {
            if (context) {
                context.prepareForEdit();
            }
            forest.currentCursors.clear();
        });

        if (forest.roots.get(forest.rootField).length !== 0) {
            const data = getEditableTree(inspectorProps.editableTree);
            setProxyData(() => data);
        }
        forest.registerDependent(dependent);

        return () => forest.removeDependent(dependent);
    }, []);

    const traverse = (jsonObj, pathPrefix = "", expanded) => {
        expanded[getShortId(pathPrefix)] = true;
        for (const key of Object.keys(jsonObj)) {
            const { value } = jsonObj[key];
            if (value !== undefined) {
                expanded[getShortId(pathPrefix, key)] = true;
            } else {
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
                onSubmit: (val, props) => {
                    const { rowData } = props;
                    // @TODO enable this line when EditableTree allow edits
                    rowData.parent[rowData.name] = val;
                    forceUpdate();
                    // json[rowData.id] = val;
                    // setJson({ ...json });
                    // console.log(_val, props);
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
            const type = data[getTypeSymbol](undefined, true);
            const root: PropertyRow = {
                name: "root",
                id: getShortId("root"),
                context: "single",
                typeid: type || "",
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
                                                    <Button aria-label="Add Data" onClick={() => {
                                                        inspectorProps.editableTree.runTransaction((forest, editor) => {
                                                            editor.insert({
                                                                parent: undefined,
                                                                parentField: inspectorProps.editableTree.forest.rootField,
                                                                parentIndex: 0,
                                                            }, singleTextCursor(person));
                                                            return 1;
                                                        });
                                                    }} />
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

    // For testing with initial data;
    initData(editableTree, true);

    const dataBinder = new DataBinder();

    dataBinder.attachTo(propertyTree);

    ReactDOM.render(<InspectorApp dataBinder={dataBinder} editableTree={editableTree} />, element);
}
