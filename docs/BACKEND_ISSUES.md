# Bugs no Backend (loja-discos-api) — para reportar

Inconsistências entre o backend, o spec OpenAPI e o comportamento real, descobertas em auditoria do front × swagger.

## 1. View SQL `vreceitadetalhada` quebrada — HTTP 400 permanente

**Endpoint:** `GET /relatorios/receita-detalhada?ano={n}&mes={n}`

**Resposta atual:**
```json
{"Erro":"JDBC exception executing SQL [...] [Unknown column 've1_0.receitaGenero' in 'field list'] [n/a]; SQL [n/a]"}
```

A view `vreceitadetalhada` (mapeada pela entidade `VReceitaDetalhada`) não tem a coluna `receitaGenero` que a entidade JPA espera. Acontece independente dos parâmetros — qualquer chamada com `ano`/`mes` válidos retorna 400.

**Fix esperado:** recriar a view incluindo a coluna `receitaGenero`, ou remover o campo da entidade.

## 2. Spec OpenAPI desatualizado para respostas de `/criar` e `DELETE`

**Endpoints afetados:** Todos os `POST /{recurso}/criar` e `DELETE /{recurso}/{id}` (artistas, generos-musicais, canais-venda, enderecos, clientes, discos, vendas, compras).

**Spec promete:**
```yaml
responses:
  "200":
    content:
      "*/*":
        schema: { type: string }
```

**Backend retorna:** HTTP 201/200 com body vazio (0 bytes).

Isso fazia clients tiparem o retorno como `string` e o `JSON.parse` ou validação Zod falhar com "expected string, received undefined". O frontend foi adaptado para aceitar body vazio (`z.unknown()`), mas o ideal é alinhar o spec ou o backend retornar a mensagem prometida.

**Sugestões:**
- Opção A: backend passa a retornar `{ id: number }` em criar para o cliente conseguir resolver o ID sem precisar relistar.
- Opção B: ajustar o spec para descrever HTTP 201 sem corpo (`responses: "201": { description: "Created" }`).

## 3. Inconsistência no nome da chave id em `/canais-venda`

| Endpoint | Campo retornado |
|---|---|
| `GET /canais-venda/lista` | `idCanalVenda` |
| `GET /canais-venda/{id}` | `canalVendaId` |
| `PUT /canais-venda/atualizar` | `canalVendaId` |

A entidade `CanalVendaEntity` usa `idCanalVenda` enquanto o DTO `ResponseCanalVendaDTO` usa `canalVendaId`. O `/lista` parece serializar a entidade direto, em vez do DTO.

**Fix esperado:** padronizar para `canalVendaId` (alinhar com os outros recursos: `clienteId`, `discoId`, `artistaId`, etc).

## 4. Backend serializa campos `Optional` vazios como `null`

Backend Spring serializa `Optional<X>` vazio como `null` em vez de omitir a chave. Isso quebra clients que tratam o schema como "opcional = undefined apenas".

Exemplos comuns:
- `custosAdicionais: null`
- `custoDisco: null`
- `encarte: null`
- `frete: null`

**Workaround no front:** o cliente HTTP agora roda `stripNulls` em todas as respostas antes do parse Zod.

**Sugestão:** configurar Jackson com `@JsonInclude(Include.NON_NULL)` no `application.properties` ou nas classes DTO para omitir nulls da serialização.

## 5. Chave de erro `"Erro"` (E maiúsculo)

Erros do backend retornam `{"Erro": "..."}`. Convenções HTTP/REST geralmente usam `error` (minúsculo) ou `message`. O front foi adaptado para aceitar a chave atual, mas seria bom padronizar.
