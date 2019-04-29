export function makeScopeSelectors<T extends object>(selectors:T, scopeKey = '__scope', scopes:string[] = []):T {
    const object = selectors as any
    if (object[scopeKey]) {scopes.push(object[scopeKey])}

    const selectorsProxy = new Proxy(selectors, {
        get: (target:any, key) => {
            const propertyValue = target[key]
            const isString = typeof propertyValue === 'string'

            if (key === scopeKey) {return propertyValue}
            if (propertyValue instanceof Object) {return makeScopeSelectors(propertyValue, scopeKey ,scopes)}

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

/**
 * Make XPath anchor selector for a link matching link text
 * @param strings 
 */
export function a(strings:TemplateStringsArray) {
    return `//a[text()='${strings}']`
}

/**
 * Make XPath element selector for element containing text
 * @param strings 
 */
export function t(strings:TemplateStringsArray) {
    return `//*[text()='${strings}']`
}