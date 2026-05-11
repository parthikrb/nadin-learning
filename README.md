# Nadin Learning

Gamified physics and chemistry experiments for nine-year-olds, with Nadin as their guide. Built with Next.js 16 (App Router) + TypeScript + React Three Fiber.

The "why" for every tech choice lives on issue [BAPAA-2](../BAPAA/issues/BAPAA-2) (decision doc).

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:3000  → landing
                # http://localhost:3000/play → hello scene
```

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint (Next.js config) |
| `pnpm typecheck` | `tsc --noEmit`, strict |
| `pnpm test` | Vitest (run with `pnpm test --run` for CI mode) |
| `pnpm format` | Prettier write |
| `pnpm format:check` | Prettier check (CI-friendly) |

## Repo shape

```
/app
  page.tsx              # landing (server)
  /play/page.tsx        # 3D hello scene route (server shell, client canvas)
/components
  HelloScene.tsx        # R3F <Canvas> + Nadin placeholder + ground
/__tests__              # Vitest specs
/public
  /scenes               # .glb assets shipped by ThreeDArtist
  /audio                # voice / sfx
.github/workflows/ci.yml
```

## Asset pipeline

- Source `.glb` files live in `public/scenes/`. They are served as static assets at `/scenes/<name>.glb`.
- Load via drei's `useGLTF` inside a client component:

  ```tsx
  "use client";
  import { useGLTF } from "@react-three/drei";

  export function Nadin() {
    const { scene } = useGLTF("/scenes/nadin.glb");
    return <primitive object={scene} />;
  }
  ```

- Draco compression on by default — drei auto-loads the wasm decoder.
- ThreeDArtist export preset (Blender → glTF 2.0):
  - +Y up, -Z forward
  - Embed textures
  - Draco compression, level 6
  - One `.glb` per logical asset (mesh + materials + animations bundled)
- Mesh budgets (per scene):
  - Character (Nadin) ≤ 30k tris
  - Apparatus / hero prop ≤ 50k tris
  - Environment ≤ 70k tris
  - Total per scene ≤ 150k tris
- Texture budget: ≤ 2048×2048 per material; KTX2 (Basis) when memory pressure hits.

## Performance budget

| Device | Resolution | Target FPS | Floor FPS |
| --- | --- | --- | --- |
| iPad gen 9 (A13) — primary target | 1024×768 landscape, DPR clamped at 1.5× | 60 | 30 |
| Mid-tier laptop (M1 / 2020 i5) | 1440×900 | 60 | 60 |

Soft caps per scene:

- ≤ 80 draw calls
- ≤ 4 dynamic lights (or baked + 1 dynamic)
- ≤ 1 post-process pass on iPad (none preferred for v0)
- Shadow maps off on iPad until measured

Measure with `stats.js` overlay (dev) + Safari remote inspect on a real iPad.

## Privacy posture

No telemetry or third-party data collection on kid sessions until CEO signs off:

- Vercel Analytics and Speed Insights are off.
- No external analytics SDKs.
- No third-party fonts that phone home (we use `next/font` self-hosted Geist).

## CI

GitHub Actions: lint + typecheck + test + build, on every PR and on push to `main`. See `.github/workflows/ci.yml`.

## Hosting

Vercel preview URLs per PR once the repo is linked. See the follow-up issue for wiring Vercel.
