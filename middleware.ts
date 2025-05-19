import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Função de middleware simples
export function middleware(request: NextRequest) {
  // Apenas passa a requisição adiante sem modificações
  return NextResponse.next();
}

// Configurar em quais caminhos o middleware deve ser executado
export const config = {
  matcher: [
    // Aplicar apenas às páginas, excluindo recursos estáticos, API, etc.
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
