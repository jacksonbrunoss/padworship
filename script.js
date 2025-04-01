let currentAudio = null;
let fadeInterval = null;
let isLooping = true;

function playPadSound(pad) {
    const soundFile = pad.getAttribute("data-sound");
    if (!soundFile) return;
    
    // Se já houver um áudio tocando, fazer fade-out
    if (currentAudio) {
        let fadeOutInterval = setInterval(() => {
            if (currentAudio.volume > 0.05) {
                currentAudio.volume -= 0.05;
            } else {
                clearInterval(fadeOutInterval);
                currentAudio.pause();
                currentAudio = null;
                startNewSound(soundFile, pad);
            }
        }, 100);
    } else {
        startNewSound(soundFile, pad);
    }
}

function startNewSound(soundFile, pad) {
    let audio = new Audio(`sounds/${soundFile}`);
    audio.volume = 0;
    audio.loop = isLooping;
    audio.play();
    
    let fadeInInterval = setInterval(() => {
        if (audio.volume < 0.95) {
            audio.volume += 0.05;
        } else {
            clearInterval(fadeInInterval);
        }
    }, 100);
    
    currentAudio = audio;
    document.querySelectorAll(".pad").forEach(p => p.classList.remove("active"));
    pad.classList.add("active");
}

// Controle de volume
document.getElementById("volume-up").addEventListener("click", () => {
    if (currentAudio && currentAudio.volume < 1) {
        currentAudio.volume = Math.min(1, currentAudio.volume + 0.1);
    }
});

document.getElementById("volume-down").addEventListener("click", () => {
    if (currentAudio && currentAudio.volume > 0) {
        currentAudio.volume = Math.max(0, currentAudio.volume - 0.1);
    }
});

// Controle de loop
document.getElementById("loop-toggle").addEventListener("click", () => {
    isLooping = !isLooping;
    if (currentAudio) {
        currentAudio.loop = isLooping;
    }
    document.getElementById("loop-toggle").textContent = isLooping ? "Loop: ON" : "Loop: OFF";
});

// Botão de parar
document.getElementById("stop-button").addEventListener("click", () => {
    if (currentAudio) {
        let fadeOutInterval = setInterval(() => {
            if (currentAudio.volume > 0.05) {
                currentAudio.volume -= 0.05;
            } else {
                clearInterval(fadeOutInterval);
                currentAudio.pause();
                currentAudio = null;
                document.querySelectorAll(".pad").forEach(p => p.classList.remove("active"));
            }
        }, 100);
    }
});

// Adicionar evento de clique aos pads
document.querySelectorAll(".pad").forEach(pad => {
    pad.addEventListener("click", () => playPadSound(pad));
});
