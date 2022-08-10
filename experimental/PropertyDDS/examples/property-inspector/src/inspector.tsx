/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState } from "react";
import ReactDOM from "react-dom";

import _ from "lodash";
import {
    ModalManager,
    ModalRoot,
} from "@fluid-experimental/property-inspector-table";

import { makeStyles } from "@material-ui/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";

import AutoSizer from "react-virtualized-auto-sizer";

import { Box, Tabs, Tab } from "@material-ui/core";
import ReactJson from "react-json-view";

import { brand, JsonableTree } from "@fluid-internal/tree";

import { theme } from "./theme";
import { PropertyTable } from "./propertyInspector/propertyTable";
import { loadPropertyDDS } from "./propertyInspector/propertyData";
import { JsonTable } from "./jsonInspector/jsonTable";
// import { ForestTable, getForest } from "./forestInspector/forestTable";
import { ProxyTable, getForestProxy } from "./forestInspector/proxyTable";
import { ProplikeTable } from "./forestInspector/proplikeTable";

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
    defaultColor: {
        color: "#808080",
    },
    enumColor: {
        color: "#EC4A41",
        flex: "none",
    },
    numberColor: {
        color: "#32BCAD",
    },
    referenceColor: {
        color: "#6784A6",
    },
    stringColor: {
        color: "#0696D7",
        height: "25px",
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

const customData: any = {
    test1: "John Doe",
    test2: 12,
    test3: true,
    test4: false,
    newProp: 100,
    test5: {
        test5: "hello booboo",
    },
    test6: [1, 2, "daba dee", ["a", "b", 3, 4, { foo: { bar: "buz" } }]],
    // Maps are not supported
    mapTest: new Map([["a", "b"], ["valA", "valB"]]),
    // Sets are not supported
    setTest: new Set([1, 2, 3]),
    nested: {
        test9: {
            strThing: "lolo",
        },
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
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (children)}
      </div>
    );
}

const customTypeData: JsonableTree = {
    type: brand("Test:Person-1.0.0"),
    fields: {
        name: [
            { value: "Adam", type: brand("String") },
        ],
        address: [{
            fields: {
                street: [{ value: "treeStreet", type: brand("String") }],
            },
            type: brand("Test:Address-1.0.0"),
         }],
    },
};

export const InspectorApp = (props: any) => {
    const classes = useStyles();
    const [json, setJson] = useState(customData);
    // const [forest, setForest] = useState(getForest(customData));
    const forestProxy = getForestProxy(customTypeData, props.renderer);
    const [tabIndex, setTabIndex] = useState(0);

    const onJsonEdit = ({ updated_src }) => {
        setJson(updated_src);
        // setForest(getForest(updated_src));
    };

    return (
        <MuiThemeProvider theme={theme}>
            <ModalManager>
                <ModalRoot />
                <div className={classes.root}>
                    <div className={classes.horizontalContainer}>
                        <div className={classes.tableContainer}>
                        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
                                <Box sx={{ display: "flex", flexDirection: "column", width: "75%" }}>
                                    <Tabs value={tabIndex} onChange={(event, newTabIndex) => setTabIndex(newTabIndex)}>
                                        <Tab label="Proplike Proxy" id="tab-proplikeProxy"/>
                                        <Tab label="Forest Proxy" id="tab-proxyForest"/>
                                        <Tab label="JSON Cursor" id="tab-jsonCursor"/>
                                        <Tab label="PropertyDDS" id="tab-propertyDDS"/>
                                    </Tabs>
                                    <AutoSizer>
                                    {
                                        ({ width, height }) =>
                                            <Box sx={{ display: "flex" }}>
                                                <TabPanel value={tabIndex} index={3}>
                                                    <PropertyTable
                                                        // readOnly={true}
                                                        width={width}
                                                        height={height}
                                                        {...props}
                                                    />
                                                </TabPanel>
                                                <TabPanel value={tabIndex} index={2}>
                                                    <JsonTable
                                                        readOnly={false}
                                                        width={width}
                                                        height={height}
                                                        {...props}
                                                        data={json}
                                                    />
                                                </TabPanel>
                                                <TabPanel value={tabIndex} index={0}>
                                                    <ProplikeTable
                                                        readOnly={false}
                                                        width={width}
                                                        height={height}
                                                        {...props}
                                                        data={forestProxy}
                                                    />
                                                </TabPanel>
                                                <TabPanel value={tabIndex} index={1}>
                                                    <ProxyTable
                                                        readOnly={false}
                                                        width={width}
                                                        height={height}
                                                        {...props}
                                                        data={forestProxy}
                                                    />
                                                </TabPanel>
                                            </Box>
                                    }
                                    </AutoSizer>
                                </Box>
                                <Box className={classes.editor}>
                                    <ReactJson src={json} onEdit={onJsonEdit}/>
                                </Box>
                            </Box>
                    </div>
                </div>
            </div>
        </ModalManager>
        </MuiThemeProvider >);
};

export async function renderApp(element: HTMLElement, documentId: string, shouldCreateNew?: boolean, data?: any) {
    const render = async (newData: any) => renderApp(element, documentId, false, newData);
    const propertyDDS = data || await loadPropertyDDS({
        documentId,
        shouldCreateNew,
        render,
    });
    ReactDOM.render(<InspectorApp data={propertyDDS} documentId={documentId} renderer={render}/>, element);
}
