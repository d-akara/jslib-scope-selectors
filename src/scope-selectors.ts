export function makeScopeSelectors<T extends object>(selectors:T, scopeKey = '__scope', scopes:string[] = []):T {
    const object = selectors as any
    if (object[scopeKey]) {scopes.push(object[scopeKey])}

    const selectorsProxy = new Proxy(selectors, {
        get: (target:any, key) => {
            const propertyValue = target[key]
            const isString = typeof propertyValue === 'string'

            if (key === scopeKey) {return propertyValue}
            if (propertyValue instanceof Object) {return makeScopeSelectors(propertyValue, scopeKey ,scopes.slice())}

            if (isString) {
                const isXPath = (propertyValue as string).startsWith('//')
                if (isXPath) return propertyValue

                const scopeValues = scopes.slice()
                scopeValues.push(propertyValue)
                return scopeValues.join(' ')
            }
        }
    })
    return selectorsProxy
}

function standardStringInterpolation(literals:TemplateStringsArray, ...expressions: string[]) {
    let string = ''
    for (const [index, value] of expressions.entries()) {
        string += literals[index] + value
    }

    string += literals[literals.length - 1]
    return string
}

/**
 * Make XPath anchor selector for a link matching link text
 * @param strings 
 */
export function a(strings:TemplateStringsArray, ...expressions: string[]) {
    const string = standardStringInterpolation(strings, ...expressions)
    return `//a[text()='${string}']`
}

/**
 * Make XPath element selector for element containing text
 * @param strings 
 */
export function t(strings:TemplateStringsArray, ...expressions: string[]) {
    const string = standardStringInterpolation(strings, ...expressions)
    return `//*[text()='${string}']`
}