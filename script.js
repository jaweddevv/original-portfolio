document.addEventListener('DOMContentLoaded', () => {
    showPage('home'); // Affiche la page d'accueil par défaut
});

function showPage(pageId) {
    // Masque autres pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Affiche la page demandée
    document.getElementById(pageId).classList.add('active');

    // Retirer l'active de tous les liens
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });

    // Sélectionner le lien correspondant et lui ajouter la classe active
    const activeLink = document.querySelector(`nav a[onclick="showPage('${pageId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("realAudio");
    const playBtn = document.getElementById("playPauseBtn");
    let audioCtx, analyser, source, dataArray, animFrame;

    function updateBtn() {
        playBtn.innerHTML = audio.paused ? '<i class="fa fa-play"></i>' : '<i class="fa fa-pause"></i>';
    }

    // --------- PULSE RYTHME ----------
    function startPulse() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 256; // pour basses
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
    function pulse() {
        analyser.getByteFrequencyData(dataArray);
        // cible les basses
        let bassAvg = 0;
        let N = 1; // augmenter/diminuer
        for (let i = 0; i < N; i++) {
            bassAvg += dataArray[i];
        }
        bassAvg /= N * 255; // Normalise
        let scale = 1 + Math.min(bassAvg * 1., 0.18); // Aggrandissement (à ajuster plus tard)
        playBtn.style.transform = `scale(${scale})`;
        animFrame = requestAnimationFrame(pulse);
    }
    pulse();
}


    function stopPulse() {
        playBtn.style.transform = 'scale(1)';
        if (animFrame) cancelAnimationFrame(animFrame);
    }

    playBtn.onclick = () => {
        if (audio.paused) audio.play();
        else audio.pause();
    };

    audio.addEventListener("play", () => {
        updateBtn();
        startPulse();
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    });
    audio.addEventListener("pause", () => {
        updateBtn();
        stopPulse();
    });
    audio.addEventListener("ended", () => {
        updateBtn();
        stopPulse();
    });

    updateBtn();
});

