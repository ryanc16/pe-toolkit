export class Optional<T> {
    constructor(private value: T) {
    }

    public static of<T>(value: T): Optional<T> {
        return new Optional<T>(value);
    }

    public static empty<T>(): Optional<T> {
        return new Optional<T>(null as any);
    }

    public get(): T | null {
        return this.value;
    }

    public getOrElse(elseValue: T): T {
        if (this.value != null) {
            return this.value;
        } else {
            return elseValue;
        }
    }

    public getOrElseSupply(elseSupplier: () => T): T {
        if (this.value != null) {
            return this.value;
        } else {
            return elseSupplier();
        }
    }

    public getOrElseThrow(e?: Error | string): T {
        if (this.value != null) {
            return this.value;
        } else {
            if (e == null) {
                throw new Error("optional value is undefined");
            } else if (e instanceof Error) {
                throw e;
            } else {
                throw new Error(e);
            }
        }
    }
}
