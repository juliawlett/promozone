# PromoZone — V1 de curadoria manual

## Como abrir

Com o Node.js instalado, abra um terminal nesta pasta e execute:

```powershell
node server.js
```

Depois acesse `http://localhost:4173` no navegador. O pequeno servidor local consulta o Mercado Livre sem expor nenhuma credencial.

O painel consulta a API do Mercado Livre Brasil, filtra os resultados, exibe as fotos dos anúncios e monta uma fila local para você copiar e publicar manualmente no canal PromoZone. Em algumas conexões, o Mercado Livre bloqueia busca sem credencial; nesse caso, informe o Token de acesso da API em Configurações. O login no Portal do Afiliado continua necessário apenas para gerar os links de comissão.

Os dados ficam apenas no navegador. Em Configurações, informe a **Etiqueta do Afiliado Mercado Livre** usada no Linkbuilder. Para cada oferta, use **Preparar no Linkbuilder**: o painel copia a URL do produto e abre o gerador oficial. Confirme a etiqueta, gere o link e cole-o no campo da oferta; só esse link rastreia a comissão por produto.

Se o catálogo não estiver acessível, o painel mostra dois exemplos somente para que você possa testar o fluxo de aprovação; eles não devem ser publicados.
