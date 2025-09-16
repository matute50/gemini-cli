const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs').promises;
const { parseString } = require('xml2js');

const app = express();
const PORT = 3000;

const VMIX_API_URL = 'http://192.168.10.197:8088/api';
const SEQUENCES_DIR = path.join(__dirname, 'sequences');

// --- Middleware ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// --- Inicialización ---
const init = async () => {
    try {
        await fs.access(SEQUENCES_DIR);
    } catch (error) {
        console.log('Creando directorio principal de secuencias...');
        await fs.mkdir(SEQUENCES_DIR);
    }
};
init();

// --- Comandos PTZ ---
const PTZ_COMMANDS = {
    'up': 'PTZMoveUp', 'down': 'PTZMoveDown', 'left': 'PTZMoveLeft', 'right': 'PTZMoveRight',
    'stop': 'PTZMoveStop', 'home': 'PTZHome', 'zoom-in': 'PTZZoomIn', 'zoom-out': 'PTZZoomOut', 'zoom-stop': 'PTZZoomStop'
};

// --- Función Auxiliar para vMix ---
const sendVmixCommand = async (functionName, inputKey, value = null) => {
    if (!functionName || !inputKey) {
        return console.error('Error: functionName e inputKey son requeridos para enviar un comando a vMix.');
    }
    try {
        let url = `${VMIX_API_URL}?Function=${functionName}&Input=${inputKey}`;
        if (value !== null) url += `&Value=${value}`;
        
        console.log(`Enviando comando a vMix: ${url}`);
        await axios.get(url);
    } catch (error) {
        console.error(`Error al contactar la API de vMix: ${error.message}`);
    }
};

// --- Funciones Auxiliares para Secuencias ---
const sanitize = (name) => name.replace(/[^a-z0-9_-]/gi, '_');

module.exports = { sanitize };

const getCameraSequencePath = (inputId, sequenceName = '') => {
    const sanitizedInput = sanitize(inputId);
    const sanitizedSequenceName = sequenceName ? sanitize(sequenceName) + '.json' : '';
    return path.join(SEQUENCES_DIR, sanitizedInput, sanitizedSequenceName);
};

// --- Endpoints para GESTIÓN DE SECUENCIAS ---

app.get('/api/sequences', async (req, res) => {
    const { inputId } = req.query;
    if (!inputId) return res.status(400).send({ message: 'Se requiere inputId.' });

    const cameraDir = getCameraSequencePath(inputId);
    try {
        await fs.access(cameraDir);
        const files = await fs.readdir(cameraDir);
        const jsonFiles = files.filter(file => file.endsWith('.json')).map(file => file.replace('.json', ''));
        res.status(200).json(jsonFiles);
    } catch (error) {
        if (error.code === 'ENOENT') return res.status(200).json([]); // Directorio no existe, devuelve lista vacía
        console.error('Error al listar secuencias:', error);
        res.status(500).send({ message: 'Error al leer el directorio de secuencias.' });
    }
});

app.get('/api/sequences/:name', async (req, res) => {
    const { name } = req.params;
    const { inputId } = req.query;
    if (!inputId) return res.status(400).send({ message: 'Se requiere inputId.' });

    const filePath = getCameraSequencePath(inputId, name);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        res.status(200).json(JSON.parse(data));
    } catch (error) {
        console.error(`Error al cargar la secuencia '${name}':`, error);
        res.status(404).send({ message: `No se encontró la secuencia '${name}'.` });
    }
});

app.post('/api/sequences/:name', async (req, res) => {
    const { name } = req.params;
    const { sequence, inputId } = req.body;
    if (!sequence || !inputId) return res.status(400).send({ message: 'Faltan datos (sequence, inputId).' });

    const cameraDir = getCameraSequencePath(inputId);
    const filePath = getCameraSequencePath(inputId, name);

    try {
        await fs.mkdir(cameraDir, { recursive: true }); // Asegura que el directorio exista
        await fs.writeFile(filePath, JSON.stringify(sequence, null, 2));
        console.log(`Secuencia guardada en '${filePath}'`);
        res.status(200).send({ message: `Secuencia guardada como '${name}'.` });
    } catch (error) {
        console.error(`Error al guardar la secuencia '${name}':`, error);
        res.status(500).send({ message: 'Error al guardar el archivo.' });
    }
});

app.delete('/api/sequences/:name', async (req, res) => {
    const { name } = req.params;
    const { inputId } = req.query;
    if (!inputId) return res.status(400).send({ message: 'Se requiere inputId.' });

    const filePath = getCameraSequencePath(inputId, name);
    try {
        await fs.unlink(filePath);
        console.log(`Secuencia eliminada: '${filePath}'`);
        res.status(200).send({ message: `Secuencia '${name}' eliminada.` });
    } catch (error) {
        if (error.code === 'ENOENT') return res.status(404).send({ message: `No se encontró la secuencia '${name}'.` });
        console.error(`Error al eliminar la secuencia '${name}':`, error);
        res.status(500).send({ message: 'Error al eliminar el archivo.' });
    }
});

// --- Endpoint de ESTADO DE CÁMARAS ---

app.get('/api/cameras/status', async (req, res) => {
    const { cameraInputs } = req.query; // Espera 'cam1=input1&cam2=input2'
    if (!cameraInputs) {
        return res.status(400).send({ message: 'Se requieren los inputs de las cámaras.' });
    }

    try {
        const vmixResponse = await axios.get(VMIX_API_URL);
        const xmlResult = await new Promise((resolve, reject) => {
            parseString(vmixResponse.data, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const activeInputs = new Set(xmlResult.vmix.inputs[0].input.map(i => i.$.title));
        const status = {};
        for (const camId in cameraInputs) {
            const inputName = cameraInputs[camId];
            status[camId] = activeInputs.has(inputName) ? 'online' : 'offline';
        }
        
        console.log('Estado de cámaras verificado:', status);
        res.status(200).json(status);

    } catch (error) {
        console.error('Error al verificar el estado de las cámaras:', error.message);
        // Si hay un error al contactar vMix, asumimos que todas están offline.
        const status = {};
        for (const camId in cameraInputs) {
            status[camId] = 'offline';
        }
        res.status(500).json(status);
    }
});

// --- Endpoints de CONTROL PTZ ---

app.post('/api/ptz', async (req, res) => {
    const { command, inputId } = req.body;
    const functionName = PTZ_COMMANDS[command];
    if (!functionName || !inputId) return res.status(400).send({ message: 'Comando o inputId no válidos.' });

    await sendVmixCommand(functionName, inputId);
    res.status(200).send({ message: `Comando '${command}' ejecutado.` });
});

app.post('/api/ptz/create-snapshot', async (req, res) => {
    const { inputId } = req.body;
    if (!inputId) return res.status(400).send({ message: 'Se requiere inputId.' });

    await sendVmixCommand('PTZCreateVirtualInput', inputId);
    res.status(200).send({ message: 'Comando PTZCreateVirtualInput enviado.' });
});

app.get('/api/ptz/last-created-input', async (req, res) => {
    try {
        const vmixResponse = await axios.get(VMIX_API_URL);
        parseString(vmixResponse.data, (err, result) => {
            if (err) return res.status(500).send({ message: 'Error al procesar la respuesta de vMix.' });
            
            const allInputs = result.vmix.inputs[0].input;
            if (!allInputs || allInputs.length === 0) return res.status(404).send({ message: 'No se encontraron inputs.' });
            
            // ADVERTENCIA: Se asume que el último input en el XML es el recién creado.
            // Esto podría fallar en escenarios con mucha concurrencia.
            const lastInput = allInputs[allInputs.length - 1];
            const info = { key: lastInput.$.key, title: lastInput.$.title, number: parseInt(lastInput.$.number, 10) };

            console.log(`Último input detectado: ${info.title} (Key: ${info.key})`);
            res.status(200).json(info);
        });
    } catch (error) {
        console.error('Error al obtener el XML de vMix:', error.message);
        res.status(500).send({ message: 'Error al contactar la API de vMix.' });
    }
});

app.post('/api/ptz/remove-inputs', async (req, res) => {
    const { keys } = req.body;
    if (!keys || !Array.isArray(keys)) return res.status(400).send({ message: 'Se requiere un array de \'keys\'.' });

    console.log(`Recibida petición para eliminar ${keys.length} inputs...`);
    for (const key of keys) {
        // Para eliminar, no se necesita el inputId de la cámara, solo la key del virtual input.
        await sendVmixCommand('RemoveInput', key);
        await new Promise(r => setTimeout(r, 50));
    }
    console.log('Limpieza de inputs completada.');
    res.status(200).send({ message: 'Inputs eliminados.' });
});

// Endpoint para funciones genéricas (usado por la reproducción para moverse a una posición)
app.get('/api/ptz/function', async (req, res) => {
    const { name, input, duration } = req.query;
    if (!name || !input) return res.status(400).send({ message: 'Parámetros \"name\" e \"input\" son requeridos.' });

    let url = `${VMIX_API_URL}?Function=${name}&Input=${input}`;
    if (duration) url += `&Duration=${duration}`;

    try {
        console.log(`Ejecutando función genérica: ${url}`);
        await axios.get(url);
        res.status(200).send({ message: 'Comando ejecutado.' });
    } catch (error) {
        console.error(`Error al ejecutar la función '${name}':`, error.message);
        res.status(500).send({ message: 'Error al contactar la API de vMix.' });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}