# Bedvan - Tur Rezervasyon Uygulaması

Modern tur rezervasyon uygulaması. Node.js, Express, MongoDB ve Pug template'leri kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- ✅ Kullanıcı kimlik doğrulama (kayıt, giriş, çıkış)
- ✅ Tur göz atma ve rezervasyon
- ✅ Mapbox ile interaktif haritalar
- ✅ Yorum sistemi
- ✅ Stripe ile ödeme entegrasyonu
- ✅ Email bildirimleri
- ✅ Responsive tasarım
- ✅ Bootstrap 5 entegrasyonu

## 🔒 Güvenlik Uyarısı

⚠️ **ÖNEMLİ**: Bu proje yerel geliştirme için tasarlanmıştır. Kişisel bilgilerinizi korumak için:

1. **`config.env` dosyası asla GitHub'a yüklenmemelidir**
2. **`config.env.example` dosyasını şablon olarak kullanın**
3. **Tüm API anahtarlarını kendi hesaplarınızdan alın**

## 🛠️ Kurulum Talimatları

### 1. Projeyi Klonlayın
```bash
git clone <repo-url>
cd bedvan
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın
```bash
# Örnek dosyayı kopyalayın
cp config.env.example config.env

# config.env dosyasını düzenleyin
# Kendi API anahtarlarınızı ekleyin
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm start
```

## 📋 Gerekli API Anahtarları

`config.env` dosyasında aşağıdaki değişkenleri ayarlayın:

### Veritabanı
- `DATABASE`: MongoDB bağlantı dizesi
- `DATABASE_PASSWORD`: MongoDB şifresi

### Kimlik Doğrulama
- `JWT_SECRET`: JWT token'ları için gizli anahtar
- `JWT_EXPIRES_IN`: Token geçerlilik süresi (örn: 90d)
- `JWT_COOKIE_EXPIRES_IN`: Cookie geçerlilik süresi

### Email (Mailtrap)
- `EMAIL_USERNAME`: Mailtrap kullanıcı adı
- `EMAIL_PASSWORD`: Mailtrap şifresi
- `EMAIL_HOST`: SMTP sunucu (sandbox.smtp.mailtrap.io)
- `EMAIL_PORT`: SMTP port (2525)
- `EMAIL_FROM`: Gönderen email adresi

### Ödeme (Stripe)
- `STRIPE_SECRET_KEY`: Stripe gizli anahtarı
- `STRIPE_PUBLIC_KEY`: Stripe genel anahtarı

### Harita (Mapbox)
- `MAPBOX_ACCESS_TOKEN`: Mapbox erişim token'ı

## 🔌 API Endpoint'leri

### Kimlik Doğrulama
- `POST /api/v1/users/signup` - Kullanıcı kaydı
- `POST /api/v1/users/login` - Kullanıcı girişi
- `GET /api/v1/users/logout` - Kullanıcı çıkışı
- `PATCH /api/v1/users/updateMe` - Profil güncelleme
- `PATCH /api/v1/users/updateMyPassword` - Şifre güncelleme

### Turlar
- `GET /api/v1/tours` - Tüm turları getir
- `GET /api/v1/tours/:id` - Belirli turu getir
- `POST /api/v1/tours` - Tur oluştur (sadece admin)
- `PATCH /api/v1/tours/:id` - Tur güncelle (sadece admin)
- `DELETE /api/v1/tours/:id` - Tur sil (sadece admin)

### Yorumlar
- `GET /api/v1/tours/:tourId/reviews` - Tur yorumlarını getir
- `POST /api/v1/tours/:tourId/reviews` - Yorum ekle

### Rezervasyonlar
- `GET /api/v1/bookings/checkout-session/:tourId` - Stripe checkout oturumu oluştur
- `GET /api/v1/bookings` - Tüm rezervasyonları getir (sadece admin)
- `POST /api/v1/bookings` - Rezervasyon oluştur (sadece admin)

## 🛡️ Güvenlik Özellikleri

- JWT tabanlı kimlik doğrulama
- bcrypt ile şifre hashleme
- Rate limiting (API istek sınırlama)
- XSS koruması
- NoSQL injection koruması
- Content Security Policy (CSP)
- Helmet.js güvenlik başlıkları
- Express 5 uyumluluğu

## 🎨 Kullanılan Teknolojiler

- **Backend**: Node.js, Express.js
- **Veritabanı**: MongoDB + Mongoose
- **Kimlik Doğrulama**: JWT
- **Template Engine**: Pug
- **Haritalar**: Mapbox GL JS
- **Ödemeler**: Stripe
- **Email**: Nodemailer + Mailtrap
- **Styling**: Custom CSS + Bootstrap 5
- **Animasyonlar**: CSS + JavaScript

## 🚀 Geliştirme

```bash
# Geliştirme sunucusunu başlat
npm start

# Debug modu
npm run debug
```

## 📁 Proje Yapısı

```
bedvan/
├── controllers/     # Route handler'ları
├── models/         # Mongoose modelleri
├── routes/         # Express route'ları
├── views/          # Pug template'leri
├── public/         # Statik dosyalar
│   ├── css/        # Stil dosyaları
│   ├── js/         # Client-side JavaScript
│   └── img/        # Resimler
├── utils/          # Yardımcı fonksiyonlar
├── dev-data/       # Geliştirme verileri
└── config.env      # Ortam değişkenleri (gitignore'da)
```

## 🔧 Özelleştirme

### Harita Ayarları
Mapbox token'ınızı `config.env` dosyasında `MAPBOX_ACCESS_TOKEN` olarak ayarlayın.

### Ödeme Ayarları
Stripe anahtarlarınızı `config.env` dosyasında ayarlayın:
- `STRIPE_SECRET_KEY`: Test veya canlı gizli anahtar
- `STRIPE_PUBLIC_KEY`: Test veya canlı genel anahtar

### Email Ayarları
Mailtrap veya başka bir SMTP servisi kullanabilirsiniz.

## 🐛 Sorun Giderme

### Harita Yüklenmiyor
- Mapbox token'ınızın doğru olduğundan emin olun
- Browser console'da `window.MAPBOX_TOKEN` değerini kontrol edin

### Ödeme Çalışmıyor
- Stripe anahtarlarınızın doğru olduğundan emin olun
- Test modunda olduğunuzdan emin olun

### Email Gönderilmiyor
- Mailtrap bilgilerinizi kontrol edin
- SMTP ayarlarınızı doğrulayın

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

---

**Not**: Bu proje yerel geliştirme için tasarlanmıştır. Production'a çıkmadan önce güvenlik ayarlarını gözden geçirin.
