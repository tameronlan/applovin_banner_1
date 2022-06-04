let vendorPrefixesCache = {};

export default function getVendorPrefix(prop) {
    if (vendorPrefixesCache[prop]) {
        return vendorPrefixesCache[prop];
    }

    let vendorPrefixes = ['Moz','Webkit','Khtml','O','ms'];
    let style          = document.createElement('div').style;
    let upper          = prop.charAt(0).toUpperCase() + prop.slice(1);
    let pref, len      = vendorPrefixes.length;

    if(prop in style) {
        return vendorPrefixesCache[prop] = '';
    }

    while (len--) {
        if ((vendorPrefixes[len] + upper) in style) {
            pref = vendorPrefixes[len];
        }
    }

    if (pref) {
        return vendorPrefixesCache[prop] = '-' + pref.toLowerCase() + '-';
    }

    if (prop in style) {
        return vendorPrefixesCache[prop] = '';
    }
}
