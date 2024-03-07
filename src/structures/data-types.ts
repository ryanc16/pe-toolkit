export enum DataSize {
    BYTE = 1,
    WORD = 2,
    DWORD = 4,
    QWORD = 8,
    WCHAR = 2
}

export namespace DataTypes {
    export type BYTE = number;
    export type WORD = number;
    export type DWORD = number;
    export type QWORD = bigint;
    export type WCHAR = number;
    export const BYTE = "number";
    export const WORD = "number";
    export const DWORD = "number";
    export const QWORD = "bigint";
    export const WCHAR = "number";
}

export type ByteString = string;
export type WordString = string;
