export function encodeLanguageList() {}
export function decodeLanguageList() {}

export function optionsToString(params: string[], options: { value: string; label: string }[]) {
    const optionsMap = new Map(options.map(item => [item.value, item.label]));
    if (Array.isArray(params) && params.length > 0) {
        return params.map((value: string) => optionsMap.get(value)).join(';');
    }
}
export function optionsToArray(params: string, options: { value: string; label: string }[]) {
    const optionsMap = new Map(options.map(item => [item.label, item.value]));
    if (params.length) {
        return params.split(';').map((label: string) => optionsMap.get(label));
    }
    return [];
}
