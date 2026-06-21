const pageId = document.body.dataset.pageId;
const baseUrl = document.body.dataset.publicBaseUrl;

if (pageId && baseUrl) {
  const track = (eventType, assetId, metadata) => {
    fetch(`${baseUrl}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageId,
        eventType,
        ...(assetId ? { assetId } : {}),
        ...(metadata ? { metadata } : {}),
      }),
    }).catch(() => {});
  };

  document.body.onload = () => track('page_view');

  document.querySelectorAll('.asset-link').forEach((link) => {
    link.addEventListener('click', () => {
      track('asset_click', link.dataset.assetId);
    });
  });

  const cta = document.getElementById('primary-cta');
  cta?.addEventListener('click', () => {
    track('cta_click');
    window.location.href = 'https://example.eve.legal/demo';
  });
}
