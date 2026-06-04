# gql-recipes

A NestJS Apollo Federation 2 subgraph for recipe management. Part of my personal-enterprise federated GraphQL layer.

---

## Domains

**recipes** — Recipe storage and retrieval: ingredients, preparation steps, tags, categories, and associated metadata. Recipe documents have intentionally flexible structure (variable ingredient formats, optional fields by cuisine or type) — a natural fit for MongoDB.

---

## Setup & Patterns

This service was created from [gql-subgraph-template](https://github.com/Strangebrewer/gql-subgraph-template). Refer to that repo for:

- Project structure and six-file domain pattern
- Local dev setup and environment variables
- JWT auth and MongoDB connection patterns
- Running and testing instructions
