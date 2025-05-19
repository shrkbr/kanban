import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Aqui você pode adicionar lógica para autenticação, redirecionamentos, etc.
  return NextResponse.next();
}

// Configurar em quais caminhos o middleware deve ser executado
export const config = {
  matcher: [
    // Aplicar a todas as rotas exceto assets estáticos, api e _next
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
