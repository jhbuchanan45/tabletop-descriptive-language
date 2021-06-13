# Tabletop Descriptive Language

## 'not a language'

Aims to offer an API and standarised yaml/json formats for various tabletop game systems, beginning with DND 5e

# Design Goals

- Provide JSON schema definitions for standarised description of elements (e.g. tokens, classes, etc. )
- Accept input and offer output of YAML/JSON for components
- Expose methods to get and automatically calculate 'derived' token properties according to game system (e.g. Calculating skill check bonuses)
- Automatically attempt to resolve references (dynamically) to shared details (e.g. class, spells, items, etc. )
- Simple, properly documented and typed API, with minimal configuration and options available

All content relating to DND should be permitted in the OGL v5
