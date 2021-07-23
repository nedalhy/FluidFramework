/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * @fileoverview
 * The ValidationResultBuilder maintains validation context that ultimately gets returned as a
 * single result.
 */

 declare interface Result {
    isValid: boolean;
    errors: Error[];
    warnings: string[];
    resolvedTypes: string[];
    unresolvedTypes: string[];
    typeid?: string;
}

export class ValidationResultBuilder {
    private readonly _result: Result;

    /**
     * Instantiates a ValidationResultBuilder
     * @param in_typeid A template typeid.
     */
    constructor(in_typeid: string) {
        this._result = {
            isValid: true,
            errors: [],
            warnings: [],
            resolvedTypes: [],
            unresolvedTypes: [],
        };

        if (in_typeid) {
            this._result.typeid = in_typeid;
        }
    }

    /**
     * Fetches the validation result. Example: {
     *   isValid: false,
     *   errors: ['Something went wrong. Validation failed.'],
     *   warnings: ['A non-fatal warning'],
     *   typeid: 'SomeNamespace:PointID-1.0.0'
     * }
     */
    public get result() {
        return this._result;
    }

    /**
     * Add a validation error.
     * @param in_error An Error instance.
     */
    public addError(in_error: Error) {
        this._result.isValid = false;
        // remove empty error messages before logging.
        if (in_error.message) {
            this._result.errors.push(in_error);
        }
    }

    /**
     * Add a validation warning.
     * @param in_msg A warning description.
     */
    public addWarning(in_msg: string) {
        this._result.warnings.push(in_msg);
    }

    /**
     * Fetches the boolean validation result.
     * @return True if validation produced no error, false otherwise. Warnings don't affect
     *   this value.
     */
    public isValid(): boolean {
        return this._result.isValid;
    };
}
