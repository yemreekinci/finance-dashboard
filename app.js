const themeToggleBtn = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-input');
const currenciesWrapper = document.getElementById('currencies-wrapper');
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const resultText = document.getElementById('result-text');

// ==========================================
// API BİLGİLERİ VE GÜVENLİK KONTROLÜ
// ==========================================
let API_KEY = "";

if (typeof config !== 'undefined' && config.API_KEY && config.API_KEY !== 'BURAYA_KENDİ_API_KEYİNİZİ_YAZIN' && config.API_KEY !== 'YOUR_API_KEY_HERE') {
    API_KEY = config.API_KEY;
} else {
    API_KEY = sessionStorage.getItem('user-api-key') || "";
}

let currentRates = {};

// ==========================================
// ADIM 7: FETCH API & ASYNC/AWAIT İLE VERİ ÇEKME
// ==========================================
async function getExchangeRates(baseCurrency = 'TRY') {
    try {
        // URL'i istek atıldığı tam o anda güncel API_KEY ile oluşturuyoruz:
        const currentUrl = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`;
        
        // fetch isteği tamamlanana kadar bekler (await)
        const response = await fetch(currentUrl);
        
        if (!response.ok) {
            throw new Error(`API hatası: ${response.status}`);
        }

        const data = await response.json();
        currentRates = data.conversion_rates;
        
        console.log("API'den Gelen Güncel Kurlar:", currentRates);
        renderCurrencies(currentRates);

    } catch (error) {
        console.error("Veri çekme esnasında bir hata oluştu:", error);
        currenciesWrapper.innerHTML = `<p style="color: red; padding: 1rem;">Veriler yüklenirken bir hata oluştu. Lütfen API anahtarınızı kontrol edin.</p>`;
    }
}

// ==========================================
// ADIM 8: VERİLERİ HTML'E BASMA (DOM DÜZENLEME)
// ==========================================
function renderCurrencies(rates) {
    currenciesWrapper.innerHTML = '';


    const targetCurrencies = ['USD', 'EUR', 'GBP', 'BTC', 'ETH'];

    targetCurrencies.forEach(currency => {
        if (rates[currency]) {
            const priceInTry = (1 / rates[currency]).toFixed(2); 

            const row = document.createElement('div');
            row.classList.add('crypto-row');
            
            row.innerHTML = `
                <span class="crypto-name">💰 ${currency} / TRY</span>
                <span class="crypto-price">${priceInTry} ₺</span>
            `;

            currenciesWrapper.appendChild(row);
        }
    });
}

// ==========================================
// ADIM 9: HESAP MAKİNESİ / DÖNÜŞTÜRÜCÜ MANTIĞI
// ==========================================
function calculateConversion() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount) || amount <= 0) {
        resultText.innerText = "Lütfen geçerli bir miktar girin.";
        return;
    }


    const fromRate = currentRates[fromCurrency];
    const toRate = currentRates[toCurrency];

    if (fromRate && toRate) {
        const convertedAmount = (amount / fromRate) * toRate;
        
        resultText.innerText = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    }
}

amountInput.addEventListener('input', calculateConversion);
fromCurrencySelect.addEventListener('change', calculateConversion);
toCurrencySelect.addEventListener('change', calculateConversion);

const swapIcon = document.querySelector('.swap-icon');
swapIcon.addEventListener('click', () => {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    calculateConversion();
});


// ==========================================
// ADIM 10: ARAMA (FİLTRELEME) ÖZELLİĞİ
// ==========================================
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toUpperCase().trim();
    
    if (searchTerm === '') {
        renderCurrencies(currentRates);
        return;
    }

    const filteredRates = {};
    
    for (const currency in currentRates) {
        if (currency.includes(searchTerm)) {
            filteredRates[currency] = currentRates[currency];
        }
    }

    renderCurrencies(filteredRates);
});


// ==========================================
// ADIM 11 & 12: DARK / LIGHT MODE & LOCALSTORAGE
// ==========================================
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = 'light';

    if (currentTheme === 'light') {
        newTheme = 'dark';
        themeToggleBtn.innerText = "☀️ Gündüz Modu";
    } else {
        newTheme = 'light';
        themeToggleBtn.innerText = "🌙 Gece Modu";
    }

    document.documentElement.setAttribute('data-theme', newTheme);
    
    localStorage.setItem('saved-theme', newTheme);
});

// ==========================================
// UYGULAMANIN BAŞLATILMASI (INITIALIZATION)
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    const savedTheme = localStorage.getItem('saved-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggleBtn.innerText = savedTheme === 'dark' ? "☀️ Gündüz Modu" : "🌙 Gece Modu";


    while (!API_KEY || API_KEY.trim() === "") {
        const userInput = prompt("Lütfen ExchangeRate-API anahtarınızı giriniz:\n(GitHub güvenliği nedeniyle config.js dahil edilmemiştir)");
        
        if (userInput === null) {
            currenciesWrapper.innerHTML = `<p style="color: #ff9800; padding: 1rem; font-weight:bold;">⚠️ Projeyi deneyimlemek için geçerli bir API Key girmeniz gerekmektedir. Lütfen sayfayı yenileyip anahtarınızı girin.</p>`;
            return;
        }
        
        if (userInput.trim() !== "") {
            API_KEY = userInput.trim();
            sessionStorage.setItem('user-api-key', API_KEY);
            BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;
        }
    }

    await getExchangeRates('TRY');

    calculateConversion();
});