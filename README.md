# Imagem Centauro

Este é um aplicativo de geração de arte abstrata modernista que funciona inteiramente no navegador, sem necessidade de API externa.

## Deploy no Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/seu-usuario/seu-repositorio)

### Configurações de Build

- **Build Command:** `npm run build`
- **Publish Directory:** `dist`

## Funcionalidades

- **Geração local de imagem Centauro** com qualidade configurável (até 1200px)
- **Upload e composição de imagens pessoais** com controles avançados
- **Distorção e transformação de imagens** (escala, rotação, posição)
- **Efeitos especiais** (onda, torção, ripple, alongamento)
- **Controles de transparência e blend modes** (multiply, screen, overlay, etc.)
- **Controles manuais avançados** para todos os parâmetros criativos
- **Paleta de cores expandida** com 20+ cores e 5 temas pré-definidos
- **Seleção personalizada de cores** com interface visual intuitiva
- **Preview em tempo real** das configurações escolhidas
- **Armazenamento persistente** das imagens geradas
- **Interface refinada** para criar e baixar obras únicas
- **Histórico de criações** mantido no navegador

## Tecnologias Utilizadas

- React 19
- TypeScript
- Vite
- Canvas API para geração de imagens
- localStorage para persistência de dados

## Como Usar

1. **Modo Rápido**: Clique em "Gerar Aleatório" para criar automaticamente
2. **Modo Personalizado**: Use o painel de controles para ajustar:
   - Número de elementos (5-60)
   - Resolução (600px a 1200px)
   - Tipo de composição (horizontal/vertical/radial)
   - Textura do papel (cru/reciclado/envelhecido)
   - Paleta de cores personalizada
   - Upload de imagem com controles avançados de distorção
   - Controles avançados (opacidade, espessura, etc.)
3. Clique em "Gerar com Configurações" para criar sua obra
4. **Edição Pós-Geração**: Após gerar, clique em "Editar Imagem" para ajustar a imagem uploaded na composição final
5. Visualize os detalhes da obra gerada
6. Baixe a imagem como PNG
7. Acesse o histórico de criações no painel "Arquivo Recente"