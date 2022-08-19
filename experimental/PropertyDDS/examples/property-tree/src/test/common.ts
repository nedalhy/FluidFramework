import { emptyField, neverTree, StoredSchemaRepository } from "@fluid-internal/tree";

export const getSchemaRepository = () => {
	return new StoredSchemaRepository({
		defaultTreeSchema: neverTree,
		defaultGlobalFieldSchema: emptyField,
	});
};
