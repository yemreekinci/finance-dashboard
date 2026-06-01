// ==========================================
// ADIM 6: DOM ELEMENTLERİNİ YAKALAMA
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-input');
const currenciesWrapper = document.getElementById('currencies-wrapper');
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const resultText = document.getElementById('result-text');

// API Bilgileri
const API_KEY = config.API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

// Global veri havuzu (Arama ve hesaplama işlemlerinde tekrar tekrar API'ye gitmemek için)
let currentRates = {};

// ==========================================
// ADIM 7: FETCH API & ASYNC/AWAIT İLE VERİ ÇEKME
// ==========================================
async function getExchangeRates(baseCurrency = 'TRY') {
    try {
        // Backend'deki Task/Async mantığı: fetch isteği tamamlanana kadar bekler (await)
        const response = await fetch(`${BASE_URL}/${baseCurrency}`);
        
        // Gelen yanıtın HTTP durum kodunu kontrol ediyoruz (HttpResponseMessage.IsSuccessStatusCode gibi)
        if (!response.ok) {
            throw new Error(`API hatası: ${response.status}`);
        }

        const data = await response.json();
        
        // API'den gelen conversion_rates nesnesini global değişkenimize aktarıyoruz
        currentRates = data.conversion_rates;
        
        // Veriyi konsola yazdırıp kontrol edelim (Geliştirme aşaması için)
        console.log("API'den Gelen Güncel Kurlar:", currentRates);

        // ADIM 8: Verileri HTML'e basan fonksiyonu çağırıyoruz
        renderCurrencies(currentRates);

    } catch (error) {
    // Mülakatçının en çok dikkat ettiği yer: Exception Handling
    console.error("Veri çekme esnasında bir hata oluştu:", error);
    currenciesWrapper.innerHTML = `<p style="color: red; padding: 1rem;">Veriler yüklenirken bir hata oluştu. Lütfen API anahtarınızı veya internet bağlantınızı kontrol edin.</p>`;
    }
}

// ==========================================
// ADIM 8: VERİLERİ HTML'E BASMA (DOM DÜZENLEME)
// ==========================================
function renderCurrencies(rates) {
    // Önce içeriyi temizliyoruz (Statik koyduğumuz prototip veriler uçacak)
    currenciesWrapper.innerHTML = '';

    // Takip etmek istediğimiz belirli popüler kurları seçiyoruz (İsteğe göre değiştirebilirsin)
    // API TRY tabanlı geldiği için buradaki değerler "1 TRY kaç USD, kaç EUR" şeklinde olacaktır.
    // Biz listeyi daha anlamlı kılmak için ters oran (1 / oran) mantığıyla "1 USD kaç TRY" olarak basacağız.
    const targetCurrencies = ['USD', 'EUR', 'GBP', 'BTC', 'ETH'];

    targetCurrencies.forEach(currency => {
        if (rates[currency]) {
            // Ters oran hesaplama (Örn: 1 / 0.0307 = 32.5 TRY)
            const priceInTry = (1 / rates[currency]).toFixed(2); 

            // Dinamik HTML satırı oluşturuyoruz
            const row = document.createElement('div');
            row.classList.add('crypto-row');
            
            row.innerHTML = `
                <span class="crypto-name">💰 ${currency} / TRY</span>
                <span class="crypto-price">${priceInTry} ₺</span>
            `;

            // Oluşturduğumuz satırı ana kapsayıcının içine ekliyoruz
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

    // Eğer input boşsa veya geçersizse hesaplama yapma
    if (isNaN(amount) || amount <= 0) {
        resultText.innerText = "Lütfen geçerli bir miktar girin.";
        return;
    }

    // API verilerimiz TRY tabanlı geldiği için çapraz kur hesaplaması yapıyoruz
    // Formül: (Miktar / Kaynak Kur Değeri) * Hedef Kur Değeri
    const fromRate = currentRates[fromCurrency];
    const toRate = currentRates[toCurrency];

    if (fromRate && toRate) {
        const convertedAmount = (amount / fromRate) * toRate;
        
        // Sonucu ekrana şık bir şekilde basıyoruz (.toFixed(2) ile virgülden sonra 2 basamak)
        resultText.innerText = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    }
}

// Seçim kutuları veya miktar değiştikçe hesaplamayı tetikleyecek Event Listener'lar
amountInput.addEventListener('input', calculateConversion);
fromCurrencySelect.addEventListener('change', calculateConversion);
toCurrencySelect.addEventListener('change', calculateConversion);

// Kaynak ve hedef para birimlerini takas eden (SWAP) ikon fonksiyonu
const swapIcon = document.querySelector('.swap-icon');
swapIcon.addEventListener('click', () => {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    calculateConversion(); // Takas sonrası yeniden hesapla
});


// ==========================================
// ADIM 10: ARAMA (FİLTRELEME) ÖZELLİĞİ
// ==========================================
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toUpperCase().trim();
    
    // Eğer arama kutusu boşsa tüm listeyi tekrar bas
    if (searchTerm === '') {
        renderCurrencies(currentRates);
        return;
    }

    // currentRates nesnesini filtrelemek için geçici bir nesne oluşturuyoruz
    const filteredRates = {};
    
    for (const currency in currentRates) {
        if (currency.includes(searchTerm)) {
            filteredRates[currency] = currentRates[currency];
        }
    }

    // Filtrelenmiş sonuçları render fonksiyonumuza gönderiyoruz
    renderCurrencies(filteredRates);
});


// ==========================================
// ADIM 11 & 12: DARK / LIGHT MODE & LOCALSTORAGE
// ==========================================
themeToggleBtn.addEventListener('click', () => {
    // Mevcut temayı HTML attribute üzerinden oku
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = 'light';

    if (currentTheme === 'light') {
        newTheme = 'dark';
        themeToggleBtn.innerText = "☀️ Gündüz Modu";
    } else {
        newTheme = 'light';
        themeToggleBtn.innerText = "🌙 Gece Modu";
    }

    // HTML etiketine yeni temayı bas (CSS bu sayede renk değiştirecek)
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Kullanıcının tercihini tarayıcı hafızasına kaydet (C#'taki AppSettings mantığı)
    localStorage.setItem('saved-theme', newTheme);
});

// ==========================================
// UYGULAMANIN BAŞLATILMASI (INITIALIZATION)
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Kaydedilmiş temayı kontrol et ve uygula
    const savedTheme = localStorage.getItem('saved-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggleBtn.innerText = savedTheme === 'dark' ? "☀️ Gündüz Modu" : "🌙 Gece Modu";

    // 2. API'den güncel verileri çek (Önce await ile verinin gelmesini bekliyoruz)
    await getExchangeRates('TRY');

    // 3. İlk açılışta çevirici kutusunun hesaplamasını yap
    calculateConversion();
});