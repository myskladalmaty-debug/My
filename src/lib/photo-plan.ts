// Which photos a product should have after comparing the cabinet with MoySklad.
//
// Every MoySklad photo is uploaded into the cabinet under its MoySklad file name, so the two are
// matched by name. A MoySklad photo is downloaded only when the cabinet has no file of that name
// or MoySklad's copy is newer. A cabinet file whose name MoySklad doesn't have was added by hand
// and stays — except an old first photo that MoySklad has since replaced with a newer one.
// If the manager put a photo first in the cabinet after MoySklad's first photo, it stays first,
// and MoySklad photos older than it are not brought back — only ones added to MoySklad later.

export type CabImage = { id: number; name: string; createdAt: string };
export type MsImage = { filename: string; updated: string };
export type PlanStep = { id: number } | { download: number; fallback?: number };

// MoySklad writes Moscow time without a zone.
export const msTime = (s: string) => Date.parse(String(s || '').replace(' ', 'T') + '+03:00') || 0;

// null — MoySklad has no photos: the cabinet's photos are left as they are.
export function planPhotos(cab: CabImage[], ms: MsImage[]): PlanStep[] | null {
  if (!ms.length) return null;
  const msNames = new Set(ms.map((m) => m.filename));
  const first = cab[0];
  const firstIsOwn = !!first && !msNames.has(first.name);
  const manualFirst = firstIsOwn && Date.parse(first.createdAt) >= msTime(ms[0].updated);
  const fromMs: PlanStep[] = ms.flatMap((m, i): PlanStep[] => {
    const same = cab.filter((c) => c.name === m.filename);
    const fresh = same.find((c) => Date.parse(c.createdAt) + 60000 >= msTime(m.updated));
    if (fresh) return [{ id: fresh.id }];
    if (!same.length && manualFirst && msTime(m.updated) <= Date.parse(first.createdAt)) return [];
    // if the download fails, the old copy is better than no photo
    const fallback = same[0]?.id ?? (i === 0 && firstIsOwn && !manualFirst ? first.id : undefined);
    return [fallback === undefined ? { download: i } : { download: i, fallback }];
  });
  const own = cab.filter((c, i) => !msNames.has(c.name) && (i > 0 || manualFirst)).map((c) => ({ id: c.id }));
  return manualFirst ? [own[0], ...fromMs, ...own.slice(1)] : [...fromMs, ...own];
}
