# gql-recipes — Claude Context

## What This Service Is

A NestJS Apollo Federation 2 subgraph for recipe management. Part of the personal-enterprise federated GraphQL layer.

Created from `gql-subgraph-template`. All patterns, structure, and tooling are inherited from that template — refer to its CLAUDE.md for the full reference on patterns, conventions, and setup.

---

## Domains

### `recipes`
Recipe storage and retrieval — ingredients, steps, tags, categories, etc. Document structure is intentionally flexible (variable ingredient formats, optional fields) — MongoDB is the right fit here.

| Detail | Value |
|---|---|
| ID prefix | `RCP-` |
| Collection env var | `RECIPES_COLLECTION` |
| Collection default | `recipes` |

---

## Current State

- Created from `gql-subgraph-template` via GitHub template
- `package.json` name updated to `gql-recipes`
- No domain code written yet — `example/` domain from template is still in place as reference
- **Next**: build `recipes` domain; remove `example/` once it's working
