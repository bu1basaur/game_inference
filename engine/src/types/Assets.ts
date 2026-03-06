export interface AssetManifest {
    basePath: string;
    images?: {
        root?: Record<string, string>;
        [category: string]: Record<string, string> | undefined;
    };
    audio?: {
        root?: Record<string, string>;
        [category: string]: Record<string, string> | undefined;
    };
    spine?: {
        basePath?: string;
        [category: string]: string[] | string | undefined;
    };
}
