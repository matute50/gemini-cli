document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a Elementos --- 
    const ptzButtons = document.querySelectorAll('.ptz-btn');

    // Controles de Posiciones
    const addPositionBtn = document.getElementById('add-position-btn');
    const playSequenceBtn = document.getElementById('play-sequence-btn');
    const clearPositionsBtn = document.getElementById('clear-positions-btn');
    const pauseTimeInput = document.getElementById('pause-time');
    const positionList = document.getElementById('sequence-list');

    // Controles de Gestión de Secuencias
    const sequenceNameInput = document.getElementById('sequence-name-input');
    const saveSequenceBtn = document.getElementById('save-sequence-btn');
    const sequenceSelect = document.getElementById('sequence-select');
    const loadSequenceBtn = document.getElementById('load-sequence-btn');
    const deleteSequenceBtn = document.getElementById('delete-sequence-btn');
    const activeSequenceName = document.getElementById('active-sequence-name');

    // --- Variables de Estado ---
    let positions = []; // Almacenará la info de los inputs virtuales: { key, title, number }
    let isPlaying = false;

    // --- Lógica de UI ---
    const updatePositionListView = () => {
        positionList.innerHTML = '';
        positions.forEach((pos, index) => {
            const li = document.createElement('li');
            li.dataset.index = index; // Add data-index attribute
            li.textContent = `Posición ${index + 1} (Pausa: ${(pos.pauseTime || 0) / 1000}s)`; // Include pause time
            positionList.appendChild(li);
        });
    };

    const setControlsState = (disabled) => {
        addPositionBtn.disabled = disabled;
        clearPositionsBtn.disabled = disabled;
        ptzButtons.forEach(b => b.disabled = disabled);
        // También deshabilitamos los controles de guardado/carga
        saveSequenceBtn.disabled = disabled;
        loadSequenceBtn.disabled = disabled;
        deleteSequenceBtn.disabled = disabled;
        sequenceNameInput.disabled = disabled;
        sequenceSelect.disabled = disabled;
    };

    let highlightedIndex = -1; // Variable para mantener el índice resaltado

    const highlightPosition = (index) => {
        // Eliminar resaltado anterior
        if (highlightedIndex !== -1) {
            const prevLi = positionList.querySelector(`li[data-index="${highlightedIndex}"]`);
            if (prevLi) {
                prevLi.classList.remove('highlight');
            }
        }

        // Añadir resaltado nuevo
        if (index !== -1) {
            const newLi = positionList.querySelector(`li[data-index="${index}"]`);
            if (newLi) {
                newLi.classList.add('highlight');
            }
        }
        highlightedIndex = index;
    };

    // --- Lógica de Comandos PTZ (Movimiento Manual) ---
    const sendPtzCommand = async (command) => {
        try {
            await fetch('/api/ptz', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command }) });
        } catch (error) {
            console.error('Error de red o de conexión...', error);
        }
    };

    ptzButtons.forEach(button => {
        const command = button.dataset.direction || button.dataset.command;
        if (!command) { // Botón Home
            button.addEventListener('click', () => sendPtzCommand('home'));
            return;
        }
        const stopCommand = command.includes('zoom') ? 'zoom-stop' : 'stop';
        button.addEventListener('mousedown', () => sendPtzCommand(command));
        button.addEventListener('mouseup', () => sendPtzCommand(stopCommand));
        button.addEventListener('mouseleave', () => sendPtzCommand(stopCommand));
    });

    // --- Lógica para crear Snapshot (reutilizada) ---
    const createSnapshot = async () => {
        await fetch('/api/ptz/create-snapshot', { method: 'POST' });
        const response = await fetch('/api/ptz/last-created-input');
        if (!response.ok) throw new Error('No se pudo obtener la información del nuevo input.');
        return await response.json();
    };

    // --- Lógica de Gestión de Secuencias (Guardar/Cargar/Borrar) ---

    const updateSequenceList = async () => {
        try {
            const response = await fetch('/api/sequences');
            const sequenceNames = await response.json();
            sequenceSelect.innerHTML = '<option value="">-- Selecciona una secuencia --</option>';
            sequenceNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                sequenceSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar la lista de secuencias:', error);
        }
    };

    saveSequenceBtn.addEventListener('click', async () => {
        const name = sequenceNameInput.value.trim();
        if (!name) {
            return alert('Por favor, introduce un nombre para la secuencia.');
        }
        if (positions.length === 0) {
            return alert('No hay posiciones marcadas para guardar.');
        }

        try {
            await fetch(`/api/sequences/${name}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sequence: positions })
                });
            alert(`Secuencia '${name}' guardada.`);
            activeSequenceName.textContent = name;
            await updateSequenceList();
            sequenceSelect.value = name;
        } catch (error) {
            console.error('Error al guardar la secuencia:', error);
            alert('No se pudo guardar la secuencia.');
        }
    });

    loadSequenceBtn.addEventListener('click', async () => {
        const name = sequenceSelect.value;
        if (!name) {
            return alert('Por favor, selecciona una secuencia para cargar.');
        }

        try {
            const response = await fetch(`/api/sequences/${name}`);
            const loadedPositions = await response.json();
            
            // Antes de cargar la nueva, limpiar las posiciones actuales en vMix
            if (positions.length > 0) {
                const keysToRemove = positions.map(p => p.key);
                 await fetch('/api/ptz/remove-inputs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ keys: keysToRemove })
                });
            }

            positions = loadedPositions;
            updatePositionListView();
            sequenceNameInput.value = name;
            activeSequenceName.textContent = name;
            alert(`Secuencia '${name}' cargada.`);
        } catch (error) {
            console.error('Error al cargar la secuencia:', error);
            alert('No se pudo cargar la secuencia.');
        }
    });

    deleteSequenceBtn.addEventListener('click', async () => {
        const name = sequenceSelect.value;
        if (!name) {
            return alert('Por favor, selecciona una secuencia para borrar.');
        }
        if (!confirm(`¿Estás seguro de que quieres borrar la secuencia '${name}'? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            await fetch(`/api/sequences/${name}`, { method: 'DELETE' });
            alert(`Secuencia '${name}' borrada.`);
            await updateSequenceList();
            // Si la secuencia borrada era la activa, limpiar la UI
            if (activeSequenceName.textContent === name) {
                positions = [];
                updatePositionListView();
                activeSequenceName.textContent = 'Ninguna';
                sequenceNameInput.value = '';
            }
        } catch (error) {
            console.error('Error al borrar la secuencia:', error);
            alert('No se pudo borrar la secuencia.');
        }
    });

    // --- Lógica Principal de la Aplicación (Creación y Reproducción) ---

    addPositionBtn.addEventListener('click', async () => {
        addPositionBtn.disabled = true;
        addPositionBtn.textContent = 'Marcando...';
        try {
            const newPosition = await createSnapshot();
            newPosition.pauseTime = parseFloat(pauseTimeInput.value) * 1000; // Convert to milliseconds
            positions.push(newPosition);
            updatePositionListView();
        } catch (error) {
            console.error('Error al marcar la posición:', error);
            alert('No se pudo marcar la posición.');
        } finally {
            addPositionBtn.disabled = false;
            addPositionBtn.textContent = 'Marcar Posición';
        }
    });

    clearPositionsBtn.addEventListener('click', async () => {
        if (positions.length === 0) return;
        const keysToRemove = positions.map(p => p.key);
        
        try {
            await fetch('/api/ptz/remove-inputs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keys: keysToRemove })
            });
            positions = [];
            updatePositionListView();
            activeSequenceName.textContent = 'Ninguna';
            sequenceNameInput.value = '';
            alert('Posiciones limpiadas.');
        } catch (error) {
            console.error('Error al limpiar posiciones:', error);
            alert('No se pudieron limpiar las posiciones en vMix.');
        }
    });

    playSequenceBtn.addEventListener('click', async () => {
        if (isPlaying) {
            isPlaying = false;
            playSequenceBtn.textContent = 'Deteniendo...';
            playSequenceBtn.disabled = true;
            await sendPtzCommand('stop'); // Detener el movimiento de la cámara
            return;
        }

        if (positions.length < 1) {
            return alert('Necesitas al menos 1 posición marcada para reproducir.');
        }

        isPlaying = true;
        playSequenceBtn.textContent = 'Detener';
        setControlsState(true);

        
        let tempHomeSnapshot = null;
        let currentPosition = null; // La posición actual de la cámara en el bucle

        const PLAY_DURATION_MS = 112000; // Duración del paneo en milisegundos

        try {
            

            // 1. Ir a Home y crear snapshot temporal de Home
            await sendPtzCommand('home');
            await new Promise(r => setTimeout(r, 1000)); // Esperar que la cámara llegue a Home
            tempHomeSnapshot = await createSnapshot();
            currentPosition = tempHomeSnapshot; // Empezamos desde Home

            // Bucle de reproducción infinito
            while (isPlaying) {
                for (let i = 0; i < positions.length; i++) {
                    if (!isPlaying) break;
                    const nextPosition = positions[i];

                    if (currentPosition.key === nextPosition.key) {
                        continue;
                    }

                    highlightPosition(i); // Highlight current position
                    await fetch(`/api/ptz/function?name=PTZMoveToVirtualInputPosition&input=${nextPosition.key}`);
                    await new Promise(r => setTimeout(r, PLAY_DURATION_MS + 500));
                    currentPosition = nextPosition;
                }

                if (!isPlaying) break;

                if (positions.length > 1) {
                    await fetch(`/api/ptz/function?name=PTZMoveToVirtualInputPosition&input=${positions[0].key}`);
                    await new Promise(r => setTimeout(r, PLAY_DURATION_MS + 500));
                    currentPosition = positions[0];
                }
            }

        } catch (error) {
            console.error('Error en la reproducción:', error);
            alert('Ocurrió un error durante la reproducción. Revisa la consola del servidor.');
        } finally {
            if (tempHomeSnapshot) {
                await fetch('/api/ptz/remove-inputs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ keys: [tempHomeSnapshot.key] })
                });
            }
            isPlaying = false;
            playSequenceBtn.textContent = 'Reproducir';
            playSequenceBtn.disabled = false;
            setControlsState(false);
            highlightPosition(-1); // Remove all highlights
        }
    });

    // --- Inicialización ---
    updateSequenceList();
});