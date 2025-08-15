# Octobets (Frontend · Angular + Tailwind)

**Octobets** es una plataforma web para organizar **apuestas informales** entre amigos o comunidades, con **autenticación JWT**, **sistema de fichas** y pagos simulados vía **Stripe**.  
Este repositorio contiene el **frontend** desarrollado con **Angular 19**, **Tailwind CSS** y **TypeScript**.

> El **backend (Spring Boot)** está en: [octobets-backend](https://github.com/MezcuaDAW15/octobets).

---

## 📎 Memoria del PFC
La memoria completa del Proyecto Final de Ciclo (que describe tanto backend como frontend) está en el repositorio del backend, dentro de `docs/Memoria.pdf`.

---

## ✨ Características principales
- **Interfaz responsive** con Tailwind CSS.
- **Autenticación JWT** integrada con el backend.
- **Gestión de apuestas**: crear, listar, participar y cerrar.
- **Sistema de fichas**: visualización de saldo, recargas mediante Stripe (modo test).
- **Panel de usuario** con historial económico.
- **Panel de administración** con gestión de apuestas y usuarios.
- **Componentes reutilizables** y navegación mediante Angular Router.
- **Comunicación HTTP** con interceptores para tokens JWT.
- **Animaciones** y transiciones fluidas.

---

## 🧱 Stack
- **Framework**: Angular 19
- **Estilos**: Tailwind CSS
- **Lenguaje**: TypeScript
- **HTTP**: Angular HttpClient + Interceptores JWT
- **Build Tool**: Angular CLI
- **Animaciones**: GSAP

---

## 🚀 Puesta en marcha

### Requisitos
- Node.js 20+
- npm o yarn
- Backend de Octobets corriendo (por defecto en `http://localhost:8080`)

### Instalación y ejecución
```bash
# 1. Clonar repo
git clone https://github.com/MezcuaDAW15/octobets-front.git
cd octobets-front

# 2. Instalar dependencias
npm install

# 3. Configurar entorno
cp src/environments/environment.example.ts src/environments/environment.ts
# Editar URL del backend si es distinta

# 4. Ejecutar en local
npm start
