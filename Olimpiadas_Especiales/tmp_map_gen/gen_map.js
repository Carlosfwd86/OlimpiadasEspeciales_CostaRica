const fs = require('fs');
const d3 = require('d3-geo');
const https = require('https');

function main() {
    const url = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/costa_rica.geojson';
    https.get(url, (res) => {
        let body = "";
        res.on("data", (chunk) => {
            body += chunk;
        });
        res.on("end", () => {
            try {
                let geo = JSON.parse(body);
                const projection = d3.geoMercator().fitSize([600, 600], geo);
                const pathGenerator = d3.geoPath().projection(projection);
                let output = geo.features.map(f => {
                    return {
                        name: f.properties.name || f.properties.NAME_1 || f.properties.NOMB_PROV || 'Unknown',
                        path: pathGenerator(f)
                    };
                });
                fs.writeFileSync('cr_paths.json', JSON.stringify(output, null, 2));
                console.log("Successfully generated cr_paths.json!");
            } catch (error) {
                console.error("Error parsing/generating:", error.message);
            }
        });
    }).on("error", (error) => {
        console.error("Error fetching data:", error.message);
    });
}
main();
