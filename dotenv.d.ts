declare namespace NodeJS {
	interface ProcessEnv {
		WINDOWS_USERNAME: string;
		WINDOWS_PASSWORD: string;
		WINDOWS_HOST: string;
		DARWIN_USERNAME: string;
		DARWIN_PASSWORD: string;
		DARWIN_HOST: string;
		NAS_USERNAME: string;
		NAS_PASSWORD: string;
		NAS_HOST: string;
		NAS_PORT: string;
	}
}
