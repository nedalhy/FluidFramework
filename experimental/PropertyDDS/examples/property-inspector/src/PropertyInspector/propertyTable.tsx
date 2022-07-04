import * as React from "react";

import {
    fetchRegisteredTemplates,
    handlePropertyDataCreation,
    IDataCreationOptions,
    IInspectorRow,
    IInspectorTableProps,
    InspectorTable,
    nameCellRenderer,
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
    columnsRenderers: {
        name: nameCellRenderer,
    },
};

export type IPropertyTableProps = IInspectorTableProps;

export const PropertyTable = (props: IPropertyTableProps) => {
    return <InspectorTable {...propertyTableProps} {...props} />;
};
