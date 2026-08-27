# Project Rules

## Documentation examples

- When a documentation example needs controls or supporting UI beyond the component being documented, prefer existing components from this repository instead of rebuilding them with custom HTML and CSS. Only create a custom control when no suitable repository component exists, and briefly document why.
- Keep each example's heading, explanatory copy, notes, controls, and rendered demo inside the same `<card>` block. Only the page title, frontmatter summary, and generated API reference may sit outside example cards.
- Do not add large fixed or minimum heights to documentation demos just to reserve room for a teleported popper, dialog, or other overlay. Overlay components must layer over the page while the closed demo stays content-sized.
