import { Interpolation } from 'emotion';

export function createStyles<T extends { [key: string]: Interpolation; }>(obj: T): { [key in keyof T]: Interpolation; } {
    return obj;
}
