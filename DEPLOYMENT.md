# 🚀 Déployer sur Vercel en 5 minutes

## Étape 1: Créer un compte Vercel
1. Allez sur https://vercel.com/signup
2. Cliquez "Sign up with GitHub" (OU "Sign up with Email")
3. Confirmez votre email

## Étape 2: Importer votre projet

**Vous avez 2 options:**

### Option A: Via GitHub (Recommandée - Déploiement auto)
1. Poussez votre code sur GitHub:
   ```powershell
   git remote add origin https://github.com/votre-username/mon-site
   git push -u origin main
   ```
2. Sur https://vercel.com/import
3. Cliquez "Import Git Repository"
4. Connectez-vous à GitHub et sélectionnez votre repo `mon-site`
5. Vercel importe automatiquement. Cliquez **Deploy**

### Option B: Via CLI (Direct)
1. Installez Vercel CLI:
   ```powershell
   npm install -g vercel
   ```
2. Dans le dossier "Mon Site", tapez:
   ```powershell
   vercel
   ```
3. Authentifiez-vous et suivez les prompts
4. À la fin: **Votre site est live!**

## Étape 3: Configurer les variables d'environnement

**⚠️ CRITIQUE - Sans ça, les emails ne marcheront pas!**

1. Allez sur https://vercel.com/dashboard
2. Cliquez sur votre projet
3. Onglet **Settings** → **Environment Variables**
4. Ajoutez ces 2 variables:

   ```
   RESEND_API_KEY = re_xxxxx (votre clé Resend)
   ADMIN_EMAIL = eddy.hamam@gmail.com
   ```

5. Redéployez:
   ```powershell
   vercel --prod
   ```

## Étape 4: Récupérer votre clé Resend (si vous l'avez pas)

1. Allez sur https://resend.com/signup
2. Créez un compte gratuit
3. Dashboard → **API Keys**
4. Copiez votre clé (commence par `re_`)
5. Collez-la dans Vercel Settings

## ✅ C'est fini!

Votre site est live sur:
```
https://mon-site.vercel.app
```

Testez le formulaire - ça marche! 🎉

---

## 🔄 Après: Déploiement automatique

À chaque `git push`:
```powershell
git add .
git commit -m "Latest changes"
git push
```

Vercel redéploiera **automatiquement** en 30 secondes.

---

## 🆘 Problèmes?

- **"Cannot POST /api/contact"** → Vérifier que les variables d'environnement sont ajoutées et redéployer
- **Les emails ne s'envoient pas** → Vérifier la clé Resend ou activer votre email sur Resend
- **Site ne s'affiche pas** → Vercel redéploie. Attendre 1-2 min.

**Contact support Vercel** si vraiment bloqué: https://vercel.com/help
