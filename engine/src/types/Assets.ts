export interface AssetManifest {
    basePath: string;
    images?: Record<string, Record<string, string>>;
    audio?: Record<string, Record<string, string>>;
    video?: Record<string, Record<string, string>>;
    spine?: Record<string, string[]>;
}
