type EnvFunction = (key: string) => string | object | undefined;
type EnvObject = Record<string, string | object | undefined>;
type Env = EnvFunction | EnvObject;
type ParsedToken =
	| string
	| { op: string }
	| { comment: string }
	| { op: 'glob'; pattern: string };

export {
	type EnvFunction,
	type EnvObject,
	type Env,
	type ParsedToken
};
