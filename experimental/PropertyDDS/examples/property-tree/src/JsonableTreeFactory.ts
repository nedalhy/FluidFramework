import { TypeIdHelper } from "@fluid-experimental/property-changeset";
import {
	FieldSchema, JsonableTree,
	jsonString, JsonCursor, brand, jsonNumber, jsonBoolean, jsonNull,
	jsonArray, TreeSchema, FieldMap, PlaceholderTree, StoredSchemaRepository
} from "@fluid-internal/tree";
import { Jsonable } from "@fluidframework/datastore-definitions";

export const createJsonableTreeFromFieldSchema =
	(field: FieldSchema, cursor: JsonCursor<Jsonable>): PlaceholderTree => {
		let output: PlaceholderTree;
		switch (cursor.type) {
			case jsonString.name:
			case jsonNumber.name:
			case jsonBoolean.name:
			// Do we need to support Null?
			case jsonNull.name: {
				const [type] = field.types ?? [];
				output = {
					value: cursor.value,
					type,
				};
				break;
			}
			default: {
				output = {
					type: brand("Empty"),
				};
			}
		}
		return output;
	};

export const createJsonableTree = (repository: StoredSchemaRepository, schemaType: string, data: any) => {
	let output: JsonableTree;
	const schema: TreeSchema | undefined = repository.treeSchema.get(brand(schemaType));
	if (!schema) {
		throw new Error("Couldn't find the schema.");
	}
	const cursor = new JsonCursor(data);
	const localFields = schema.localFields;
	const localFieldsKeys = localFields.keys();
	const fields: FieldMap<PlaceholderTree> = {};
	for (const key of localFieldsKeys) {
		const field = localFields.get(key);
		if (!field) {
			throw new Error(`The field "${key}", couldn't be found in the schema`);
		}
		const [type] = field.types ?? [];
		// For now focusing on PropertySet use case but perhaps we should generalize it.
		if (TypeIdHelper.isPrimitiveType(type)) {
			cursor.down(key, 0);
			fields[key] = [createJsonableTreeFromFieldSchema(field, cursor)];
			cursor.up();
			continue;
		}
		switch (cursor.type) {
			case jsonArray.name: {
				return null;
			}
			default: {
				return null;
			}
		}
	}

	// eslint-disable-next-line prefer-const
	output = {
		fields,
		type: brand(schemaType),
	};

	return output;
};
