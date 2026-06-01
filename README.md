# Finans & Kripto Para Takip Dashboard'u

Bu proje; güncel döviz kur ve kripto para verilerini anlık olarak listeleyen, vanilla front-end teknolojileri (HTML5, CSS3, JavaScript) ile geliştirilmiş dinamik bir web arayüzü uygulamasıdır.

##  Öne Çıkan Teknik Özellikler

- **Semantik HTML5:** Sayfa yapısı tamamen erişilebilir ve okunabilir semantik etiketlerle (`<header>`, `<main>`, `<section>`) inşa edilmiştir.
- **Modern CSS3 (Flexbox & Grid):** Responsive tasarımı destekleyen, harici CSS kütüphanesi (Bootstrap/Tailwind) kullanılmadan geliştirilmiş özgün arayüz tasarımı.
- **CSS Değişkenleri (Variables) & LocalStorage:** Kullanıcı tercihini tarayıcı hafızasında tutan dinamik Dark/Light Mode yönetimi.
- **Asenkron JavaScript (Async/Await & Fetch API):** Üçüncü parti finans API'lerine (`ExchangeRate-API`) asenkron istekler atılarak hata yönetimi (`try-catch`) ile veri manipülasyonu sağlanmıştır.
- **Güvenlik Bilinci (.gitignore):** Hassas veri (API Key) yönetimi kod içerisinden soyutlanmış, yapılandırma dosyaları repoya dahil edilmeyerek güvenlik standartları korunmuştur.

## Kurulum ve Çalıştırma

1. Projeyi bilgisayarınıza clonelayın:
   ```bash
   git clone <repo-url>
    ```
       
2. Kök dizinde config.js adında bir dosya oluşturun ve config.example.js içeriğini kopyalayarak kendi API anahtarınızı tanımlayın:

   ```javascript
    const config = {
        API_KEY: 'BURAYA_KENDİ_API_KEYİNİZİ_YAZIN'
    };
    ```

3. `index.html` dosyasını tarayıcınızda açarak uygulamayı doğrudan deneyimleyebilirsiniz.

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.


# Finance & Cryptocurrency Tracking Dashboard

This project is a dynamic web dashboard built with vanilla front-end technologies (HTML5, CSS3, and JavaScript) that displays real-time exchange rate and cryptocurrency market data.

## Key Technical Features

* **Semantic HTML5:** The page structure is built entirely with accessible and readable semantic tags such as `<header>`, `<main>`, and `<section>`.
* **Modern CSS3 (Flexbox & Grid):** A fully responsive and custom-designed user interface developed without relying on external CSS frameworks such as Bootstrap or Tailwind CSS.
* **CSS Variables & LocalStorage:** Dynamic Dark/Light Mode management with user preferences stored locally in the browser.
* **Asynchronous JavaScript (Async/Await & Fetch API):** Real-time data retrieval from third-party financial APIs (ExchangeRate-API) using asynchronous requests, along with robust error handling through `try-catch` blocks.
* **Security Awareness (.gitignore):** Sensitive information such as API keys is abstracted from the source code, and configuration files are excluded from the repository to follow security best practices.

## Installation & Usage

1. Clone the repository:

```bash
git clone <repo-url>
```

2. Create a file named `config.js` in the root directory and copy the contents of `config.example.js`. Then, add your own API key:

```javascript
const config = {
    API_KEY: 'YOUR_API_KEY_HERE'
};
```

3. Open `index.html` in your browser to run and experience the application locally.

## License

This project is licensed under the MIT License.
