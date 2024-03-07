export namespace HexUtils {

    export function uintArrayToHex(arr: Uint8Array | Uint16Array | Uint32Array | BigUint64Array): string[] {
        const out: string[] = []
        for (let i = 0; i < arr.length; i++) {
            out.push(arr[i].toString(16));
        }
        let padding = 0;
        if (arr instanceof Uint8Array) {
            padding = 2;
        } else if (arr instanceof Uint16Array) {
            padding = 4
        } else if (arr instanceof Uint32Array) {
            padding = 6;
        } else if (arr instanceof BigUint64Array) {
            padding = 8;
        }
        return out.map(v => v.padStart(padding, "0"));
    }
}
