import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 mt-auto border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Coluna 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <span className="text-red-500">🩸</span> HemoAlerta
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Plataforma de mobilização e conexão de doadores voluntários com hemocentros em todo o território nacional.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full w-fit">
              <span>🔒</span> Em conformidade com a LGPD (Lei nº 13.709/2018)
            </div>
          </div>

          {/* Coluna 2 */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition">Início</Link></li>
              <li><Link href="/cadastro" className="hover:text-white transition">Quero Doar</Link></li>
              <li><Link href="/rede" className="hover:text-white transition">Rede Nacional</Link></li>
              <li><Link href="/hemocentros" className="hover:text-white transition">Guia de Hemocentros</Link></li>
              <li><Link href="/doadores" className="hover:text-white transition">Painel de Doadores</Link></li>
            </ul>
          </div>

          {/* Coluna 3 */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Urgências</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/emergencia" className="text-red-400 hover:text-red-300 font-bold transition">Solicitar Doação (SOS)</Link></li>
              <li><Link href="/perfil" className="hover:text-white transition">Atualizar Meus Dados</Link></li>
              <li className="text-zinc-500 pt-2">Disque Saúde: 136 (SUS)</li>
            </ul>
          </div>

          {/* Coluna 4 */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Privacidade</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Seus dados telefônicos são preservados sob sigilo e usados estritamente para avisos de necessidade urgente de sangue. Você pode revogar seu consentimento a qualquer momento.
            </p>
            <p className="text-xs text-zinc-500 mt-4">
              © {new Date().getFullYear()} HemoAlerta. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
