import * as url from "url";
import { Loader } from "@fluidframework/container-loader";
import { RouterliciousDocumentServiceFactory } from "@fluidframework/routerlicious-driver";
import {
  IUrlResolver,
  IResolvedUrl,
  IFluidResolvedUrl,
} from "@fluidframework/driver-definitions";
import { ensureFluidResolvedUrl } from "@fluidframework/driver-utils";
import { IContainer } from "@fluidframework/container-definitions";
import jwt from "jsonwebtoken";

const verifyEnvConfig = () => {
  if (process.env.ID === undefined) { throw Error("Define ID in .env file"); }
  if (process.env.KEY === undefined) { throw Error("Define KEY in .env file"); }
  if (process.env.ORDERER === undefined) { throw Error("Define ORDERER in .env file"); }
  if (process.env.STORAGE === undefined) { throw Error("Define STORAGE in .env file"); }
};

const tenantKey = process.env.KEY!;

const signToken = (documentId: string) => {
  const user = {
    id: "user",
    name: "User",
  };

  const claims = {documentId, scopes: ["doc:read", "doc:write", "summary:write"], tenantId, user,
    iat: Math.round(new Date().getTime() / 1000), exp: Math.round(new Date().getTime() / 1000) + 60 * 60, ver: "1.0",
  };

  const token = jwt.sign(claims, tenantKey);

  return token;
};

const tenantId = process.env.ID;

export async function getFluidRelayContainer(documentId: any,
   containerRuntimeFactory: any, createNew: any): Promise<[IContainer, string]> {
  console.log("Running with R11s backend");

  const ordererEndpoint = process.env.ORDERER;
  const storageEndpoint = process.env.STORAGE;

  const documentUrl = `fluid://${url.parse(ordererEndpoint!).host}/${tenantId}/${documentId}`;
  const deltaStorageUrl = `${ordererEndpoint}/deltas/${tenantId}/${documentId}`;
  const storageUrl = `${storageEndpoint}/repos/${tenantId}`;

  const token = signToken(documentId);

  const cache = {
    token,
  };

  const resolvedUrl: IFluidResolvedUrl = {
    endpoints: {
      deltaStorageUrl,
      ordererUrl: ordererEndpoint!,
      storageUrl,
    },
    id: documentId,
    tokens: { jwt: token },
    type: "fluid",
    url: documentUrl,
  };

  const urlResolver: IUrlResolver = {
    resolve: async () => resolvedUrl,
    getAbsoluteUrl: async (_resolvedUrl: IResolvedUrl, relativeUrl: string): Promise<string> => {
      if (_resolvedUrl.type !== "fluid") {
        throw Error("Invalid Resolved Url");
      }
      return `${_resolvedUrl.url}/${relativeUrl}`;
    },
  };

  const module = {
     module: {fluidExport: containerRuntimeFactory},
     details: { package: "no-dynamic-package", config: {} },
  };
  const codeLoader = { load: async () => module };
  const tokenProvider = {
    fetchOrdererToken: async () => {
      return {
        fromCache: true,
        jwt: cache.token,
      };
    },
    fetchStorageToken: async () => {
      return {
        fromCache: true,
        jwt: cache.token,
      };
    },
    documentPostCreateCallback: async (id: string, creationToken: string) => {
      // Here token can be validated against authorization service.
      console.log(id, creationToken);
    },
  };

  const loader = new Loader({
    urlResolver,
    documentServiceFactory: new RouterliciousDocumentServiceFactory(tokenProvider),
    codeLoader,
  });

  let container;
  let docId;
  if (createNew) {
    try {
      container = await loader.createDetachedContainer({ package: "no-dynamic-package", config: {} });
      await container.attach(
        {
          url: "", headers: {
            createNew: true,
          },
        });
      const resolved = container.resolvedUrl;
      ensureFluidResolvedUrl(resolved);
      docId = resolved.id;
    } catch (e) {
      console.error(e);
      throw e;
    }
  } else {
    container = await loader.resolve({ url: documentId });
    docId = documentId;
  }

  return [container , docId];
}

export function hasFluidRelayEndpoints() {
  try {
    verifyEnvConfig();
    return true;
  } catch {
    return false;
  }
}
