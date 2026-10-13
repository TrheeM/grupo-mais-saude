# Design: Grupo Mais Saúde

O cartão como objeto central. O topo é escuro como os posts "Convênio" do Instagram (teal profundo, palavra gigante vazada); o resto é papel claro para ler com calma. A cruz de quadrados do logo vira cubos 3D, marcadores e a faixa amarela.

## Cor (papéis fixos)

| Token | Valor | Papel |
|---|---|---|
| `--teal` / `--teal-hi` | `#1f8a85` / `#4cc3b9` | Marca: coração do logo, kickers, ícones |
| `--teal-deep` / `--teal-night` | `#0b3a39` / `#062221` | Blocos fortes: benefícios, contato, rodapé |
| `--red` `--orange` `--yellow` | `#d8312b` `#ec7a2a` `#f3c331` | A cruz do logo. Amarelo é o único CTA (texto escuro) |
| `--paper` / `--paper-2` / `--card` | `#f6f3ec` / `#ece6d9` / `#fffdf8` | Fundo de leitura |
| `--ink` .. `--ink-3` | `#0f2524`, 74%, 66% | Texto |
| `--wa` | `#25d366` | Só ícone/botão do WhatsApp |
| Tema do topo | `--bg-inner/mid/outer`, `--glow` | Por convênio (data.js `HERO`), animado pelo GSAP |

## Tipo

- Display: **Big Shoulders Display** 800–900, caixa alta (ecoa o "CONVÊNIO ORTOPEDISTA" dos posts). Títulos `clamp(2.6rem, 6vw, 5.4rem)`, line-height .9.
- Texto/UI: **Figtree** 400–800 (arredondada como o logo).

## Componentes

- **Cartão** (CSS 3D, frente e verso): grafite, chip dourado, logo, "Convênio" + especialidade + ícone em marca d'água; reflexo que corre com a inclinação.
- **Seletor de convênios**: lista numerada 01–06 com ícone; ativo = fundo claro + ícone amarelo + barra de tempo.
- **Cartão de convênio**: papel, ícone em quadrado teal, nome em display, "Marcar" com ícone do WhatsApp. No celular vira linha compacta.
- **Benefícios**: cartões de vidro sobre teal, número vazado, barra de cor no pé.
- **Lojas**: linhas com nome gigante; hover enche de teal de baixo para cima.
- Raios: 10/16/24px; pílula só em botões e filtros.

## Movimento

- Entrada (GSAP timeline, expo.out): coração do logo se desenha, a cruz monta, cortina sobe; título sobe palavra por palavra de dentro da máscara; cartão gira de -200° no eixo Y com desfoque; cubos 3D explodem de dentro do cartão; palavra gigante entra letra a letra.
- Troca de convênio (a coreografia da garrafa do Milão): fundo e brilho mudam em 1.5s; cartão gira 0→360 (power2.in, 12px de desfoque), troca o conteúdo, 360→720 (back.out 0.7); palavra gigante sai e entra letra a letra; cubos implodem no cartão e explodem girando, luz de contorno troca de cor. Autoplay de 6s com barra, pausável.
- Cursor: cartão inclina (30°/18°) e flutua; cubos fogem do cursor; botões magnéticos.
- Rolagem (ScrollTrigger): títulos sobem linha a linha; convênios caem em cascata com leve rotação X; benefícios fixam e correm na horizontal com medidor; cartão do plano gira até ficar de frente (scrub); preço conta de 0 a 39; linha dos passos se desenha; nomes das lojas sobem; mapa se desenrola; faixa amarela acelera com a velocidade da rolagem.
- Filtro de convênios: GSAP Flip.
- `prefers-reduced-motion`: sem entrada, sem autoplay, sem flutuação, cubos estáticos, trocas instantâneas.

## Origem dos recursos

- Logo, favicon, ícones PNG e `og.png`: vetor redesenhado do logo visto nas capturas do Instagram @maissaudegrupo (não é o arquivo original).
- Ícones de especialidades: traçados no estilo Lucide (ISC) e desenhos próprios.
- Textos e dados: posts do Instagram (convênios, lojas, preço, telefone, endereço, MedCenter, remoção SBV/UTI móvel, assistência funeral).
