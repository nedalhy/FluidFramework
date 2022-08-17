import { strict as assert } from "assert";
import { TypeIdHelper } from "@fluid-experimental/property-changeset";
import { PropertyFactory } from "@fluid-experimental/property-properties";
import {
	FieldSchema, JsonableTree,
	jsonString, JsonCursor,
	FieldKind, brand, TreeSchemaIdentifier, jsonNumber, jsonBoolean, jsonNull,
	jsonArray, TreeSchema, FieldMap, PlaceholderTree, StoredSchemaRepository, SchemaRepository,
} from "@fluid-internal/tree";
import { Jsonable } from "@fluidframework/datastore-definitions";
import { convertPSetSchema } from "../src/schemaConverter";

const createJsonableTreeFromFieldSchema = (field: FieldSchema, cursor: JsonCursor<Jsonable>): PlaceholderTree => {
	let output: PlaceholderTree;
	switch (cursor.type) {
		case jsonString.name:
		case jsonNumber.name:
		case jsonBoolean.name:
		// Do we need to support Null?
		case jsonNull.name: {
			const [type] = field.types!;
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

const createJsonableTree = (repository: SchemaRepository, type: string, data: any) => {
	let output: JsonableTree;
	const schema: TreeSchema = repository.treeSchema.get(brand(type))!;
	// @TODO if schema is not defined should throw an exception
	const cursor = new JsonCursor(data);
	const localFields = schema.localFields;
	const localFieldsKeys = localFields.keys();
	const fields: FieldMap<PlaceholderTree> = {};
	for (const key of localFieldsKeys) {
		const field = localFields.get(key)!;
		const [type] = field.types!;
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
		type: brand(type),
	};

	return output;
};

describe("Primitives", () => {
	const testCases = {
		String: "TestString",
		Int32: 10,
		Bool: true,
	};
	Object.keys(testCases).forEach((testType) => {
		describe(testType, () => {
			let type: string;
			let field: FieldSchema;

			beforeEach(() => {
				type = testType;
				field = {
					kind: FieldKind.Value,
					types: new Set<TreeSchemaIdentifier>([brand(type)]),
				};
			});

			it("Should be able to generate a jsonable", () => {
				const cursor = new JsonCursor(testCases[testType]);
				const jsonable = createJsonableTreeFromFieldSchema(field, cursor);
				expect(jsonable.type).toEqual(type);
				expect(jsonable.value).toEqual(cursor.value);
			});
		});
	});
});

describe("Json of primitives", () => {
	type TestCase = Record<string, { value: Jsonable; type: string; expected: JsonableTree; }>;

	const repository = new StoredSchemaRepository();

	PropertyFactory.register({
		typeid: "test:primitives-1.0.0",
		properties: [
			{
				id: "stringTest",
				typeid: "String",
			},
			{
				id: "intTest",
				typeid: "Int32",
			},
			{
				id: "boolTest",
				typeid: "Bool",
			},
		],
	});
    convertPSetSchema("test:primitives-1.0.0", repository);

	const testCases: TestCase = {
		json_primitives: {
			value: {
				stringTest: "Test",
				intTest: 1,
				boolTest: true,
			},
			expected: {
				fields: {
					stringTest: [{ value: "Test", type: brand("String") }],
					intTest: [{ value: 1, type: brand("Int32") }],
					boolTest: [{ value: true, type: brand("Bool") }],
				},
				type: brand("test:primitives-1.0.0"),
			},
			type: "test:primitives-1.0.0",
		},
	};
	Object.keys(testCases).forEach((testType) => {
		const test = testCases[testType];

		describe(testType, () => {
			it("Should be able to generate a jsonable", () => {
				const jsonable = createJsonableTree(repository, test.type, test.value);
				assert.deepEqual(jsonable, test.expected);
			});
		});
	});
});
