const icons = ['🍀', '🧀', '🐭', '💰', '⭐'];

const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const spinButton = document.getElementById('spin');
const resultBox = document.getElementById('result-box');
const modeIndicator = document.getElementById('mode-indicator');

const saldoSpan = document.getElementById('saldo');
const apostaSpan = document.getElementById('aposta');

const saldoMenor = document.getElementById('saldo-menor');
const saldoMaior = document.getElementById('saldo-maior');
const apostaMenor = document.getElementById('aposta-menor');
const apostaMaior = document.getElementById('aposta-maior');

let saldo = 1000;
let aposta = 50;

let mode = null;

const audioWin = new Audio('WIN.mp3');
const audioAlmost = new Audio('ALMOST.mp3');
const audioLose = new Audio('LOSE.mp3');
const audioSpin = new Audio('SPIN.mp3');

document.addEventListener('keydown', (event) => {
  switch(event.key.toLowerCase()){
    case 'q':
      mode = 'win';
      modeIndicator.textContent = 'W';
      break;
    case 'w':
      mode = 'almost';
      modeIndicator.textContent = 'A';
      break;
    case 'e':
      mode = 'lose';
      modeIndicator.textContent = 'L';
      break;
  }
});

function atualizarInterface() {
  saldoSpan.textContent = saldo;
  apostaSpan.textContent = aposta;
  spinButton.disabled = saldo < aposta;
}

function getDifferentIcon(exclude) {
  return icons.filter(icon => !exclude.includes(icon))[Math.floor(Math.random() * (icons.length - exclude.length))];
}

function spinSlot(slot, duration, finalIcon) {
  return new Promise(resolve => {
    const intervalTime = 100;  
    let elapsed = 0;
    const interval = setInterval(() => {
      slot.textContent = icons[Math.floor(Math.random() * icons.length)];
      elapsed += intervalTime;
      if (elapsed >= duration) {
        clearInterval(interval);
        slot.textContent = finalIcon;
        resolve();
      }
    }, intervalTime);
  });
}

function showResult(message, audio) {
  resultBox.textContent = message;
  resultBox.style.opacity = 1;
  resultBox.style.pointerEvents = 'auto';

  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Erro ao tocar áudio:", e));
  }

  setTimeout(() => {
    resultBox.style.opacity = 0;
    resultBox.style.pointerEvents = 'none';
  }, 3000);
}

spinButton.addEventListener('click', async () => {
  if (saldo < aposta) {
    showResult("⚠️ Saldo insuficiente!", null);
    return;
  }

  saldo -= aposta;
  atualizarInterface();

  spinButton.disabled = true;

  let finalIcons = [];

  if (mode === 'win') {
    const chosen = icons[Math.floor(Math.random() * icons.length)];
    finalIcons = [chosen, chosen, chosen];
  } else if (mode === 'almost') {
    const match = icons[Math.floor(Math.random() * icons.length)];
    const odd = getDifferentIcon([match]);
    finalIcons = [match, match, odd];
  } else {
    const a = icons[Math.floor(Math.random() * icons.length)];
    const b = getDifferentIcon([a]);
    const c = getDifferentIcon([a, b]);
    finalIcons = [a, b, c];
  }

  audioSpin.currentTime = 0;
  audioSpin.play().catch(e => console.log("Erro ao tocar áudio de giro:", e));

  const slot1Time = 2500;
  const slot2Time = 3200;
  const slot3Time = 4000;

  await Promise.all([
    spinSlot(slot1, slot1Time, finalIcons[0]),
    spinSlot(slot2, slot2Time, finalIcons[1]),
    spinSlot(slot3, slot3Time, finalIcons[2]),
  ]);

  audioSpin.pause();
  audioSpin.currentTime = 0;

  await new Promise(resolve => setTimeout(resolve, 500));

  if (finalIcons[0] === finalIcons[1] && finalIcons[1] === finalIcons[2]) {
    const premio = aposta * 10; // prêmio de 10x a aposta
    saldo += premio;
    showResult(`🎉 JACKPOT! 3x ${finalIcons[0]} 🎉 +${premio}`, audioWin);
  } else if (
    finalIcons[0] === finalIcons[1] ||
    finalIcons[1] === finalIcons[2] ||
    finalIcons[0] === finalIcons[2]
  ) {
    const premio = aposta * 0.5; // recupera metade da aposta
    saldo += premio;
    showResult(`💔 Quase! +${premio}`, audioAlmost);
  } else {
    showResult("🙃 Azar! Nenhum símbolo combinou.", audioLose);
  }

  atualizarInterface();
  spinButton.disabled = false;
});

// Controles de saldo e aposta
saldoMenor.addEventListener('click', () => {
  saldo = Math.max(0, saldo - 10);
  atualizarInterface();
});

saldoMaior.addEventListener('click', () => {
  saldo += 10;
  atualizarInterface();
});

apostaMenor.addEventListener('click', () => {
  aposta = Math.max(10, aposta - 10);
  atualizarInterface();
});

apostaMaior.addEventListener('click', () => {
  aposta += 10;
  atualizarInterface();
});

atualizarInterface();
