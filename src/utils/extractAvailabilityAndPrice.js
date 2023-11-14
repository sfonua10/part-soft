function extractAvailabilityAndPrice(str) {
    const regex = /([a-zA-Z])\s*([yY](es)?|[nN]o?)?(\d+(\.\d{0,2})?)?/;
    const match = str.match(regex);
  
    if (match) {
        const code = match[1];
        const availability = match[2] || (match[4] ? 'yes' : null);
        let price = parseFloat(match[4]);
        if (isNaN(price)) {
            price = null;  // setting to null if it's NaN
        }
        return { code, availability, price };
    }
  
    return { code: null, availability: null, price: null };
}
