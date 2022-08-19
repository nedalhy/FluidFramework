/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import { PropertyFactory } from "@fluid-experimental/property-properties";
import {
	FieldSchema, JsonableTree,
	JsonCursor, brand, TreeSchemaIdentifier, FieldKinds,
} from "@fluid-internal/tree";
import { Jsonable } from "@fluidframework/datastore-definitions";
import { convertPSetSchema } from "../schemaConverter";
import { createJsonableTreeFromFieldSchema, createJsonableTree } from "../JsonableTreeFactory";
import { getSchemaRepository } from "./common";

describe("Primitives", () => {
	const testCases: Record<string, any> = {
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
					kind: FieldKinds.value.identifier,
					types: new Set([type as any]),
				};
			});

			it("Should be able to generate a jsonable", () => {
				const cursor = new JsonCursor(testCases[testType]);
				const jsonable = createJsonableTreeFromFieldSchema(field, cursor);
				assert.equal(jsonable.type, type);
				assert.equal(jsonable.value, cursor.value);
			});
		});
	});
});

describe("Json of primitives", () => {
	type TestCase = Record<string, { value: Jsonable; type: string; expected: JsonableTree; }>;

	const repository = getSchemaRepository();

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
