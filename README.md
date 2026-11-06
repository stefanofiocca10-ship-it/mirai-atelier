# Mirai Tattoo & Piercing Atelier

Sito Next.js 14 (App Router) + Prisma SQLite + NextAuth, pronto per server Linux Aruba.

## Simulazione offline (locale)

Dopo aver installato le dipendenze **una volta** (`npm install`), puoi avviare il sito in locale senza server remoto.

### Windows (doppio clic)

- `simulate.bat` → build + avvio production locale  
- `simulate.bat dev` → modalità sviluppo con hot reload  

### Da terminale

```bash
# Prima volta
npm install

# Simulazione veloce (dev, consigliata in prova)
npm run simulate:dev
# oppure
npm run offline

# Simulazione come in produzione (build + start)
npm run simulate
# oppure
npm run offline:prod
```

Apri:

- Sito: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Credenziali demo (da `.env`):

- Email: `admin@miraiatelier.it`
- Password: `MiraiAdmin2024!`

Lo script:

1. crea/aggiorna il database SQLite locale  
2. inserisce categorie e prodotti demo  
3. avvia Next.js su `localhost:3000`  

> WhatsApp / Instagram / telefono funzionano solo se il dispositivo ha rete; il sito in sé resta navigabile offline dopo il primo avvio (font già scaricati da `next/font`).

### Linux / Aruba

```bash
chmod +x simulate.sh
./simulate.sh       # production locale
./simulate.sh dev   # development
```

## Contatti integrati

- WhatsApp: +39 393 288 0540  
- Telefono fisso: +39 0324 208899  
- Instagram: [@miraitattoopiercingatelier](https://www.instagram.com/miraitattoopiercingatelier/)

## Deploy Aruba (PM2)

```bash
npm ci
cp .env.example .env   # configura NEXTAUTH_SECRET e URL
npm run db:setup
npm run build
pm2 start ecosystem.config.js
pm2 save
```

Docker: `docker build -t mirai-atelier . && docker run -p 3000:3000 -v mirai-db:/app/prisma -v mirai-uploads:/app/public/uploads mirai-atelier`
