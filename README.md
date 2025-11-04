# BookingQu

Aplikasi booking tiket bioskop yang dibangun dengan Astro, React, TypeScript, dan TailwindCSS.

## 🎬 Fitur Utama

### Online Booking
- **Registrasi & Login**: Sistem autentikasi dengan email/password atau Google SSO (simulasi)
- **Pilih Studio**: 5 studio dengan kapasitas 20 kursi masing-masing
- **Pilih Kursi**: Interface interaktif untuk memilih kursi (bisa lebih dari 1)
- **QR Code**: Generate QR code untuk validasi masuk studio
- **My Tickets**: Lihat semua booking dengan QR code

### Offline Booking (Kasir)
- **Input Data Pelanggan**: Form untuk data pelanggan
- **Booking Langsung**: Booking tanpa perlu login
- **QR Code**: Generate QR code sama seperti online booking
- **Print Ticket**: Akses ke halaman ticket untuk print

## 🚀 Tech Stack

- **Frontend Framework**: [Astro](https://astro.build/) v5.15.3
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Context API
- **Data Persistence**: LocalStorage

## 📦 Instalasi

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Halaman Utama

1. **Home** (`/`) - Daftar studio dengan availability
2. **Login** (`/login`) - Halaman login
3. **Register** (`/register`) - Halaman registrasi
4. **Booking** (`/booking/[studioId]`) - Pilih kursi
5. **Booking Success** (`/booking-success`) - Konfirmasi & QR code
6. **My Tickets** (`/my-tickets`) - Daftar booking user
7. **Cashier** (`/cashier`) - Interface kasir untuk offline booking

## 💾 LocalStorage Keys

- `cinema_users` - Daftar user
- `cinema_studios` - Data studio
- `cinema_bookings` - Daftar booking
- `cinema_current_user` - User yang sedang login

## 🔐 Autentikasi

### Mock Google SSO
Simulasi login dengan Google menggunakan data:
```javascript
{
  email: 'demo@gmail.com',
  name: 'Demo User (Google)'
}
```

### Session Management
- Session disimpan di localStorage
- Auto-redirect ke login jika belum authenticated
- Logout menghapus session

## 🎯 Cara Penggunaan

### Online Booking:
1. Register atau login
2. Pilih studio dari home page
3. Pilih kursi yang diinginkan (bisa lebih dari 1)
4. Konfirmasi booking
5. Dapatkan QR code
6. Tunjukkan QR code saat masuk studio

### Offline Booking (Kasir):
1. Buka halaman `/cashier`
2. Input data pelanggan
3. Pilih studio
4. Pilih kursi
5. Konfirmasi booking
6. Print atau tampilkan QR code

## 📄 License

This project is created for Peruri Digital Frontend Engineer Coding Challenge
