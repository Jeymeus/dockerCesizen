# CesiZen – Application Web Mobile-First

CesiZen est une application web développée avec **Vue.js (Vite)** côté frontend et **Express.js** côté backend. Elle propose un module d'information, de gestion des comptes utilisateurs, et un tracker d'émotions.

---

## 🔧 Prérequis

- Node.js **v20.10.0** minimum recommandé
- npm (inclus avec Node.js)
- Git pour cloner le dépôt

---

## 📦 Clonage du projet

```bash
git clone https://github.com/Jeymeus/cesizen.git
cd cesizen
```

---

## ⚙️ Configuration `.env`

Créer un fichier `.env` à la racine avec les variables suivantes :

```env
PORT=3000
JWT_SECRET=ton-secret-ultra-solide-et-invisible
VITE_API_URL=http://localhost:3000/api
```

> 💡 Vous pouvez adapter les valeurs si nécessaire :
> - `PORT` : port utilisé par l’API (ex : 3000, 4000...)
> - `JWT_SECRET` : chaîne secrète pour signer les tokens (ex : 64 caractères aléatoires)
> - `VITE_API_URL` : doit correspondre à l’URL et au port de l’API

---

## 📥 Installation des dépendances

### 1. Backend (API Express.js)

```bash
cd api
npm install
```

### 2. Frontend (Vue 3 + Vite)

```bash
cd ..
npm install
```

---

## ▶️ Lancement en développement

### Lancer l’API (Express.js)

```bash
cd api
npm run dev
```

### Lancer le frontend (Vue 3 + Vite)

```bash
cd ..
npm run dev
```

L'application sera disponible sur : [http://localhost:5173](http://localhost:5173)

---

## 🧪 Tests unitaires

L’API Express.js utilise `vitest` pour les tests unitaires.

```bash
cd api
npm run test
```

Test implémenté : `createEmotion()` dans `tests/emotionController.test.js`.

---

## 🛠️ Commandes utiles

### Backend

- `npm run dev` : lancer l’API Express.js avec `nodemon`
- `npm run test` : exécuter les tests avec `vitest`

### Frontend

- `npm run dev` : lancer l’app Vue 3 avec Vite
- `npm run build` : générer la version de production

---

## ✨ Auteur

Développé dans le cadre du projet étudiant CesiZen  
© [Jeymeus](https://github.com/Jeymeus)


Test