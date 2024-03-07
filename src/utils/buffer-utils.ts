export namespace BufferUtils {
    export function readUint8(buffer: Uint8Array, offset: number): number {
        return buffer[offset];
    }
    export function readUint16(buffer: Uint8Array, offset: number, le: boolean = true): number {
        return le === true ? (buffer[offset + 1] << 8) + buffer[offset] : (buffer[offset] << 8) + buffer[offset + 1];
    }
}
