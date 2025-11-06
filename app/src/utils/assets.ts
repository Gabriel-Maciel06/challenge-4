// Utilitário para resolver URLs de imagens empacotadas pelo Vite a partir do nome do arquivo.
// Isso permite que a gente mantenha caminhos simples (ex: "/src/assets/img/user1.jpg" ou apenas
// "user1.jpg") no JSON e, ainda assim, gere uma URL válida no build.

// Mapeia todos os arquivos dentro de src/assets/img/* para a URL final (eager para já resolver em tempo de build)
const avatarMap = import.meta.glob("../assets/img/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const FALLBACK = "/vite.svg"; // existe em public/, evita 404 em produção

/**
 * Resolve a URL de um avatar informado em JSON ou props.
 * Aceita formatos como:
 *  - "/src/assets/img/user1.jpg"
 *  - "src/assets/img/user1.jpg"
 *  - "user1.jpg"
 * Retorna uma URL válida gerada pelo Vite ou um fallback.
 */
export function resolveAvatar(input?: string): string {
  if (!input) return FALLBACK;

  // Extrai somente o nome do arquivo
  const filename = input.split("/").pop() || input;
  const key = `../assets/img/${filename}`;

  return avatarMap[key] ?? FALLBACK;
}
