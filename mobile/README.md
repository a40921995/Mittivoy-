# MITTIVOY — Mobil Ilova (React Native & Expo)

Ushbu papka MITTIVOY bolalar kiyimlari do‘koni uchun Android va iOS native mobil ilovasi manba kodlarini o‘z ichiga oladi.

## Texnologiyalar
- React Native
- Expo SDK 52+
- TypeScript
- Expo Notifications (Push bildirishnomalar)
- Expo SecureStore (Xavfsiz ma’lumot saqlash)
- EAS Build (Cloud APK & IPA build)

## O‘rnatish va Ishga Tushirish

1. Qaramliklarni o‘rnatish:
```bash
npm install
```

2. Mahalliy sinov (Expo Go yoki Emulator):
```bash
npx expo start
```
QR-kodni Android yoki iPhone telefoningizdagi Expo Go ilovasi orqali skanerlang.

## Android va iPhone uchun Build Tayyorlash (EAS Build)

### 1. Android APK (Sinov uchun to‘g‘ridan-to‘g‘ri o‘rnatiladigan fayl):
```bash
eas build --platform android --profile preview
```
Ushbu buyruq yuklab olinadigan `.apk` faylini yaratadi. Uni istalgan Android telefonga o‘rnatib sinab ko‘rish mumkin.

### 2. Android Google Play uchun (.aab):
```bash
eas build --platform android --profile production
```

### 3. iPhone (iOS Simulator yoki TestFlight):
```bash
eas build --platform ios --profile preview
```

### 4. Apple App Store uchun:
```bash
eas build --platform ios --profile production
```
