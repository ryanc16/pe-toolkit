export abstract class Resource {
    protected ext: string

    constructor(protected data: Uint8Array, ext?: string) {
        this.ext = ext ?? '.json';
    }

    public getData(): Uint8Array {
        return this.data;
    }

    public getExtension(): string {
        return this.ext;
    }

    public abstract export(): any;
}
