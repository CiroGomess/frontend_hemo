const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface Donor {
  id: string;
  nomeCompleto: string;
  tipoSanguineo: string;
  dataNascimento?: string | null;
  cidade: string;
  estado: string;
  whatsapp: string;
  whatsappExibicao?: string;
  email?: string | null;
  emailExibicao?: string | null;
  ultimaDoacao?: string | null;
  optInAlertas: boolean;
  consentimentoLGPD: boolean;
  status: string;
  dataCadastro: string;
}

export interface StatsResponse {
  totalDoadores: number;
  doadoresAtivos: number;
  vidasSalvasEstimadas: number;
  doadoresUniversais: number;
  estadosAtivos: number;
  distribuicaoPorEstado: Record<string, number>;
  distribuicaoPorTipo: Record<string, number>;
}

export interface CompatibilityResponse {
  tipoReceptor: string;
  tiposCompativeis: string[];
  estado: string;
  cidade?: string | null;
  totalAptos: number;
  doadoresIds: string[];
}

export interface EmergencyResponse {
  id: string;
  tipo: string;
  quantidade: string;
  paciente: string;
  cidade: string;
  estado: string;
  urgencia: string;
  contato: string;
  detalhes?: string;
  doadoresAptosNotificados: number;
  tiposCompativeis: string[];
  mensagemTexto: string;
  whatsappShareLink: string;
  criadoEm: string;
}

export interface Hemocentro {
  id: string;
  nome: string;
  tipo: string;
  cidade: string;
  estado: string;
  endereco: string;
  telefone: string;
  horario: string;
}

export async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_BASE_URL}/stats`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao buscar estatísticas");
  return res.json();
}

export async function fetchDonors(params?: {
  search?: string;
  tipo?: string;
  estado?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: Donor[];
}> {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.tipo) query.append("tipo", params.tipo);
  if (params?.estado) query.append("estado", params.estado);
  if (params?.page) query.append("page", String(params.page));
  if (params?.pageSize) query.append("pageSize", String(params.pageSize));

  const res = await fetch(`${API_BASE_URL}/doadores?${query.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao carregar doadores");
  return res.json();
}

export async function createDonor(data: {
  nomeCompleto: string;
  tipoSanguineo: string;
  dataNascimento?: string;
  cidade: string;
  estado: string;
  whatsapp: string;
  email?: string;
  ultimaDoacao?: string;
  optInAlertas: boolean;
  consentimentoLGPD: boolean;
}) {
  const res = await fetch(`${API_BASE_URL}/doadores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) {
    throw new Error(resData.detail || "Falha ao cadastrar doador");
  }
  return resData;
}

export async function loginDonor(email: string, whatsapp: string) {
  const res = await fetch(`${API_BASE_URL}/doadores/perfil`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, whatsapp }),
  });
  const resData = await res.json();
  if (!res.ok) {
    throw new Error(resData.detail || "Doador não encontrado");
  }
  return resData.doador as Donor;
}

export async function updateDonor(id: string, updates: Partial<Donor>) {
  const res = await fetch(`${API_BASE_URL}/doadores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const resData = await res.json();
  if (!res.ok) {
    throw new Error(resData.detail || "Falha ao atualizar dados");
  }
  return resData;
}

export async function deleteDonor(id: string) {
  const res = await fetch(`${API_BASE_URL}/doadores/${id}`, {
    method: "DELETE",
  });
  const resData = await res.json();
  if (!res.ok) {
    throw new Error(resData.detail || "Falha ao remover cadastro");
  }
  return resData;
}

export async function checkCompatibility(tipoSanguineo: string, estado: string, cidade?: string): Promise<CompatibilityResponse> {
  const res = await fetch(`${API_BASE_URL}/emergencias/calcular-compatibilidade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipoSanguineo, estado, cidade }),
  });
  if (!res.ok) throw new Error("Erro ao calcular compatibilidade");
  return res.json();
}

export async function sendEmergency(data: {
  tipo: string;
  quantidade: number;
  paciente: string;
  cidade: string;
  estado: string;
  urgencia: string;
  contato: string;
  mensagem?: string;
}): Promise<{ sucesso: boolean; mensagem: string; emergencia: EmergencyResponse }> {
  const res = await fetch(`${API_BASE_URL}/emergencias/solicitar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.detail || "Erro ao registrar solicitação");
  return resData;
}

export async function fetchHemocentros(params?: {
  estado?: string;
  tipo?: string;
  cidade?: string;
}): Promise<Hemocentro[]> {
  const query = new URLSearchParams();
  if (params?.estado) query.append("estado", params.estado);
  if (params?.tipo) query.append("tipo", params.tipo);
  if (params?.cidade) query.append("cidade", params.cidade);

  const res = await fetch(`${API_BASE_URL}/hemocentros?${query.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao listar hemocentros");
  return res.json();
}
