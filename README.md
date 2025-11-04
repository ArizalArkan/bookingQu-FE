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

## Gallery Photo
<img width="1068" height="661" alt="Screenshot 2025-11-04 at 21 29 31" src="https://github.com/user-attachments/assets/66f6e821-787b-4d0e-bcff-d84fd524e72d" />

<img width="1019" height="642" alt="Screenshot 2025-11-04 at 21 30 11" src="https://github.com/user-attachments/assets/fea2f670-96f4-4d94-b53f-d7b6352268dd" />

<img width="965" height="654" alt="Screenshot 2025-11-04 at 21 30 25" src="https://github.com/user-attachments/assets/3f8df87a-acdd-4f3d-b3de-3936b472c2fb" />

<img width="1040" height="662" alt="Screenshot 2025-11-04 at 21 30 47" src="https://github.com/user-attachments/assets/0fd3f60f-e05c-4f65-9364-38735e0269e7" />

<img width="1108" height="651" alt="Screenshot 2025-11-04 at 21 31 18" src="https://github.com/user-attachments/assets/1848f12f-5222-4e10-b6cc-054209c85bcb" />

<img width="981" height="557" alt="Screenshot 2025-11-04 at 21 31 33" src="https://github.com/user-attachments/assets/a7c49e46-af0a-47ad-b3f8-afa09bc5212e" />

<img width="1000" height="615" alt="Screenshot 2025-11-04 at 21 31 59" src="https://github.com/user-attachments/assets/50c05534-b8e0-4c9d-8b00-61f05a0b9158" />


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
