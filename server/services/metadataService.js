const cheerio = require('cheerio');

const metadataExtraction = async (url) => {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        throw new Error('Invalid URL');
    }
    const urlMetadata = (new URL(url));
    const domainName = urlMetadata.host;
    const extractFavicon = await fetch(`https://www.google.com/s2/favicons?domain=${domainName}&sz=128`);
    const faviconImage = extractFavicon.url;

    try {
        // fetch html of url
        const response = await fetch(url);
        const html = await response.text();

        // give the html to cheerio
        const parser = cheerio.load(html);

        const metadata = {
            domainName,
            faviconImage,
            thumbnail: parser('meta[property="og:image"]').attr('content') ||
                parser('meta[name="twitter:image"]').attr('content') || ''
        }

        return metadata;
    } catch (err) {
        console.log(err);
        throw new Error('Can not extract metadata');
    }
}

module.exports = { metadataExtraction };