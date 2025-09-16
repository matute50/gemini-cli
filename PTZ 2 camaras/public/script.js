document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // --- STATE MANAGEMENT ---
    // =================================================================================
    let state = {
        cameras: {
            '1': { input: '1', positions: [], activeSequence: 'Ninguna', isPlaying: false, status: 'unknown' },
            '2': { input: '2', positions: [], activeSequence: 'Ninguna', isPlaying: false, status: 'unknown' }
        },
        activeCameraId: '1'
    };

    // =================================================================================
    // --- ELEMENT REFERENCES ---
    // =================================================================================
    const cam1Input = document.getElementById('cam1-input');
    const cam2Input = document.getElementById('cam2-input');
    const saveConfigBtn = document.getElementById('save-config-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const ptzButtons = document.querySelectorAll('.ptz-btn');
    const addPositionBtn = document.getElementById('add-position-btn');
    const playSequenceBtn = document.getElementById('play-sequence-btn');
    const clearPositionsBtn = document.getElementById('clear-positions-btn');
    const pauseTimeInput = document.getElementById('pause-time');
    const panDurationInput = document.getElementById('pan-duration');
    const positionList = document.getElementById('sequence-list');
    const sequenceNameInput = document.getElementById('sequence-name-input');
    const saveSequenceBtn = document.getElementById('save-sequence-btn');
    const sequenceSelect = document.getElementById('sequence-select');
    const loadSequenceBtn = document.getElementById('load-sequence-btn');
    const deleteSequenceBtn = document.getElementById('delete-sequence-btn');
    const activeSequenceName = document.getElementById('active-sequence-name');
    const randomOrderCheckbox = document.getElementById('random-order-checkbox');
    const refreshStatusBtn = document.getElementById('refresh-status-btn');

    // =================================================================================
    // --- CONFIGURATION & INITIALIZATION ---
    // =================================================================================
    const saveConfig = () => {
        const cam1Value = cam1Input.value.trim();
        const cam2Value = cam2Input.value.trim();
        if (!cam1Value || !cam2Value) {
            return alert('Los Inputs de las cámaras no pueden estar vacíos.');
        }
        localStorage.setItem('ptzConfig', JSON.stringify({ cam1: cam1Value, cam2: cam2Value }));
        state.cameras['1'].input = cam1Value;
        state.cameras['2'].input = cam2Value;
        alert('Configuración guardada.');
    };

    const loadConfig = () => {
        const savedConfig = localStorage.getItem('ptzConfig');
        if (savedConfig) {
            const { cam1, cam2 } = JSON.parse(savedConfig);
            cam1Input.value = cam1;
            cam2Input.value = cam2;
            state.cameras['1'].input = cam1;
            state.cameras['2'].input = cam2;
        }
    };

    const updateCameraStatusUI = () => {
        for (const camId in state.cameras) {
            const statusIndicator = document.getElementById(`status-cam-${camId}`);
            const tabButton = document.querySelector(`.tab-btn[data-camera="${camId}"]`);
            if (statusIndicator && tabButton) {
                statusIndicator.className = `camera-status-indicator ${state.cameras[camId].status}`;
                tabButton.disabled = (state.cameras[camId].status === 'offline');
                if (state.cameras[camId].status === 'offline' && state.activeCameraId === camId) {
                    // If active camera goes offline, switch to the first available online camera
                    const onlineCam = Object.keys(state.cameras).find(id => state.cameras[id].status === 'online');
                    if (onlineCam) {
                        switchTab(onlineCam);
                    } else {
                        // All cameras offline, disable all controls
                        setControlsState(true, 'all');
                    }
                }
            }
        }
    };

    const checkCameraStatus = async () => {
        const cameraInputs = {};
        for (const camId in state.cameras) {
            cameraInputs[`cam${camId}`] = state.cameras[camId].input;
        }
        const queryString = new URLSearchParams(cameraInputs).toString();
        try {
            const response = await fetch(`/api/cameras/status?${queryString}`);
            const statuses = await response.json();
            for (const camId in statuses) {
                const numericCamId = camId.replace('cam', '');
                if (state.cameras[numericCamId]) {
                    state.cameras[numericCamId].status = statuses[camId];
                }
            }
            updateCameraStatusUI();
        } catch (error) {
            console.error('Error al obtener el estado de las cámaras:', error);
            // If API call fails, assume all are offline
            for (const camId in state.cameras) {
                state.cameras[camId].status = 'offline';
            }
            updateCameraStatusUI();
        }
    };

    const init = () => {
        loadConfig();
        checkCameraStatus(); // Check status on load
        updateUIForActiveCamera();
        saveConfigBtn.addEventListener('click', saveConfig);
        tabButtons.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.camera)));
        refreshStatusBtn.addEventListener('click', checkCameraStatus);
        // Add all other event listeners
        ptzButtons.forEach(button => {
            const command = button.dataset.direction || button.dataset.command;
            if (!command) { // Home button
                button.addEventListener('click', () => sendPtzCommand('home'));
                return;
            }
            const stopCommand = command.includes('zoom') ? 'zoom-stop' : 'stop';
            button.addEventListener('mousedown', () => sendPtzCommand(command));
            button.addEventListener('mouseup', () => sendPtzCommand(stopCommand));
            button.addEventListener('mouseleave', () => sendPtzCommand(stopCommand));
        });
        addPositionBtn.addEventListener('click', addPositionHandler);
        clearPositionsBtn.addEventListener('click', clearPositionsHandler);
        saveSequenceBtn.addEventListener('click', saveSequenceHandler);
        loadSequenceBtn.addEventListener('click', loadSequenceHandler);
        deleteSequenceBtn.addEventListener('click', deleteSequenceHandler);
        playSequenceBtn.addEventListener('click', playSequenceHandler);
    };

    // =================================================================================
    // --- UI & TAB LOGIC ---
    // =================================================================================
    let highlightedIndex = -1;

    const highlightPosition = (index) => {
        if (highlightedIndex !== -1) {
            const prevLi = positionList.querySelector(`li[data-index="${highlightedIndex}"]`);
            if (prevLi) prevLi.classList.remove('highlight');
        }
        if (index !== -1) {
            const newLi = positionList.querySelector(`li[data-index="${index}"]`);
            if (newLi) newLi.classList.add('highlight');
        }
        highlightedIndex = index;
    };

    const updatePositionListView = () => {
        const activeCamData = state.cameras[state.activeCameraId];
        positionList.innerHTML = '';
        activeCamData.positions.forEach((pos, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;
            li.textContent = `Posición ${index + 1}`;
            positionList.appendChild(li);
        });
    };

    const updateSequenceDropdown = async () => {
        const inputId = getActiveInputId();
        try {
            const response = await fetch(`/api/sequences?inputId=${inputId}`);
            if (!response.ok) throw new Error('Failed to fetch sequences');
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

    const updateUIForActiveCamera = () => {
        const activeCamData = state.cameras[state.activeCameraId];
        activeSequenceName.textContent = activeCamData.activeSequence;
        sequenceNameInput.value = activeCamData.activeSequence === 'Ninguna' ? '' : activeCamData.activeSequence;
        updatePositionListView();
        updateSequenceDropdown();
        // Update control states for the active camera
        setControlsState(activeCamData.isPlaying, state.activeCameraId);

        // Ensure global config controls are always enabled
        cam1Input.disabled = false;
        cam2Input.disabled = false;
        saveConfigBtn.disabled = false;
    };

    const switchTab = (cameraNumber) => {
        if (state.cameras[cameraNumber].status === 'offline') {
            return alert('No se puede seleccionar una cámara que está offline.');
        }
        if (state.cameras[state.activeCameraId].isPlaying) {
            return alert('No se puede cambiar de cámara mientras la cámara actual está reproduciendo una secuencia.');
        }
        state.activeCameraId = cameraNumber;
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.camera === cameraNumber);
        });
        updateUIForActiveCamera();
    };

    const setControlsState = (disabled, camId = state.activeCameraId) => {
        if (camId === 'all') {
            // Disable/enable all controls if all cameras are offline
            ptzButtons.forEach(b => { b.disabled = disabled; });
            [addPositionBtn, clearPositionsBtn, saveSequenceBtn, loadSequenceBtn, deleteSequenceBtn, sequenceNameInput, sequenceSelect, randomOrderCheckbox, pauseTimeInput, panDurationInput].forEach(el => el.disabled = disabled);
            playSequenceBtn.disabled = disabled;
            playSequenceBtn.textContent = disabled ? 'Reproducir' : 'Reproducir'; // Reset text
            return;
        }

        state.cameras[camId].isPlaying = disabled;
        
        // Only update play button for the active camera
        if (camId === state.activeCameraId) {
            playSequenceBtn.textContent = disabled ? 'Detener' : 'Reproducir';
            playSequenceBtn.disabled = disabled;
        }

        // Disable/enable PTZ buttons and sequence controls for the specific camera
        const isActiveTab = (camId === state.activeCameraId);
        const isOffline = (state.cameras[camId].status === 'offline');

        ptzButtons.forEach(b => { b.disabled = disabled || !isActiveTab || isOffline; });
        [addPositionBtn, clearPositionsBtn, saveSequenceBtn, loadSequenceBtn, deleteSequenceBtn, sequenceNameInput, sequenceSelect, randomOrderCheckbox, pauseTimeInput, panDurationInput].forEach(el => el.disabled = disabled || !isActiveTab || isOffline);
    };

    // =================================================================================
    // --- API & CORE LOGIC ---
    // =================================================================================
    const getActiveInputId = () => state.cameras[state.activeCameraId].input;

    const sendPtzCommand = async (command) => {
        try {
            await fetch('/api/ptz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command, inputId: getActiveInputId() })
            });
        } catch (error) {
            console.error('Error de red o de conexión...', error);
        }
    };

    const createSnapshot = async () => {
        const inputId = getActiveInputId();
        await fetch('/api/ptz/create-snapshot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ inputId }) });
        const response = await fetch(`/api/ptz/last-created-input?inputId=${inputId}`);
        if (!response.ok) throw new Error('No se pudo obtener la información del nuevo input.');
        return await response.json();
    };

    const removeInputs = async (keys) => {
        if (keys.length === 0) return;
        await fetch('/api/ptz/remove-inputs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keys }) });
    };

    async function addPositionHandler() {
        addPositionBtn.disabled = true;
        addPositionBtn.textContent = 'Marcando...';
        try {
            const newPosition = await createSnapshot();
            state.cameras[state.activeCameraId].positions.push(newPosition);
            updatePositionListView();
        } catch (error) {
            console.error('Error al marcar la posición:', error);
            alert('No se pudo marcar la posición.');
        } finally {
            addPositionBtn.disabled = false;
            addPositionBtn.textContent = 'Marcar Posición';
        }
    }

    async function clearPositionsHandler() {
        const activeCamData = state.cameras[state.activeCameraId];
        if (activeCamData.positions.length === 0) return;
        const keysToRemove = activeCamData.positions.map(p => p.key);
        try {
            await removeInputs(keysToRemove);
            activeCamData.positions = [];
            activeCamData.activeSequence = 'Ninguna';
            updateUIForActiveCamera();
            alert('Posiciones limpiadas.');
        } catch (error) {
            console.error('Error al limpiar posiciones:', error);
            alert('No se pudieron limpiar las posiciones en vMix.');
        }
    }

    async function saveSequenceHandler() {
        const activeCamData = state.cameras[state.activeCameraId];
        const name = sequenceNameInput.value.trim();
        if (!name) return alert('Por favor, introduce un nombre para la secuencia.');
        if (activeCamData.positions.length === 0) return alert('No hay posiciones marcadas para guardar.');

        try {
            await fetch(`/api/sequences/${name}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sequence: activeCamData.positions, inputId: getActiveInputId() })
                });
            alert(`Secuencia '${name}' guardada.`);
            activeCamData.activeSequence = name;
            await updateSequenceDropdown();
            sequenceSelect.value = name;
        } catch (error) {
            console.error('Error al guardar la secuencia:', error);
            alert('No se pudo guardar la secuencia.');
        }
    }

    async function loadSequenceHandler() {
        const name = sequenceSelect.value;
        if (!name) return alert('Por favor, selecciona una secuencia para cargar.');
        const activeCamData = state.cameras[state.activeCameraId];

        try {
            const response = await fetch(`/api/sequences/${name}?inputId=${getActiveInputId()}`);
            const loadedPositions = await response.json();
            
            const currentKeys = activeCamData.positions.map(p => p.key);
            await removeInputs(currentKeys);

            activeCamData.positions = loadedPositions;
            activeCamData.activeSequence = name;
            updateUIForActiveCamera();
            alert(`Secuencia '${name}' cargada.`);
        } catch (error) {
            console.error('Error al cargar la secuencia:', error);
            alert('No se pudo cargar la secuencia.');
        }
    }

    async function deleteSequenceHandler() {
        const name = sequenceSelect.value;
        if (!name) return alert('Por favor, selecciona una secuencia para borrar.');
        if (!confirm(`¿Estás seguro de que quieres borrar la secuencia '${name}'?`)) return;

        try {
            await fetch(`/api/sequences/${name}?inputId=${getActiveInputId()}`, { method: 'DELETE' });
            alert(`Secuencia '${name}' borrada.`);
            const activeCamData = state.cameras[state.activeCameraId];
            if (activeCamData.activeSequence === name) {
                activeCamData.activeSequence = 'Ninguna';
                sequenceNameInput.value = '';
            }
            await updateSequenceDropdown();
        } catch (error) {
            console.error('Error al borrar la secuencia:', error);
            alert('No se pudo borrar la secuencia.');
        }
    }

    async function playSequenceHandler() {
        const activeCamData = state.cameras[state.activeCameraId];

        if (activeCamData.isPlaying) {
            activeCamData.isPlaying = false; // Signal to stop the loop
            playSequenceBtn.textContent = 'Deteniendo...';
            playSequenceBtn.disabled = true;
            await sendPtzCommand('stop');
            return;
        }
        
        if (activeCamData.positions.length < 1) return alert('Necesitas al menos 1 posición.');

        setControlsState(true, state.activeCameraId);

        let currentPosition = null;

        try {
            const startPosition = activeCamData.positions[0];
            const initialDurationInMs = parseFloat(panDurationInput.value) * 1000;
            const initialPauseInMs = parseFloat(pauseTimeInput.value) * 1000;

            highlightPosition(0);
            await fetch(`/api/ptz/function?name=PTZMoveToVirtualInputPosition&input=${startPosition.key}`);
            await new Promise(r => setTimeout(r, initialDurationInMs + 500));
            currentPosition = startPosition;

            if (activeCamData.isPlaying) await new Promise(r => setTimeout(r, initialPauseInMs));

            while (activeCamData.isPlaying) {
                const durationInMs = parseFloat(panDurationInput.value) * 1000;
                const pauseInMs = parseFloat(pauseTimeInput.value) * 1000;
                const isRandom = randomOrderCheckbox.checked;

                if (isRandom) {
                    if (activeCamData.positions.length < 2) {
                        alert("El modo aleatorio requiere al menos 2 posiciones.");
                        break;
                    }
                    const shuffled = [...activeCamData.positions];
                    for (let i = shuffled.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                    }
                    if (shuffled[0].key === currentPosition.key) shuffled.push(shuffled.shift());

                    for (const nextPos of shuffled) {
                        if (!activeCamData.isPlaying) break;
                        const originalIndex = activeCamData.positions.findIndex(p => p.key === nextPos.key);
                        highlightPosition(originalIndex);
                        await fetch(`/api/ptz/function?name=PTZMoveToVirtualInputPosition&input=${nextPos.key}`);
                        await new Promise(r => setTimeout(r, durationInMs + 500));
                        currentPosition = nextPos;
                        if (activeCamData.isPlaying) await new Promise(r => setTimeout(r, pauseInMs));
                    }
                    if (activeCamData.isPlaying) console.log('Ciclo aleatorio completado.');
                } else {
                    for (let i = 1; i < activeCamData.positions.length; i++) {
                        if (!activeCamData.isPlaying) break;
                        const nextPos = activeCamData.positions[i];
                        highlightPosition(i);
                        await fetch(`/api/ptz/function?name=PTZMoveToVirtualInputPosition&input=${nextPos.key}`);
                        await new Promise(r => setTimeout(r, durationInMs + 500));
                        currentPosition = nextPos;
                        if (activeCamData.isPlaying) await new Promise(r => setTimeout(r, pauseInMs));
                    }
                    if (!activeCamData.isPlaying) break;
                    if (activeCamData.positions.length > 1) {
                        highlightPosition(0);
                        await fetch(`/api/ptz/function?name=PTZMoveToVirtualInputPosition&input=${activeCamData.positions[0].key}`);
                        await new Promise(r => setTimeout(r, durationInMs + 500));
                        currentPosition = activeCamData.positions[0];
                        if (activeCamData.isPlaying) await new Promise(r => setTimeout(r, pauseInMs));
                    }
                    console.log('Ciclo secuencial completado.');
                }
            }
        } catch (error) {
            console.error('Error en la reproducción:', error);
            alert('Ocurrió un error durante la reproducción.');
        } finally {
            setControlsState(false, state.activeCameraId);
            highlightPosition(-1);
        }
    }

    // =================================================================================
    // --- INITIALIZATION ---
    // =================================================================================
    init();
});
