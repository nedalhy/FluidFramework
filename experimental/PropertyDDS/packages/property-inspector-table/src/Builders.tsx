import React from "react";
import { EditableValueCell } from "./EditableValueCell";
import { HashCalculator } from "./HashCalculator";
import { emptyCallback } from "./constants";
import { ColumnRendererType, IEditableValueCellProps, sanitizePath } from ".";

export const renderUneditableCell = (classes, rowData) => (
	<div className={classes.typeIdRow}>
		<div className={classes.typeIdRowLeft}>{rowData.value}</div>
	</div>
);

export function defaultValueCellRenderer(
	props: Partial<IEditableValueCellProps>) {
	return function({
		rowData, cellData, tableProps,
	}: ColumnRendererType) {
		const { followReferences, rowIconRenderer, dataGetter, readOnly, classes } = tableProps;
		if ((cellData && dataGetter && rowData.context) || rowData.isNewDataRow) {
			return cellData;
		} else {
			return rowData.children || rowData.isConstant
				? renderUneditableCell(classes, rowData)
				: (
					<EditableValueCell
						followReferences={followReferences}
						iconRenderer={rowIconRenderer!}
						rowData={rowData}
						readOnly={!!readOnly}
						onSubmit={props.onSubmit || emptyCallback}
						{...props}
					/>
				);
		}
	};
}

export const getShortId = (parentPath: string, childId: string | undefined = undefined, idSeparator = "/"): string => {
	const sanitizer = [
		{ searchFor: /[.[]/g, replaceWith: idSeparator },
		{ searchFor: /]/g, replaceWith: "" },
		{ searchFor: /\/\/+/g, replaceWith: idSeparator },
	];
	const absolutePath = childId !== undefined ?
		parentPath + idSeparator + childId :
		parentPath;
	const hash = new HashCalculator();
	hash.pushString(sanitizePath(absolutePath, sanitizer));

	return hash.getHash();
};
