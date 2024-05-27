# PURCHASE SYSTEM

## Problema

Trabalho em uma empresa onde atuo na função de financeiro e de suprimentos. Mapiei um atraso desnecessário na aprovação de pedidos de compras devido ao canal de comunicação utilizado (e-mail). Atualmente ocorre da seguinte forma: um solicitante envia um pedido de compra via e-mail para a diretora (responsável única pela aprovação de compras) com o comprador em cópia (no caso eu). Aguardo o retorno com um ok dessa diretora para iniciar o processo de cotação. Pelo fato da diretora estar envolvida em todas as operações da empresa, sua caixa de e-mail tem um fluxo bastante intenso de entradas e, mesmo com os filtros que se consegue realizar uma melhor organização dessas entradas, alguns pedidos de compras passam despercebidos.

## Solução

Para seguir com fluxo de compras desenhado sem gargalos e, consequentemente, ocasionando atrasos, uma aplicação soluciona esse problema relatado. Segue abaixo o início do fluxo do processo de compras:

![Fluxo do processo de compras atual]([https://exemplo.com/logo.png](https://drive.google.com/file/d/1HrKJYnTgv7YjAvjrTsQOoQVhjvWU2OfX/view?usp=sharing))

Para ganhar agilidade no tempo de aprovação dos pedidos pensei em:

- O autorizador receber uma notificação a cada criação de novo pedido;
- Estipular uma KPI para controlar o tempo de retorno de cada aprovação (Ex.: meta de até 72h de retorno)

Seguindo o padrão do Domain-Driven-Design (DDD), separei em dois domínios:

- Employee
- Order

Utilizando o RBAC, dividi o **Employee** em três funções - Requester, Authorizer e Purchaser - e concedendo permissões diferentes a cada função.

E para as notificações, segui o Domain Events do DDD para atuar de forma desacoplada como um microsserviço.
