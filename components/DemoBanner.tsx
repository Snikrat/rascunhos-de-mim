import { isConfigured } from "@/lib/config";

export default function DemoBanner() {
  if (isConfigured) return null;
  return <p className="demo-banner">modo demonstração: posts de exemplo até o Supabase ser configurado</p>;
}
