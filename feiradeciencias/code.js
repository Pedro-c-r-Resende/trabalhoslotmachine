const icons = ['🍒', '🍋', '🍉', '🔔', '⭐', '7️⃣'];

const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const spinButton = document.getElementById('spin');

let mode = null;

const modeIndicator = document.getElementById('mode-indicator');

document.addEventListener('keydown', (event) => {
    switch(event.key.toLowerCase()){
        case 'q':
            mode = 'win';
            modeIndicator.textContent = 'w';
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
})

function getDifferentIcon(exclude) {
  return icons.filter(icon => !exclude.includes(icon))[Math.floor(Math.random() * (icons.length - exclude.length))];
}

function spinSlot(slot, delay, finalIcon) {
  return new Promise(resolve => {
    let counter = 0;
    const interval = setInterval(() => {
      slot.textContent = icons[Math.floor(Math.random() * icons.length)];
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        slot.textContent = finalIcon;
        resolve();
      }
    }, delay);
  });
}

spinButton.addEventListener('click', async () => {
  spinButton.disabled = true;

  let finalIcons = [];

  if (mode === 'win') {
    // WIN: All 3 the same
    const chosen = icons[Math.floor(Math.random() * icons.length)];
    finalIcons = [chosen, chosen, chosen];

  }  else if (mode == 'almost') {
    // ALMOST: 2 same, 1 different
    const match = icons[Math.floor(Math.random() * icons.length)];
    const odd = getDifferentIcon([match]);
    const oddIndex = Math.floor(Math.random() * 3);
    finalIcons = [match, match, match];
    finalIcons[oddIndex] = odd;
  } else {
    // LOSE: All 3 different
    const a = icons[Math.floor(Math.random() * icons.length)];
    const b = getDifferentIcon([a]);
    const c = getDifferentIcon([a, b]);
    finalIcons = [a, b, c];
  }

  // Spin animation and show final result
  await spinSlot(slot1, 100, finalIcons[0]);
  await spinSlot(slot2, 100, finalIcons[1]);
  await spinSlot(slot3, 100, finalIcons[2]);

  await new Promise(resolve => setTimeout(resolve, 500));

  // Optional feedback
  if (finalIcons[0] === finalIcons[1] && finalIcons[1] === finalIcons[2]) {
    alert(`🎉 JACKPOT! 3x ${finalIcons[0]} 🎉`);
  } else if (
    finalIcons[0] === finalIcons[1] ||
    finalIcons[1] === finalIcons[2] ||
    finalIcons[0] === finalIcons[2]
  ) {
    alert(`💔 Quase! Dois ${finalIcons[1]} iguais, mas não venceu.`);
  } else {
    alert("🙃 Azar! Nenhum símbolo combinou.");
  }

  spinButton.disabled = false;
});
