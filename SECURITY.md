# 🔒 Güvenlik Rehberi

Bu dosya, Bedvan projesinin güvenlik ayarlarını ve en iyi uygulamalarını açıklar.

## 🚨 Kritik Güvenlik Notları

### 1. Ortam Değişkenleri
- **ASLA** `config.env` dosyasını GitHub'a yüklemeyin
- Tüm API anahtarlarını ve şifreleri ortam değişkenlerinde saklayın
- `.gitignore` dosyasında `config.env` olduğundan emin olun

### 2. API Anahtarları
Aşağıdaki anahtarları mutlaka değiştirin:

#### MongoDB
```env
DATABASE=mongodb+srv://kullaniciadi:yeni_sifre@cluster.mongodb.net/veritabani
DATABASE_PASSWORD=yeni_sifre
```

#### JWT Secret
```env
JWT_SECRET=cok_guclu_ve_uzun_bir_secret_key_olusturun_en_az_32_karakter
```

#### Stripe
```env
STRIPE_SECRET_KEY=sk_test_yeni_stripe_secret_key
STRIPE_PUBLIC_KEY=pk_test_yeni_stripe_public_key
```

#### Mapbox
```env
MAPBOX_ACCESS_TOKEN=pk.yeni_mapbox_access_token
```

#### Email
```env
EMAIL_USERNAME=yeni_mailtrap_kullanici
EMAIL_PASSWORD=yeni_mailtrap_sifre
```

## 🛡️ Güvenlik Özellikleri

### 1. Kimlik Doğrulama
- JWT token'ları kullanılır
- Şifreler bcrypt ile hashlenir
- Token'lar belirli süre sonra geçersiz olur

### 2. Rate Limiting
- API istekleri sınırlandırılır (100 istek/saat)
- Brute force saldırılarına karşı koruma

### 3. Input Validation
- XSS koruması
- NoSQL injection koruması
- Input sanitization

### 4. Content Security Policy (CSP)
- Script kaynakları kısıtlanır
- Inline script'ler engellenir
- Harici kaynaklar kontrol edilir

### 5. Helmet.js
- Güvenlik başlıkları otomatik eklenir
- XSS, clickjacking koruması
- MIME type sniffing engellenir

## 🔧 Güvenlik Ayarları

### Production Ortamı
```env
NODE_ENV=production
```

### HTTPS Zorunluluğu
```javascript
// Production'da cookie'ler sadece HTTPS üzerinden
if (process.env.NODE_ENV === 'production') {
  cookieOptions.secure = true;
}
```

### CORS Ayarları
```javascript
// Sadece güvenilir domain'lerden isteklere izin ver
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));
```

## 🚫 Güvenlik Açıkları

### 1. Hardcoded Secrets
❌ **Yanlış:**
```javascript
const secret = 'my-secret-key';
```

✅ **Doğru:**
```javascript
const secret = process.env.JWT_SECRET;
```

### 2. Console.log ile Hassas Bilgi
❌ **Yanlış:**
```javascript
console.log('Password:', user.password);
```

✅ **Doğru:**
```javascript
console.log('User logged in:', user.email);
```

### 3. Error Mesajları
❌ **Yanlış:**
```javascript
res.status(500).json({ error: err.stack });
```

✅ **Doğru:**
```javascript
res.status(500).json({ error: 'Internal server error' });
```

## 🔍 Güvenlik Testleri

### 1. Dependency Audit
```bash
npm audit
npm audit fix
```

### 2. Environment Variables Check
```bash
# config.env dosyasının git'e eklenmediğini kontrol et
git status
```

### 3. API Key Rotation
- Stripe anahtarlarını düzenli değiştirin
- Mapbox token'ınızı periyodik olarak yenileyin
- JWT secret'ınızı güvenlik ihlali durumunda değiştirin

## 📞 Güvenlik İhlali Durumunda

1. **Hemen tüm API anahtarlarını değiştirin**
2. **Veritabanı şifrelerini güncelleyin**
3. **JWT secret'ını değiştirin**
4. **Kullanıcıları bilgilendirin**
5. **Log'ları inceleyin**

## 🔐 Ek Güvenlik Önerileri

### 1. Two-Factor Authentication
- Kullanıcı hesaplarına 2FA ekleyin
- SMS veya authenticator app kullanın

### 2. Password Policy
- Minimum 8 karakter
- Büyük/küçük harf, sayı, özel karakter
- Düzenli şifre değişimi

### 3. Session Management
- Kısa session süreleri
- Otomatik logout
- Concurrent session kontrolü

### 4. Logging
- Güvenlik olaylarını loglayın
- Failed login attempts
- Suspicious activities

---

**Not**: Bu güvenlik rehberi sürekli güncellenmelidir. Yeni güvenlik açıkları keşfedildiğinde bu dosyayı güncelleyin.
