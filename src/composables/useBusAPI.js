export async function fetchBusPassagesAPI() {
    const url = 'https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/tco-bus-circulation-passages-tr/records?select=nomcourtligne, destination, arrivee, depart, idcourse, idbus, numerobus&where=idarret=1212 and (idligne="0001" and sens=1 or idligne="0011" and sens=0) and arrivee > now()&order_by=arrivee&limit=20'
    const encodedUrl = encodeURI(url);
    const response = await fetch(encodedUrl);
    if (!response.ok) throw new Error('Erreur lors du chargement des passages de bus');
    return response.json();
}

export async function fetchBusPositionsAPI(busIds) {
    let url = 'https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/tco-bus-vehicules-position-tr/records?select=idbus, coordonnees, ecartsecondes, nomcourtligne&where='
    url += busIds.map((id, index) => {
        if (index === busIds.length - 1) {
            return `idbus="${id}"`;
        }
        return `idbus="${id}" or `;
    }).join('');
    url += '&limit=20';
    const encodedUrl = encodeURI(url);
    const response = await fetch(encodedUrl);
    if (!response.ok) throw new Error('Erreur lors du chargement des positions des bus');
    return response.json();
}




