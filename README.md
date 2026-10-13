# Grupo Mais Saúde: landing page

Site do Grupo Mais Saúde (Lorena/SP), rede credenciada de descontos em saúde. Os convênios passam no topo como a garrafa do catálogo Milão: o cartão gira, a especialidade troca e o botão **Marcar** abre o WhatsApp (12) 3199-4242 com a mensagem pronta.

**No ar:** https://trheem.github.io/grupo-mais-saude/

## Editar conteúdo

Tudo fica em [`assets/js/data.js`](assets/js/data.js):

- `CONVENIOS`: especialidades (nome, grupo do filtro, ícone, frase curta). A contagem "16 especialidades" é calculada.
- `HERO`: quais convênios passam no topo e a cor do fundo de cada um.
- `BENEFITS`: os 6 cartões da rolagem horizontal.
- `LOJAS`: lojas conveniadas.
- `MONTHLY`, `WHATSAPP`, `ADDRESS`: preço, número e endereço. O preço também aparece escrito no `index.html` (topo, plano, passo 2 e dúvidas).

Depois de editar, faça commit e push: o GitHub Pages publica sozinho em ~1 minuto.

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
| `assets/js/main.js` | Convênios no topo, filtros, rolagens, WhatsApp |
| `assets/js/hero3d.js` | Cubos 3D da cruz do logo (Three.js, carregado depois) |
| `assets/fonts/` | Big Shoulders Display e Figtree (woff2, SIL OFL, via Fontsource 5.3.0) |
| `assets/vendor/` | GSAP 3.15.0 (+ScrollTrigger, SplitText, Flip, do npm) e Three.js r169 servidos pelo próprio site |

## Segurança e desempenho

- Content-Security-Policy sem scripts nem estilos inline; zero requisições a terceiros fora o mapa do Google (liberado só para `google.com`).
- Links externos com `rel="noopener noreferrer"`; mensagens do WhatsApp com `encodeURIComponent`; dados renderizados com escape.
- Cena 3D só carrega depois da página pronta e pausa fora da tela; a troca automática pausa no mouse, no foco, fora da tela e no botão de pausa.
- Respeita `prefers-reduced-motion` (sem cortina de entrada, sem autoplay, sem cubos flutuando).
- Lighthouse mobile (12/10/2026): Acessibilidade 100, Boas práticas 100, SEO 100.

## Pendências para o cliente confirmar

- Logo: `index.html` usa um vetor redesenhado a partir do Instagram. Se houver o arquivo original (SVG/PNG), substitua.
- Bairro: os posts dizem "Centro", o Google Maps mostra "Nova Lorena" para Rua Barão da Bocaina, 308.
- Lista completa de lojas conveniadas (o post mostra só as 4 primeiras) e o que é o "carro pet".
- Quem entra como dependente e o que a assistência funeral cobre.
- Nomes dos médicos dos posts estão cortados nas capturas; por isso o site mostra só as especialidades.
