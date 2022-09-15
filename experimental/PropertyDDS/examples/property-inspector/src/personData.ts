/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import {
	JsonableTree, brand, TreeSchemaIdentifier, FieldKinds, ISharedTree, GlobalFieldKey, FieldSchema,
} from "@fluid-internal/tree";
import { convertPSetSchema } from "@fluid-experimental/schemas";

export const person: JsonableTree = {
	type: brand("Test:Person-1.0.0"),
	fields: {
		name: [{ value: "Adam", type: brand("String") }],
		age: [{ value: 35, type: brand("Int32") }],
		salary: [{ value: 10420.2, type: brand("Float32") }],
		isSingle: [{ value: false, type: brand("Bool") }],
		// friends: [{
		// 	// value: {
		// 	// 	Mat: "Mat",
		// 	// },
		// 	type: brand("Map<String>"),
		// }],
		address: [{
			fields: {
				street: [{ value: "treeStreet", type: brand("String") }],
				zip: [{ type: brand("String"), value: "" }],
				// coords: [{
				// 	type: brand("array<Float32>"),
				// 	fields: {
				// 		entries: [
				// 			{ type: brand("Float32"), value: 239831482.15 },
				// 			{ type: brand("Float32"), value: 488319484.12 },
				// 		],
				// 	},
				// }],
			},
			type: brand("Test:Address-1.0.0"),
		}],
	},
};

export function registerSchemas(tree: ISharedTree) {
	const rootType: TreeSchemaIdentifier = brand("Test:Person-1.0.0");
	const rootPersonSchema: FieldSchema = {
		kind: FieldKinds.value.identifier as any,
		types: new Set([rootType]),
	};

	convertPSetSchema(rootType, tree.forest.schema);
	tree.forest.schema.updateFieldSchema(tree.forest.rootField as unknown as GlobalFieldKey, rootPersonSchema);
}
