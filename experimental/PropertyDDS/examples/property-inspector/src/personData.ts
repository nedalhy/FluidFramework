/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import {
	StoredSchemaRepository, JsonableTree, getEditableTree,
	brand, defaultSchemaPolicy, TreeSchemaIdentifier, EditableTree, SharedTree, singleTextCursor, IEditableForest, DetachedField, FieldKey, rootFieldKey, SchemaData, FieldKinds,
	// JsonCursor, jsonableTreeFromCursor, ITreeCursor, SchemaData,
} from "@fluid-internal/tree";
import { convertPSetSchema } from "@fluid-experimental/schemas";

export const person: JsonableTree = {
	type: brand("Test:Person-1.0.0"),
	fields: {
		name: [{ value: "Adam", type: brand("String") }],
		age: [{ value: 35, type: brand("Int32") }],
		salary: [{ value: 10420.2, type: brand("Float32") }],
		isSingle: [{ value: false, type: brand("Bool") }],
		friends: [{
			// value: {
			// 	Mat: "Mat",
			// },
			type: brand("Map<String>"),
		}],
		address: [{
			fields: {
				street: [{ value: "treeStreet", type: brand("String") }],
				zip: [{ type: brand("String") }],
				coords: [{
					type: brand("array<Float32>"),
					fields: {
						entries: [
							{ type: brand("Float32"), value: 239831482.15 },
							{ type: brand("Float32"), value: 488319484.12 },
						],
					},
				}],
			},
			type: brand("Test:Address-1.0.0"),
		}],
	},
};



export function buildProxy(tree: SharedTree, data: JsonableTree, useSchema?: boolean): EditableTree {
	const rootType: TreeSchemaIdentifier = brand("Test:Person-1.0.0");
	// if (useSchema) {
	const rootPersonSchema = {
		kind: FieldKinds.sequence.identifier,
		types: new Set([rootType]),
	};

	convertPSetSchema(rootType, tree.forest.schema);
	tree.forest.schema.updateFieldSchema(rootFieldKey, rootPersonSchema);
	// }

	// let [context, proxy] = getEditableTree(tree.forest as IEditableForest);

	// // If empty
	if (tree.forest.roots.get("0").length === 0) {
	// 	context.free();
		console.info("Initializing person data.");
		tree.runTransaction((forest, editor) => {
			editor.insert({
				parent: undefined,
				parentField: forest.rootField,
				parentIndex: 0,
			}, singleTextCursor(data));
			return 1;
		});
	}
	// context.free();
	const [context, proxy] = getEditableTree(tree.forest as IEditableForest);
	// const json = { address: { street: "new" }, name: "John" };
	// const schemaCursor = new SchemaCursor(json, schema, rootType);
	// const treeData = jsonableTreeFromCursor(schemaCursor);
	// initializeForest(forest, [treeData]);

	// const jsonCursor = new JsonCursor({ address: { street: "new" } });
	// const _data = jsonableTreeFromCursor(jsonCursor);
	// initializeForest(forest, [_data]);
	console.log(proxy);
	return proxy[0];
}
