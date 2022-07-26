/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import * as React from "react";

import {
    fetchRegisteredTemplates,
    handlePropertyDataCreation,
    IDataCreationOptions,
    IInspectorRow,
    IInspectorTableProps,
    InspectorTable,
    fillExpanded,
    nameCellRenderer,
    valueCellRenderer,
    typeCellRenderer,
    toTableRows,
    generateForm,
    addDataForm,
    expandAll,
    getDefaultInspectorTableIcons,
    EditReferenceView,
} from "@fluid-experimental/property-inspector-table";

export const handleDataCreationOptionGeneration = (rowData: IInspectorRow, nameOnly: boolean): IDataCreationOptions => {
    if (nameOnly) {
        return { name: "property" };
    }
    const templates = fetchRegisteredTemplates();
    return { name: "property", options: templates };
};

export const propertyTableProps: Partial<IInspectorTableProps> = {
    columns: ["name", "value", "type"],
    expandColumnKey: "name",
    width: 1000,
    height: 600,
    dataCreationHandler: handlePropertyDataCreation,
    dataCreationOptionGenerationHandler: handleDataCreationOptionGeneration,
    fillExpanded,
    toTableRows,
    expandAll,
    generateForm,
    rowIconRenderer: getDefaultInspectorTableIcons,
    addDataForm,
    editReferenceView: (props) => {
        return <EditReferenceView { ...props } />;
    },
    columnsRenderers: {
        name: nameCellRenderer,
        value: valueCellRenderer,
        type: typeCellRenderer,
    },
};

export type IPropertyTableProps = IInspectorTableProps;

export const PropertyTable = (props: IPropertyTableProps) => {
    return <InspectorTable {...propertyTableProps} {...props} />;
};
