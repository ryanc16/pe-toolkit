import { Resource } from "./resource";

export class Manifest extends Resource {

    constructor(data: Uint8Array) {
        super(data, '.xml');
    }

    public export(): string {
        return String.fromCharCode.apply(null, this.data as any as number[]);
    }
}
