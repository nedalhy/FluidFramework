/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { PropertyFactory } from "@fluid-experimental/property-properties";
import { registerSchemas } from "@fluid-experimental/schemas";

import { convertPSetSchema } from "../schemaConverter";
import { getSchemaRepository } from "./common";

describe("Schema Conversion", () => {
    it("Should convert a simple schema", () => {
        const repository = getSchemaRepository();

        registerSchemas(PropertyFactory);

        convertPSetSchema("Test:Person-1.0.0", repository);

        // TODO: How do I best check whether the generated schema is correct?
    });
});

// const pointSchema = {
//     typeid: "point2d-1.0.0",
//     properties: [
//         {id : "x", "Float32"},
//         {id : "y", "Float32"},
//         {id: "children", context: "array", typeid: "point2d-1.0.0"}

//     ]
// }

// const dataPontPset = {
//     x: 15.5,
//     y: 16.9,
//     children: [{
//         typeid: "special-point2d-1.0.0",
//         x: 1,
//         y: 2,
//         color: 'red'
//     }]
// }

// PropertyFactory.create('point2d-1.0.0', null, dataPontPset)

// person.addresses.push({ street: "hi", post: "2313"})

// const dataPoint = {   
//     fields: {
//         x: [value: "15.5", type: "Float32"],
//         x: [value: "16.9",  type: "Float32"]
//     }
// }