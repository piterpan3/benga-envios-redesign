Cria um site completo, responsivo e funcional para a empresa BENGA ENVIOS, especializada no transporte aéreo de mercadorias entre Angola e Portugal. Todo o texto da interface, mensagens, formulários e instruções deve estar em português.

OBJETIVO
O site deve apresentar os serviços da empresa, permitir que clientes criem e acompanhem encomendas, pagar por transferência bancária e permitir que administradores gerenciem encomendas e editem as configurações diretamente no painel.

IDENTIDADE E DESIGN
- Nome: BENGA ENVIOS
- Slogan: “O seu mundo, sem limites.”
- Rotas: Angola ↔ Portugal
- Estilo profissional, confiável e moderno, relacionado a transporte aéreo e logística.
- Usar azul-marinho como base, azul vivo para botões e destaques, fundos escuros com bom contraste e tipografia legível.
- Na página inicial, criar uma área principal com imagem relacionada a avião e carga, apresentação clara do serviço e botões para “Fazer nova encomenda” e “Saber mais”.
- Incluir navegação para Início, Sobre nós, Serviços, Preços, Como funciona, Rastrear e Contacto.
- Garantir boa apresentação em computador, tablet e telemóvel; usar botões grandes, formulários fáceis de preencher e mensagens de erro claras.

PÁGINAS PÚBLICAS
1. Início: apresentar a empresa, as rotas Angola–Portugal, os benefícios do serviço e chamadas para ação.
2. Sobre nós: explicar a missão e a atuação da BENGA ENVIOS.
3. Serviços: apresentar transporte de mercadorias e as opções de levantamento ou entrega ao domicílio.
4. Preços: mostrar o preço por peso e as taxas de entrega configuradas abaixo.
5. Como funciona: explicar as etapas desde o envio do pedido até à confirmação do pagamento e entrega.
6. Rastreio: permitir consultar uma encomenda com o código de rastreio.
7. Contacto: apresentar os canais de apoio configurados.
8. Incluir páginas de Política de Privacidade e Termos.

PREÇOS E MERCADORIAS
- Transporte: 12,50 € por quilograma.
- Taxa de entrega em Luanda: entre 4 000 e 15 000 Kz.
- Taxa de entrega fora de Luanda: entre 20 000 e 30 000 Kz.
- Mostrar o cálculo do transporte com base no peso e apresentar as taxas de entrega separadamente.
- Tipos de mercadoria disponíveis: Roupa, Calçado, Eletrónica, Documentos, Alimentos, Produtos diversos e Outros.
- Permitir que o administrador edite preços, taxas e tipos de mercadoria no painel.

APOIO
- Telefone e WhatsApp de apoio: +351931743081.
- Usar o mesmo número nos botões de contacto por telefone e WhatsApp.
- O botão de WhatsApp deve abrir uma conversa com uma mensagem pré-preenchida sobre a encomenda, sem enviar mensagens automaticamente.

ÁREA DO CLIENTE
- Permitir registo, início e fim de sessão seguros.
- Permitir ao cliente gerir os seus dados e moradas.
- Formulário de encomenda com nome, telefone, e-mail, origem, destino, tipo de mercadoria, descrição, peso, número de volumes, modalidade de recebimento, morada de entrega quando aplicável e observações.
- As rotas permitidas são Angola → Portugal e Portugal → Angola.
- Depois do envio, guardar a encomenda com estado “Pendente” e mostrar uma confirmação ao cliente.
- A página “Pagamentos” deve apresentar o histórico das encomendas, valores, método e estado do pagamento.
- Permitir ao cliente acompanhar notificações, enviar pedidos de apoio e consultar o estado das suas encomendas.
- O cliente só pode consultar os próprios dados e encomendas.

PAGAMENTO POR TRANSFERÊNCIA
- Não integrar pagamentos online nem marcar pagamentos como recebidos automaticamente.
- Métodos: transferência bancária.
- Contas de pagamento:
  - Portugal — IBAN: PT50 0193 0000 10507750890 11 — Titular: Rachid Gomes.
  - Angola — NIB: 0040.0000.5256.1892.1014.3 — Titular: Rachid Gomes.
- Depois de o cliente autenticado enviar uma encomenda, mostrar os dados bancários na confirmação e na página “Pagamentos”.
- Mostrar uma referência da transferência no formato “Encomenda #ID” enquanto não existir código de rastreio. Após a aprovação, usar o código de rastreio como referência.
- A encomenda permanece pendente até um administrador confirmar o pagamento.
- Permitir que o cliente envie o comprovativo pelo WhatsApp de apoio.
- Nunca mostrar IBAN, NIB ou outros dados bancários na página pública, para visitantes sem sessão, nem em respostas públicas da API.
- Só disponibilizar os dados bancários a clientes autenticados com uma encomenda válida pendente de pagamento. Não os disponibilizar para encomendas recusadas, canceladas ou já pagas.

RASTREIO E ESTADOS
- Quando o administrador aprovar uma encomenda, gerar um código único no formato BEN-AAAA-000001.
- Permitir consultar o estado público com o código, sem revelar telefone, e-mail ou nome completo do cliente.
- Usar estados de encomenda configuráveis, incluindo Recebida, Em preparação, No armazém, Em trânsito, Chegou ao destino, Em entrega, Entregue e Cancelada.
- Enviar notificações ao cliente quando a encomenda for criada, aprovada ou tiver o estado atualizado.
- Limitar tentativas repetidas de rastreio para evitar abuso.

PAINEL DE ADMINISTRAÇÃO
- Criar um painel protegido, acessível apenas a administradores.
- Permitir listar, aprovar, recusar e atualizar encomendas; exigir motivo ao recusar.
- Permitir gerir clientes, bloquear contas, repor palavras-passe e criar funcionários com permissões limitadas.
- Permitir editar diretamente no site preços, taxas, tipos de mercadoria, telefone, WhatsApp, moradas, métodos e dados bancários, textos, notificações e estados.
- Permitir consultar mensagens de suporte, avaliações e registos de auditoria.
- Funcionários não podem aprovar encomendas, alterar configurações nem gerir utilizadores.
- Não mostrar palavras-passe ou hashes no painel.

SEGURANÇA E QUALIDADE
- Guardar palavras-passe com hash seguro e usar sessões protegidas.
- Validar os dados no servidor, limitar tentativas de início de sessão e proteger ações contra CSRF.
- Escapar texto inserido por utilizadores antes de o apresentar.
- Manter os dados financeiros fora das rotas públicas.
- Persistir encomendas, contas e configurações sem as perder ao reiniciar o servidor.
- Não usar dados fictícios no ambiente real.
- Incluir testes para registo, permissões, criação e aprovação de encomendas, pagamento, rastreio e proteção dos dados bancários.
- Preservar a estrutura e as tecnologias existentes do projeto ao fazer alterações; não substituir a base de dados nem reescrever a aplicação sem necessidade.