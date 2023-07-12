import { CSSInterpolation } from '@emotion/css';

export function createStyles<T extends { [key: string]: CSSInterpolation; }>(obj: T): { [key in keyof T]: CSSInterpolation; } {
    return obj;
}
