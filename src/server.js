const express = require('express');
const Yeelight = require('node-yeelight');

let BULB = null;                                        // aqui será instanciada a lâmpada (caso seja encontrada)

const y = new Yeelight;

y.on('ready', () => y.discover());                      // inicia a busca pelas lâmpadas

y.on('deviceadded', (device) => y.connect(device));     // encontrou uma lâmpada, inicia a conexão

y.on('deviceconnected', (device) => {                   // conectou com a lâmpada

    console.log('Lâmpada encontrada!');

    y.setPower(device, true, 300);                      // liga a lâmpada
    y.setBrightness(device, 100, 300);                  // seta o brilho emm 100%
    y.setRGB(device, [ 255, 0, 0 ], 300);               // seta a cor em vermelho

    BULB = device;

});

y.listen();                                             // inicia o socket do yeelight

const app = express();

app.use(express.json());

app.post('/color', (req, res) => {

    const { R, G, B } = req.body;

    if(!BULB) {
        return res.status(404).send('Lâmpada não encontada.');
    }

    y.setRGB(BULB, [ R, G, B ], 300);

    return res.send();
    
});

app.listen(3000, () => console.log('Server listening on por 3000.'));