
# 🚌 Afficheur de Bus en Temps Réel

Un projet personnel pour afficher en temps réel les prochains bus à un arrêt précis, ainsi qu'une mini-carte montrant la position des bus à proximité (fonctionne avec les bus de la Star à Rennes). 

Ce dashboard fonctionne avec un écran connecté à un **Raspberry Pi** (par exemple un écran 7") et affiche :
- La **liste des prochains bus**, leur destination et le temps estimé avant leur arrivée à votre arret le plus proche.
- Une **mini-carte circulaire** avec la position en temps réel des bus proches de l'arrêt.

---

## 🛠️ Technologies utilisées

- [Vue.js 3](https://vuejs.org/) — pour le développement de l'interface utilisateur
- [Tailwind CSS](https://tailwindcss.com/) — pour un design rapide et responsive
- [Leaflet.js](https://leafletjs.com/) — pour l'affichage de la carte OpenStreetMap
- [Nginx](https://nginx.org/) — pour servir l'application en production
- [Docker Compose](https://docs.docker.com/compose/) — pour le packaging de l'application
- [API Prochains passages Bus](https://data.explore.star.fr/explore/dataset/tco-bus-circulation-passages-tr/api/) — pour récupérer la liste des bus avex les horaires de passage
- [API Position Bus](https://data.explore.star.fr/explore/dataset/tco-bus-vehicules-position-tr/api/) - pour récupérer la position des bus en temps réel

---

## 📁 Structure du projet

```
afficheur-bus/
├── src/
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── views/
│   ├── App.vue
│   ├── main.js
│   └── tailwind.css
├── public/
├── Dockerfile
├── nginx.conf
├── docker-compose.yml
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🚀 Installation & Lancement (développement)

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/ton-utilisateur/afficheur-bus.git
   cd afficheur-bus
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```

4. Ouvrir le navigateur sur [http://localhost:5173](http://localhost:5173)

---

## 🐳 Déploiement avec Docker Compose

1. **Construire et lancer l’application :**
   ```bash
   docker compose up --build -d
   ```

2. Accéder à l'application sur [http://localhost:8080](http://localhost:8080)

3. Pour arrêter l’application :
   ```bash
   docker-compose down
   ```

> 🔧 L’image Docker build l’application Vue.js et la sert via Nginx dans un conteneur unique.

---

## ⚙️ Déploiement sur Raspberry Pi

1. Installer Raspberry Pi OS
2. Installer Docker + Docker Compose :
   ```bash
   curl -sSL https://get.docker.com | sh
   sudo usermod -aG docker pi
   sudo apt install docker-compose
   ```
3. Cloner le projet ou le copier via SCP
4. Lancer :
   ```bash
   docker-compose up --build -d
   ```

5. Pour démarrer automatiquement l'afficheur au boot, configurer Chromium en mode kiosque sur `http://localhost:8080`

---

## 📦 À faire

- [ ] Auto-refresh des données API
- [ ] Gestion des erreurs de réseau
- [ ] Ajout d’un état de chargement
- [ ] Ajout d'une config facile pour changer l'arrêt cible

---

## 🧑‍💻 Auteur

**Romain** — développeur front-end & mobile passionné par les projets connectés utiles au quotidien.

---

## 📝 Licence

Projet open source sous licence [MIT](https://opensource.org/licenses/MIT).