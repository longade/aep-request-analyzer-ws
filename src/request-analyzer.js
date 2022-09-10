const getEventType = (eventType) => {

    const type = {
        pageView: 'web.webpagedetails.pageViews',
        customLink: 'web.webinteraction.linkClicks'
    }

    let callType;
    if (eventType === type.pageView) {
        callType = 'Page View';
    }
    else if (eventType === type.customLink) {
        callType = 'Custom Link';
    }
    return callType || 'Unknown';
}

const getEVars = (analytics) => {
    return Object.fromEntries(Object.entries(analytics.customDimensions.eVars).filter(([key, value]) => value));
}

const getHierarchies = (analytics) => {
    const hierarchies = analytics.customDimensions.hierarchies;
    let finalHierarchies = {};
    for (const [k, v] of Object.entries(hierarchies)) {
        const newHier = { [k]: { ...v, values: [...v.values].join(';') } }
        finalHierarchies = { ...finalHierarchies, ...newHier }
    }
    return finalHierarchies;
}

const getLists = (analytics) => {
    return Object.entries(analytics.customDimensions.lists)
        .filter(([key, value]) => value.list.length > 0)
        .map(([key, value]) => ({ name: key, values: value.list.map(el => el.value) }));
}

const getProps = (analytics) => {
    return Object.fromEntries(Object.entries(analytics.customDimensions.props).filter(([key, value]) => value));
}

const getSession = (analytics) => {
    const webPageDetails = analytics.session.web.webPageDetails;
    const webInteraction = analytics.session.web.webInteraction;
    return {
        webInteraction: { ...webInteraction },
        webPageDetails: { ...webPageDetails }
    }
}

const getEvents = (analytics) => {
    const allEvents = Object.fromEntries(Object.entries(analytics).filter(([key, value]) => key.startsWith('event')));
    let events = {};
    for (const event in allEvents) {
        events = { ...events, ...allEvents[event] };
    }
    return Object.fromEntries(Object.entries(events).filter(([key, value]) => value.value === 1));
}

const getProducts = (products) => {
    const finalProducts = [];
    products.forEach(product => {
        const finalProduct = {
            SKU: product.SKU,
            currencyCode: product.currencyCode,
            name: product.name,
            priceTotal: product.priceTotal,
            quantity: product.quantity
        }
        finalProducts.push(finalProduct);
    })
    return finalProducts;
}

const analyzeRequest = (request) => {
    const requestBody = request;
    const xdm = requestBody?.events?.[0]?.xdm;
    const eventType = xdm?.eventType;
    const analytics = xdm?._experience?.analytics;
    if (!analytics) {
        return null;
    }
    const productsListItems = xdm.productListItems || [];

    let callType;
    if (eventType) {
        callType = getEventType(eventType);
    }

    const dimensions = {
        eVars: getEVars(analytics),
        hierarchies: getHierarchies(analytics),
        lists: getLists(analytics),
        props: getProps(analytics),
        session: getSession(analytics)
    }

    const events = getEvents(analytics);

    const products = getProducts(productsListItems);

    return {
        callType,
        dimensions,
        events,
        products
    }
}

module.exports = analyzeRequest;