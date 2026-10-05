# ChennAI Week

![Graphic illustration of Chennai architecture meeting AI-inspired forms.](assets/chennai-ai/city-art.webp)

[Chennai AI Week](https://chennaiweek.com/) brings builders, researchers and communities together to explore artificial intelligence across the city. The wordmark **ChennAI Week** shares the AI in Chennai with artificial intelligence.

[Follow the Luma calendar](https://luma.com/chennaiweek). Dates and programme details will be announced when ready.

## Development

Native HTML, CSS and JavaScript. No framework runtime is required.

```sh
npm run validate
npm run build
npm run serve
```

## Website structure

```mermaid
flowchart LR
  Source[HTML and brand assets] --> Build[Static build]
  Build --> Edge[Cloudflare Workers Assets]
  Edge --> Site[chennaiweek.com]
  Site --> Calendar[Luma calendar]
```

The build includes only the current website assets. Brand assets are available at `/media-kit/`. Space Grotesk is distributed with its SIL Open Font License.
