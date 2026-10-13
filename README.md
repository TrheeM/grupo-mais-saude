# Grupo Mais Saúde: landing page

Site do Grupo Mais Saúde (Lorena/SP), rede credenciada de descontos em saúde. Os convênios passam no topo como a garrafa do catálogo Milão: o cartão gira, a especialidade troca, e dá para **arrastar o cartão para o lado** (ou usar as setas) para trocar. Cada especialidade abre o WhatsApp (12) 3199-4242 com a mensagem pronta. O site não mostra preço: o valor é passado no WhatsApp.

**No ar:** https://grupomaissaude.mdrify.com/ (Vercel, projeto `site-grupomaissaude`, time Medradas)  
**Espelho:** https://trheem.github.io/grupo-mais-saude/ (GitHub Pages)

## Editar conteúdo

Tudo fica em [`assets/js/data.js`](assets/js/data.js):

- `CONVENIOS`: especialidades (nome, grupo do acordeão, ícone). A contagem "16 especialidades" é calculada.
- `GROUPS`: as áreas do acordeão (Consultas médicas, Exames, Terapias e odonto).
- `HERO`: quais convênios passam no topo e a cor do fundo de cada um.
- `BENEFITS`: os 6 cartões da rolagem horizontal.
- `LOJAS`: lojas conveniadas.
- `WHATSAPP`, `ADDRESS`: número e endereço.

## Publicar

```sh
git push                                   # GitHub + GitHub Pages (~1 min)
vercel deploy --prod --yes --scope medradas  # grupomaissaude.mdrify.com
```

A pasta já está ligada ao projeto `site-grupomaissaude` na Vercel (`.vercel/`, fora do git).

## Rodar localmente

```sh
python3 -m http.server 4321
# abra http://localhost:4321
```

Precisa de servidor (módulos ES não abrem via `file://`).

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Marcação, CSP, SEO e sprite de ícones |
| `assets/css/main.css` | Estilos e tokens |
| `assets/js/boot.js` | Marca `js`/`motion` antes da pintura |
| `assets/js/main.js` | Convênios no topo (giro, arrastar, setas), acordeão, rolagens, WhatsApp |
| `assets/js/hero3d.js` | Cubos 3D da cruz do logo (Three.js, carregado depois) |
| `assets/fonts/` | Big Shoulders Display e Figtree (woff2, SIL OFL, via Fontsource 5.3.0) |
| `assets/vendor/` | GSAP 3.15.0 (+ScrollTrigger, SplitText, do npm) e Three.js r169 servidos pelo próprio site |

## Segurança e desempenho

- Content-Security-Policy sem scripts nem estilos inline; zero requisições a terceiros fora o mapa do Google (liberado só para `google.com`).
- Links externos com `rel="noopener noreferrer"`; mensagens do WhatsApp com `encodeURIComponent`; dados renderizados com escape.
- Cena 3D só carrega depois da página pronta e pausa fora da tela; a troca automática pausa no mouse, no foco e fora da tela, e para de vez quando a pessoa arrasta o cartão, clica nas setas ou num convênio.
- Respeita `prefers-reduced-motion` (sem cortina de entrada, sem autoplay, sem cubos flutuando).
- Lighthouse mobile (12/10/2026, após a v2): Acessibilidade 100, Boas práticas 100, SEO 100.

## Pendências para o cliente confirmar

- Logo: `index.html` usa um vetor redesenhado a partir do Instagram. Se houver o arquivo original (SVG/PNG), substitua.
- Bairro: os posts dizem "Centro", o Google Maps mostra "Nova Lorena" para Rua Barão da Bocaina, 308.
- Lista completa de lojas conveniadas (o post mostra só as 4 primeiras) e o que é o "carro pet".
- Nomes dos médicos dos posts estão cortados nas capturas; por isso o site mostra só as especialidades.
