/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import { schemas as SQUARES_DEMO_SCHEMAS } from "./squares_demo";
import * as PERSON_DEMO_SCEHMAS from "./person_demo";

export { registerSchemas } from "./schemasRegisterer";

export { SQUARES_DEMO_SCHEMAS, PERSON_DEMO_SCEHMAS };

export const ALL_SCHEMAS = {
    SQUARES_DEMO_SCHEMAS,
    ...PERSON_DEMO_SCEHMAS,
};
