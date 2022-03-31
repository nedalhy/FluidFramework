/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-validator in @fluidframework/build-tools.
 */
/* eslint-disable max-lines */
import * as old from "@fluidframework/shared-object-base-previous";
import * as current from "../../index";

type TypeOnly<T> = {
    [P in keyof T]: TypeOnly<T[P]>;
};

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "FunctionDeclaration_createSingleBlobSummary": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_createSingleBlobSummary():
    TypeOnly<typeof old.createSingleBlobSummary>;
declare function use_current_FunctionDeclaration_createSingleBlobSummary(
    use: TypeOnly<typeof current.createSingleBlobSummary>);
use_current_FunctionDeclaration_createSingleBlobSummary(
    get_old_FunctionDeclaration_createSingleBlobSummary());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "FunctionDeclaration_createSingleBlobSummary": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_createSingleBlobSummary():
    TypeOnly<typeof current.createSingleBlobSummary>;
declare function use_old_FunctionDeclaration_createSingleBlobSummary(
    use: TypeOnly<typeof old.createSingleBlobSummary>);
use_old_FunctionDeclaration_createSingleBlobSummary(
    get_current_FunctionDeclaration_createSingleBlobSummary());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "ClassDeclaration_FluidSerializer": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_FluidSerializer():
    TypeOnly<old.FluidSerializer>;
declare function use_current_ClassDeclaration_FluidSerializer(
    use: TypeOnly<current.FluidSerializer>);
use_current_ClassDeclaration_FluidSerializer(
    get_old_ClassDeclaration_FluidSerializer());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "ClassDeclaration_FluidSerializer": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_FluidSerializer():
    TypeOnly<current.FluidSerializer>;
declare function use_old_ClassDeclaration_FluidSerializer(
    use: TypeOnly<old.FluidSerializer>);
use_old_ClassDeclaration_FluidSerializer(
    get_current_ClassDeclaration_FluidSerializer());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "InterfaceDeclaration_IFluidSerializer": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IFluidSerializer():
    TypeOnly<old.IFluidSerializer>;
declare function use_current_InterfaceDeclaration_IFluidSerializer(
    use: TypeOnly<current.IFluidSerializer>);
use_current_InterfaceDeclaration_IFluidSerializer(
    get_old_InterfaceDeclaration_IFluidSerializer());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "InterfaceDeclaration_IFluidSerializer": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IFluidSerializer():
    TypeOnly<current.IFluidSerializer>;
declare function use_old_InterfaceDeclaration_IFluidSerializer(
    use: TypeOnly<old.IFluidSerializer>);
use_old_InterfaceDeclaration_IFluidSerializer(
    get_current_InterfaceDeclaration_IFluidSerializer());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "InterfaceDeclaration_ISerializedHandle": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ISerializedHandle():
    TypeOnly<old.ISerializedHandle>;
declare function use_current_InterfaceDeclaration_ISerializedHandle(
    use: TypeOnly<current.ISerializedHandle>);
use_current_InterfaceDeclaration_ISerializedHandle(
    get_old_InterfaceDeclaration_ISerializedHandle());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "InterfaceDeclaration_ISerializedHandle": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ISerializedHandle():
    TypeOnly<current.ISerializedHandle>;
declare function use_old_InterfaceDeclaration_ISerializedHandle(
    use: TypeOnly<old.ISerializedHandle>);
use_old_InterfaceDeclaration_ISerializedHandle(
    get_current_InterfaceDeclaration_ISerializedHandle());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "InterfaceDeclaration_ISharedObject": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ISharedObject():
    TypeOnly<old.ISharedObject>;
declare function use_current_InterfaceDeclaration_ISharedObject(
    use: TypeOnly<current.ISharedObject>);
use_current_InterfaceDeclaration_ISharedObject(
    get_old_InterfaceDeclaration_ISharedObject());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "InterfaceDeclaration_ISharedObject": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ISharedObject():
    TypeOnly<current.ISharedObject>;
declare function use_old_InterfaceDeclaration_ISharedObject(
    use: TypeOnly<old.ISharedObject>);
use_old_InterfaceDeclaration_ISharedObject(
    get_current_InterfaceDeclaration_ISharedObject());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "InterfaceDeclaration_ISharedObjectEvents": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ISharedObjectEvents():
    TypeOnly<old.ISharedObjectEvents>;
declare function use_current_InterfaceDeclaration_ISharedObjectEvents(
    use: TypeOnly<current.ISharedObjectEvents>);
use_current_InterfaceDeclaration_ISharedObjectEvents(
    get_old_InterfaceDeclaration_ISharedObjectEvents());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "InterfaceDeclaration_ISharedObjectEvents": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ISharedObjectEvents():
    TypeOnly<current.ISharedObjectEvents>;
declare function use_old_InterfaceDeclaration_ISharedObjectEvents(
    use: TypeOnly<old.ISharedObjectEvents>);
use_old_InterfaceDeclaration_ISharedObjectEvents(
    get_current_InterfaceDeclaration_ISharedObjectEvents());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "VariableDeclaration_isSerializedHandle": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_isSerializedHandle():
    TypeOnly<typeof old.isSerializedHandle>;
declare function use_current_VariableDeclaration_isSerializedHandle(
    use: TypeOnly<typeof current.isSerializedHandle>);
use_current_VariableDeclaration_isSerializedHandle(
    get_old_VariableDeclaration_isSerializedHandle());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "VariableDeclaration_isSerializedHandle": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_isSerializedHandle():
    TypeOnly<typeof current.isSerializedHandle>;
declare function use_old_VariableDeclaration_isSerializedHandle(
    use: TypeOnly<typeof old.isSerializedHandle>);
use_old_VariableDeclaration_isSerializedHandle(
    get_current_VariableDeclaration_isSerializedHandle());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "FunctionDeclaration_makeHandlesSerializable": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_makeHandlesSerializable():
    TypeOnly<typeof old.makeHandlesSerializable>;
declare function use_current_FunctionDeclaration_makeHandlesSerializable(
    use: TypeOnly<typeof current.makeHandlesSerializable>);
use_current_FunctionDeclaration_makeHandlesSerializable(
    get_old_FunctionDeclaration_makeHandlesSerializable());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "FunctionDeclaration_makeHandlesSerializable": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_makeHandlesSerializable():
    TypeOnly<typeof current.makeHandlesSerializable>;
declare function use_old_FunctionDeclaration_makeHandlesSerializable(
    use: TypeOnly<typeof old.makeHandlesSerializable>);
use_old_FunctionDeclaration_makeHandlesSerializable(
    get_current_FunctionDeclaration_makeHandlesSerializable());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "FunctionDeclaration_parseHandles": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_parseHandles():
    TypeOnly<typeof old.parseHandles>;
declare function use_current_FunctionDeclaration_parseHandles(
    use: TypeOnly<typeof current.parseHandles>);
use_current_FunctionDeclaration_parseHandles(
    get_old_FunctionDeclaration_parseHandles());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "FunctionDeclaration_parseHandles": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_parseHandles():
    TypeOnly<typeof current.parseHandles>;
declare function use_old_FunctionDeclaration_parseHandles(
    use: TypeOnly<typeof old.parseHandles>);
use_old_FunctionDeclaration_parseHandles(
    get_current_FunctionDeclaration_parseHandles());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "FunctionDeclaration_serializeHandles": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_serializeHandles():
    TypeOnly<typeof old.serializeHandles>;
declare function use_current_FunctionDeclaration_serializeHandles(
    use: TypeOnly<typeof current.serializeHandles>);
use_current_FunctionDeclaration_serializeHandles(
    get_old_FunctionDeclaration_serializeHandles());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "FunctionDeclaration_serializeHandles": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_serializeHandles():
    TypeOnly<typeof current.serializeHandles>;
declare function use_old_FunctionDeclaration_serializeHandles(
    use: TypeOnly<typeof old.serializeHandles>);
use_old_FunctionDeclaration_serializeHandles(
    get_current_FunctionDeclaration_serializeHandles());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "ClassDeclaration_SharedObject": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_SharedObject():
    TypeOnly<old.SharedObject>;
declare function use_current_ClassDeclaration_SharedObject(
    use: TypeOnly<current.SharedObject>);
use_current_ClassDeclaration_SharedObject(
    get_old_ClassDeclaration_SharedObject());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "ClassDeclaration_SharedObject": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_SharedObject():
    TypeOnly<current.SharedObject>;
declare function use_old_ClassDeclaration_SharedObject(
    use: TypeOnly<old.SharedObject>);
use_old_ClassDeclaration_SharedObject(
    get_current_ClassDeclaration_SharedObject());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "ClassDeclaration_SharedObjectCore": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_SharedObjectCore():
    TypeOnly<old.SharedObjectCore>;
declare function use_current_ClassDeclaration_SharedObjectCore(
    use: TypeOnly<current.SharedObjectCore>);
use_current_ClassDeclaration_SharedObjectCore(
    get_old_ClassDeclaration_SharedObjectCore());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "ClassDeclaration_SharedObjectCore": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_SharedObjectCore():
    TypeOnly<current.SharedObjectCore>;
declare function use_old_ClassDeclaration_SharedObjectCore(
    use: TypeOnly<old.SharedObjectCore>);
use_old_ClassDeclaration_SharedObjectCore(
    get_current_ClassDeclaration_SharedObjectCore());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "ClassDeclaration_SummarySerializer": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_SummarySerializer():
    TypeOnly<old.SummarySerializer>;
declare function use_current_ClassDeclaration_SummarySerializer(
    use: TypeOnly<current.SummarySerializer>);
use_current_ClassDeclaration_SummarySerializer(
    get_old_ClassDeclaration_SummarySerializer());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "ClassDeclaration_SummarySerializer": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_SummarySerializer():
    TypeOnly<current.SummarySerializer>;
declare function use_old_ClassDeclaration_SummarySerializer(
    use: TypeOnly<old.SummarySerializer>);
use_old_ClassDeclaration_SummarySerializer(
    get_current_ClassDeclaration_SummarySerializer());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "EnumDeclaration_ValueType": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_ValueType():
    TypeOnly<old.ValueType>;
declare function use_current_EnumDeclaration_ValueType(
    use: TypeOnly<current.ValueType>);
use_current_EnumDeclaration_ValueType(
    get_old_EnumDeclaration_ValueType());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "EnumDeclaration_ValueType": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_ValueType():
    TypeOnly<current.ValueType>;
declare function use_old_EnumDeclaration_ValueType(
    use: TypeOnly<old.ValueType>);
use_old_EnumDeclaration_ValueType(
    get_current_EnumDeclaration_ValueType());