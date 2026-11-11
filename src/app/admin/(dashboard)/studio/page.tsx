import { StudioSettingsForm } from "@/components/admin/StudioSettingsForm";
import { getStudioInfo } from "@/lib/studio";

export const dynamic = "force-dynamic";

export default async function AdminStudioPage() {
  const info = await getStudioInfo();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Studio</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Indirizzo, link Google Maps e orari di apertura — aggiornati sul sito
          pubblico (Contatti e footer).
        </p>
      </div>
      <StudioSettingsForm initial={info} />
    </div>
  );
}
