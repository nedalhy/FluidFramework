/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { LocalOrdererManager } from "@fluidframework/server-local-server";
import { DocumentStorage } from "@fluidframework/server-services-shared";
import { generateToken, Historian } from "@fluidframework/server-services-client";
import { MongoDatabaseManager, DatabaseManager, IResourcesFactory } from "@fluidframework/server-services-core";
import * as utils from "@fluidframework/server-services-utils";
import { Provider } from "nconf";
import { Server } from "socket.io";

import winston from "winston";
import { TinyliciousResources } from "./resources";
import {
    PubSubPublisher,
    TaskMessageSender,
    TenantManager,
    getDbFactory,
    WebServerFactory,
} from "./services";

const defaultTinyliciousPort = 7070;

export class TinyliciousResourcesFactory implements IResourcesFactory<TinyliciousResources> {
    public async create(config: Provider): Promise<TinyliciousResources> {
        const globalDbEnabled = false;
        // Pull in the default port off the config
        const port = utils.normalizePort(process.env.PORT ?? defaultTinyliciousPort);
        const collectionNames = config.get("mongo:collectionNames");

        const tenantManager = new TenantManager(`http://localhost:${port}`);
        const dbFactory = await getDbFactory(config);

        const taskMessageSender = new TaskMessageSender();
        const databaseManager = new DatabaseManager(dbFactory);
        const mongoDatabaseManager = new MongoDatabaseManager(
            globalDbEnabled,
            databaseManager,
            null,
            collectionNames.nodes,
            collectionNames.documents,
            collectionNames.deltas,
            collectionNames.scribeDeltas);
        const storage = new DocumentStorage(mongoDatabaseManager, tenantManager, false);
        const io = new Server({
            // enable compatibility with socket.io v2 clients
            // https://socket.io/docs/v4/client-installation/
            allowEIO3: true,
        });
        const pubsub = new PubSubPublisher(io);
        const webServerFactory = new WebServerFactory(io);

        const orderManager = new LocalOrdererManager(
            storage,
            databaseManager,
            tenantManager,
            taskMessageSender,
            config.get("foreman:permissions"),
            generateToken,
            async (tenantId: string) => {
                const url = `http://localhost:${port}/repos/${encodeURIComponent(tenantId)}`;
                return new Historian(url, false, false);
            },
            winston,
            undefined /* serviceConfiguration */,
            pubsub);

        return new TinyliciousResources(
            config,
            orderManager,
            tenantManager,
            storage,
            databaseManager,
            port,
            webServerFactory);
    }
}
