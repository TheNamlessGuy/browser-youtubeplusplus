const SponsorBlock = {
  _baseURL: 'https://sponsor.ajay.app',

  get: async function(id, types) { // https://wiki.sponsor.ajay.app/w/API_Docs#GET_/api/skipSegments
    const url = new URL(`${SponsorBlock._baseURL}/api/skipSegments`);

    url.searchParams.append('videoID', id);
    for (const type of types) {
      url.searchParams.append('category', type);
    }

    const response = await fetch(url.toString());
    if (!response.ok) { return []; }
    const arr = await response.json();
    return arr.map(x => { return {start: x.segment[0], end: x.segment[1], category: x.category}; }).sort((a, b) => a.start - b.start);
  },
};