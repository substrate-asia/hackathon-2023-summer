export function optionsMap(options: { value: string | number; label: string }[]) {
    return new Map(options.map(item => [item.value, item.label]));
}

export function others() {}
