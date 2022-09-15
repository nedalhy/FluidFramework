/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { SharedPropertyTree } from "@fluid-experimental/property-dds";
import { PropertyFactory } from "@fluid-experimental/property-properties";
import { registerSchemas } from "@fluid-experimental/schemas";
import { SharedTreeFactory } from "@fluid-internal/tree";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import { IChannelFactory } from "@fluidframework/datastore-definitions";
import { renderApp } from "./inspector";

class MySharedTree {
    public static getFactory(): IChannelFactory {
        return new SharedTreeFactory();
    }

    onDisconnect() { }
}

// In interacting with the service, we need to be explicit about whether we're creating a new document vs. loading
// an existing one.  We also need to provide the unique ID for the document we are loading from.

// In this app, we'll choose to create a new document when navigating directly to http://localhost:8080.
// We'll also choose to interpret the URL hash as an existing document's
// ID to load from, so the URL for a document load will look something like http://localhost:8080/#1596520748752.
// These policy choices are arbitrary for demo purposes, and can be changed however you'd like.
async function start(): Promise<void> {
    // Register all schemas.
    // It's important to register schemas before loading an existing document
    // in order to process the changeset.
    registerSchemas(PropertyFactory);

    // when the document ID is not provided, create a new one.
    const shouldCreateNew = location.hash.length === 0;
    const documentId = !shouldCreateNew ? window.location.hash.substring(1) : "";

    const client = new TinyliciousClient({
        // connection: {
        //     type: "local",
        //     endpoint: "http://localhost:7070",
        //     tokenProvider: new InsecureTinyliciousTokenProvider(),
        // },
    });

    let res;
    let containerId;
    let container;
    if (!documentId) {
     res = await client.createContainer({
            initialObjects: {
                propertyTree: SharedPropertyTree as any,
                editableTree: MySharedTree as any,
            },
        });
    container = res.container;
    containerId = await container.attach();
    } else {
        res = await client.getContainer(documentId, {
            initialObjects: {
                propertyTree: SharedPropertyTree as any,
                editableTree: MySharedTree as any,
            },
        });
        container = res.container;
        containerId = documentId;
    }

    // update the browser URL and the window title with the actual container ID
    location.hash = containerId;
    document.title = containerId;

    renderApp(container, document.getElementById("root")!);
}

start().catch((error) => console.error(error));
