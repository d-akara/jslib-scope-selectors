import {makeScopeSelectors, a, t} from './scope-selectors'

// Create a proxy that will auto scope by hierarchy
const selectors = makeScopeSelectors({
    "home_page": {
        "title": ".title",
        "go_button": ".go-buton",
        "feed_section": {
            "__scope": ".feeds",  // This query scope will be prepended to all other selectors at this level or descendants
            "item_name": ".item",
            "item_size": ".item-size",
            "type": a`red`,       // This is a template for selecting anchors by text using XPath.  Note XPath is literal and does not combine with CSS scoped selectors
            "details": {
                "__scope": ".details",
                "productId": ".product-id"
            }
        },
        "related_articles": {
            "publisher": ".publisher"
        }
    },
    "about_page": {
        "contact": ".contact"
    }
})

// Example, get query selectors for items in the feed section of our page
let scope = selectors.home_page.feed_section
console.log(scope.item_name === '.feeds .item')  // CSS selectors are scoped by hierarchy prepending any defined __scope values in our JSON object
console.log(scope.item_size === '.feeds .item-size')
console.log(scope.details.productId === '.feeds .details .product-id')
console.log(scope.type === `//a[text()='red']` ) // XPath selectors are literal as they can't be combined with CSS selectors

let scope2 = selectors.home_page.related_articles
console.log(scope2.publisher === '.publisher')
