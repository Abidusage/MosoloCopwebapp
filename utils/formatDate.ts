export function formatDate(dateStr?: string) {
  if (!dateStr) return '-';
  try {
    const iso = dateStr.includes(' ') ? dateStr.replace(' ', 'T') : dateStr;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return dateStr;
    const datePart = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const timePart = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} à ${timePart}`;
  } catch (e) {
    return dateStr;
  }
}
