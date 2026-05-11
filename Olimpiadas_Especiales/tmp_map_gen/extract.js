const costaRica = require('@svg-maps/costa-rica');
const fs = require('fs');

const viewBox = costaRica.viewBox;

const output = costaRica.locations.map(loc => {
    return {
        name: loc.name,
        path: loc.path
    };
});

fs.writeFileSync('cr_official_paths.json', JSON.stringify({
    viewBox: viewBox,
    paths: output
}, null, 2));

console.log("Paths generated in cr_official_paths.json");
