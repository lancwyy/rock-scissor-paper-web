document.addEventListener('DOMContentLoaded', () => {
    const choices = document.querySelectorAll('.choice-btn');
    const resultArea = document.getElementById('result-area');
    const userEmoji = document.getElementById('user-emoji');
    const computerEmoji = document.getElementById('computer-emoji');
    const resultText = document.getElementById('result-text');
    const playAgainBtn = document.getElementById('play-again-btn');

    // Theme Switcher Logic
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';

    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    // Localization Logic
    const langToggle = document.getElementById('lang-toggle');
    const translations = {
        'en': {
            'title': 'Rock Paper Scissors',
            'subtitle': 'Choose your weapon!',
            'wins': 'Wins',
            'losses': 'Losses',
            'ties': 'Ties',
            'rock': 'Rock',
            'paper': 'Paper',
            'scissors': 'Scissors',
            'you': 'You',
            'computer': 'Computer',
            'playAgain': 'Play Again',
            'history': 'Game History',
            'winMsg': 'You Win! 🎉',
            'loseMsg': 'You Lose! 😢',
            'tieMsg': "It's a Tie! 🤝",
            'winLabel': 'WIN',
            'lossLabel': 'LOSS',
            'tieLabel': 'TIE'
        },
        'zh-TW': {
            'title': '剪刀、石頭、布',
            'subtitle': '選擇你的武器！',
            'wins': '勝',
            'losses': '負',
            'ties': '平局',
            'rock': '石頭',
            'paper': '布',
            'scissors': '剪刀',
            'you': '你',
            'computer': '電腦',
            'playAgain': '再玩一次',
            'history': '遊戲記錄',
            'winMsg': '你贏了！ 🎉',
            'loseMsg': '你輸了！ 😢',
            'tieMsg': "平局！ 🤝",
            'winLabel': '勝',
            'lossLabel': '負',
            'tieLabel': '平'
        }
    };

    let currentLang = localStorage.getItem('lang') || 'zh-TW'; // Default to Chinese Traditional
    let globalHistory = [];
    let lastResultData = null;

    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        langToggle.textContent = lang === 'zh-TW' ? 'English' : '繁體中文';

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Re-render dynamic content
        if (lastResultData) {
            renderResultText(lastResultData);
        }
        if (globalHistory.length > 0) {
            updateHistory(globalHistory);
        }
    }

    // Initial load
    updateLanguage(currentLang);

    langToggle.addEventListener('click', () => {
        updateLanguage(currentLang === 'zh-TW' ? 'en' : 'zh-TW');
    });

    const emojiMap = {
        'rock': '🪨',
        'paper': '📄',
        'scissors': '✂️'
    };

    choices.forEach(choice => {
        choice.addEventListener('click', async () => {
            const userChoice = choice.dataset.choice;

            // Disable buttons during request
            choices.forEach(btn => btn.disabled = true);

            try {
                const response = await fetch('/play', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ choice: userChoice })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                showResult(data);
            } catch (error) {
                console.error('Error:', error);
                alert('Something went wrong. Please try again.');
                choices.forEach(btn => btn.disabled = false);
            }
        });
    });

    playAgainBtn.addEventListener('click', () => {
        resultArea.classList.add('hidden');
        choices.forEach(btn => btn.disabled = false);
        // animated reset
        document.querySelector('.game-area').scrollIntoView({ behavior: 'smooth' });
    });

    function showResult(data) {
        lastResultData = data; // Save for language switch
        globalHistory = data.history; // Save for language switch

        userEmoji.textContent = emojiMap[data.user_choice];
        computerEmoji.textContent = emojiMap[data.computer_choice];

        renderResultText(data);

        resultArea.classList.remove('hidden');

        // Update Scoreboard
        document.getElementById('score-win').textContent = data.stats.win;
        document.getElementById('score-lose').textContent = data.stats.lose;
        document.getElementById('score-tie').textContent = data.stats.tie;

        // Update History
        updateHistory(data.history);

        // Scroll to result
        setTimeout(() => {
            resultArea.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    function renderResultText(data) {
        let message = '';
        let color = '';
        const t = translations[currentLang];

        if (data.result === 'win') {
            message = t.winMsg;
            color = '#4caf50';
        } else if (data.result === 'lose') {
            message = t.loseMsg;
            color = '#f44336';
        } else {
            message = t.tieMsg;
            color = '#ff9800';
        }

        resultText.textContent = message;
        resultText.style.color = color;
    }

    function updateHistory(history) {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = ''; // Clear current list
        const t = translations[currentLang];

        history.forEach(game => {
            const li = document.createElement('li');
            li.className = `history-item ${game.result}`;

            const resultLabel = game.result === 'win' ? t.winLabel : (game.result === 'lose' ? t.lossLabel : t.tieLabel);

            li.innerHTML = `
                <div class="history-info">
                    <span class="game-id">#${game.id}</span>
                    <span class="game-time">${game.timestamp}</span>
                </div>
                <div class="history-result"><strong>${resultLabel}</strong></div>
                <div class="history-details">
                    <span>${t.you}: ${emojiMap[game.user]}</span>
                    <span>${t.computer}: ${emojiMap[game.computer]}</span>
                </div>
            `;
            historyList.appendChild(li);
        });
    }
});
