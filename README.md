# BeatDrop - Music

🎧 BeatDrop - Music

Um clone do Spotify feito só com HTML, CSS e JavaScript puro, sem frameworks nem bibliotecas. Tem player completo, busca de músicas do mundo todo, álbuns, fila de reprodução e playlists próprias.

Projeto de estudo, sem qualquer vínculo com o Spotify AB.

✨ Funcionalidades

Player

Play/pause, próxima, anterior (volta ao início se já passou de 3 segundos)
Modo aleatório e repetição (desligado, tudo, uma)
Barra de progresso com seek e controle de volume com mute
Integração com as teclas de mídia do navegador (Media Session API)

Descoberta

Busca por música, artista ou álbum, em tempo real
Navegação por gêneros (Pop, Funk, Sertanejo, MPB, Jazz…)
Tela de álbum com todas as faixas

Biblioteca

Curtir músicas (♥), com lista de "Músicas Curtidas"
Criar, renomear (clique no título) e excluir playlists
Menu "⋯" em cada faixa: adicionar à fila, tocar em seguida, adicionar à playlist, remover da playlist
Fila de reprodução em painel lateral
Adicionar arquivos de áudio do seu computador (lista "Meus Arquivos")

Extras

Layout responsivo (no celular a barra lateral vira abas no topo)
12 faixas de demonstração sintetizadas no próprio navegador
Playlists e curtidas salvas em localStorage
📁 Estrutura
Spotify/
├── index.html   # estrutura da página
├── style.css    # visual (tema escuro, grid, responsivo)
└── script.js    # toda a lógica: player, busca, playlists, fila

🚀 Como rodar
Baixe os três arquivos e deixe-os na mesma pasta.
Abra o index.html no navegador.

⌨️ Atalhos
Tecla	Ação
Espaço	Tocar / pausar
← / →	Voltar / avançar 5 segundos
Shift + ← / →	Faixa anterior / próxima
🧠 Como funciona

Busca: usa a iTunes Search API, que é gratuita e não exige chave. As requisições são feitas via JSONP, o que evita problemas de CORS. As músicas encontradas tocam a prévia de 30 segundos oferecida pela API.
Faixas de demonstração: cada uma é gerada no navegador por um pequeno sintetizador (ondas, baixo, bumbo e chimbal), convertida em arquivo WAV e tocada por um elemento <audio>.
Estado: a fila, o modo aleatório e a repetição ficam em variáveis do script. Curtidas, playlists e as músicas salvas nelas ficam no localStorage.
Arquivos locais: usam URL.createObjectURL e não persistem depois que a página é fechada, porque o navegador não guarda o acesso ao arquivo.

⚠️ Limitações
As músicas da busca tocam apenas 30 segundos. Músicas completas são licenciadas e nenhuma API gratuita as libera.
Não há contas, login nem sincronização entre dispositivos.
Não há letras de músicas.

🔧 Personalização

Usar seus próprios MP3 no lugar das faixas de demonstração: em script.js, adicione src às faixas do array RAW/DEMO, por exemplo src: 'audio/minha-musica.mp3'. Quando src existe, o sintetizador não é usado.

Mudar a cor de destaque: altere --g no início do style.css.

Mudar o país da busca: troque country=BR nas duas URLs do iTunes em script.js.

🗺️ Ideias para evoluir
Reprodução de músicas completas com o Spotify Web Playback SDK ou a YouTube IFrame API
Letras das músicas via API de letras
Reordenar músicas por arrastar e soltar
Transformar em PWA para instalar no celular
Tela de artista

📄 Licença

Uso livre para estudo e portfólio. Capas e prévias de áudio pertencem aos respectivos artistas e gravadoras e são fornecidas pela iTunes Search API.