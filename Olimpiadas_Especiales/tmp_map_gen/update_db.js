const fs = require('fs');

const svgContent = fs.readFileSync('amcharts_cr.svg', 'utf8');
const dbContent = fs.readFileSync('../db.json', 'utf8');

const getPath = (name) => {
    const regex = new RegExp(`<path d="([^"]+)".*?data-name="${name}"`);
    const match = svgContent.match(regex);
    return match ? match[1] : '';
};

const paths = {
    'Alajuela': getPath('Alajuela'),
    'Cartago': getPath('Cartago'),
    'Guanacaste': getPath('Guanacaste'),
    'Heredia': getPath('Heredia'),
    'Limón': getPath('Limón'),
    'Puntarenas': getPath('Puntarenas'),
    'San José': getPath('San José')
};

let db = JSON.parse(dbContent);

db.mapa = [
    { name: "Guanacaste", path: paths['Guanacaste'] },
    { name: "Alajuela", path: paths['Alajuela'] },
    { name: "Heredia", path: paths['Heredia'] },
    { name: "Limón", path: paths['Limón'] },
    { name: "Puntarenas", path: paths['Puntarenas'] },
    { name: "San José", path: paths['San José'] },
    { name: "Cartago", path: paths['Cartago'] }
];

fs.writeFileSync('../db.json', JSON.stringify(db, null, 2));
console.log("db.json updated successfully with exact paths.");
