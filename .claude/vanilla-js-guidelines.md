# Plain Vanilla JS Guidelines
- Stick to Native Technologies: Use plain HTML, CSS, and JavaScript without any frameworks, build tools, or transpilers.
- Modular Design with Web Components: Build reusable UI elements as Web Components (custom elements, shadow DOM, and HTML templates) to encapsulate logic, markup, and styles.
- Leverage Native ES Modules: Organize code using ES modules (via `<script type="module">`) so that dependencies load natively without a bundler.
- Employ Modern CSS Techniques: Use modern CSS (flexbox, grid, custom properties) for layout and styling—avoid preprocessors by relying on native CSS capabilities and scoped styles (using shadow DOM or selector naming conventions).
- Choose the Appropriate Architecture:
  - For content-driven sites, use a multi-page approach with semantic HTML for better SEO and accessibility.
  - For interactive applications, build a SPA using client-side (hash-based) routing and careful state management.
- Keep It Simple and Maintainable: Favor a minimalistic, zero-build setup to reduce complexity and maintenance overhead. Emphasize clarity, direct DOM updates, and responsible state management.
- Ensure Security and Performance: Sanitize user input to prevent XSS and update only the necessary DOM elements to keep the application responsive and lean.