# 📧 Portfolio Contact API

**Stack moderne: Express.js + Resend + AJAX**  
Zéro redirection, zéro FormSubmit, solution de qualité production.

## ✨ Avantages

- ✅ **Pas de redirection** - Réponse JSON instantanée
- ✅ **CORS enabled** - Fonctionne depuis n'importe quel domaine
- ✅ **Email professionnel** - Via Resend (utilisé par Vercel, Stripe, etc.)
- ✅ **Honeypot spam protection** - Protection intégrée
- ✅ **HTML emails** - Templates pros avec branding
- ✅ **Confirmation automatique** - Email de confirmation au user
- ✅ **Gratuit** - 100 emails/jour avec Resend

## 🚀 Installation rapide

### 1. Obtenir une clé Resend (gratuit)

Allez sur https://resend.com et créez un compte gratuit.  
Vous recevrez une API key dans le dashboard.

### 2. Installer les dépendances

```bash
cd "Mon Site"
npm install
```

### 3. Configurer l'environnement

Copie le fichier `.env.example` en `.env` et complète:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxx  # ← Votre clé Resend
ADMIN_EMAIL=eddy.hamam@gmail.com
NODE_ENV=development
PORT=3000
```

### 4. Lancer le serveur

**Développement** (avec auto-reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 🧪 Tester l'API

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Test Message",
    "message": "Hello!"
  }'
```

Réponse:
```json
{
  "success": true,
  "message": "Message sent successfully. I will get back to you soon.",
  "messageId": "123abc"
}
```

## 📱 Intégration avec le formulaire

Le formulaire HTML utilise automatiquement l'endpoint `/api/contact` en AJAX.  
Aucune modification supplémentaire requise! 

**Fonctionnement:**
1. User remplit le formulaire
2. AJAX envoie les données en JSON
3. Serveur reçoit, valide, envoie l'email
4. Réponse instantanée affichée dans le formulaire
5. **Zéro redirection**

## 🔒 Sécurité

- ✅ Validation côté serveur
- ✅ Protection honeypot (input caché anti-spam)
- ✅ Échappement HTML contre XSS
- ✅ CORS restreint si besoin
- ✅ Rate limiting recommandé en prod

## 📦 Déploiement

### Option 1: Netlify Functions (recommandé)
Netlify exécute automatiquement un backend sans config.

### Option 2: Vercel
Créez un dossier `/api` dans la racine avec le code serverless.

### Option 3: Heroku
```bash
npm run start
```

## 🐛 Dépannage

**"RESEND_API_KEY not set"**  
→ Copier `.env.example` en `.env` et ajouter votre clé

**"Cannot POST /api/contact"**  
→ Vérifier que le serveur est lancé (`npm run dev`)

**Emails ne arrivent pas**  
→ Vérifier la clé Resend dans `.env`  
→ Vérifier le spam de votre email

## 📚 Documentation

- [Resend Docs](https://resend.com/docs)
- [Express Docs](https://expressjs.com/)

---

**Support pour production?** Contactez-moi! Cette config scale jusqu'à plusieurs milliers d'emails/jour.
