# GeriForecast (prototype)

Klikbaar prototype van GeriForecast. Draait volledig op **synthetische data** en is niet bedoeld voor productie.

## Starten

Vereist Node.js 20.9 of hoger.

```bash
npm install
npm run dev
```

Open daarna http://localhost:3000 (doorverwijzing naar `/forecast`).

## Scripts

| Script              | Doel                    |
| ------------------- | ----------------------- |
| `npm run dev`       | Ontwikkelserver         |
| `npm run build`     | Productiebuild          |
| `npm start`         | Productiebuild serveren |
| `npm run lint`      | ESLint                  |
| `npm run typecheck` | TypeScript-controle     |

## Structuur

- `src/app/` – Next.js App Router-pagina's (`/` → `/forecast`)
- `src/components/forecast/` – overzichtsscherm en grafiek
- `src/lib/synthetic-data.ts` – deterministische synthetische prognosedata per regio

Stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript.
