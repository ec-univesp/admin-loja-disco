declare module 'jsvectormap' {
    export interface jsVectorMapOptions {
        [key: string]: unknown;
    }

    export class jsVectorMap {
        constructor(options: jsVectorMapOptions);
    }

    export default jsVectorMap;
}
