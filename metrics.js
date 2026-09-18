// Complemento da V1: métricas locais e link de afiliado global.
let promoMetrics = { copied: 0, published: 0, ...JSON.parse(localStorage.getItem('promozone-v1-metrics') || '{}') };

function savePromoMetrics() { localStorage.setItem('promozone-v1-metrics', JSON.stringify(promoMetrics)); }
function refreshPromoMetrics() {
  const savings = queue.reduce((total, product) => total + Math.max(0, (product.original_price || product.price) - product.price), 0);
  $('metricQueue').textContent = queue.length;
  $('metricCopied').textContent = promoMetrics.copied;
  $('metricPublished').textContent = promoMetrics.published;
  $('metricSavings').textContent = money(savings);
}

const oldRenderQueue = renderQueue;
renderQueue = function () { oldRenderQueue(); refreshPromoMetrics(); };

const metricCss = document.createElement('style');
metricCss.textContent = `.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:-38px 0 65px}.metrics article{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px}.metrics small{display:block;font:9px 'DM Mono';color:var(--green);letter-spacing:.5px}.metrics strong{display:block;font-size:25px;letter-spacing:-1.5px;margin:8px 0 3px}.metrics span{font-size:10px;color:var(--muted)}@media(max-width:650px){.metrics{grid-template-columns:repeat(2,1fr);margin:-25px 0 45px}.metrics article{padding:14px}.metrics strong{font-size:20px}}`;
document.head.appendChild(metricCss);

$('settings').onclick = () => {
  $('channelName').value = settings.channelName;
  $('channelUrl').value = settings.channelUrl;
  $('footer').value = settings.footer;
  $('affiliateTag').value = settings.affiliateTag || '';
  $('mlAccessToken').value = settings.mlAccessToken || '';
  $('template').value = settings.template;
  $('config').showModal();
};

$('save').onclick = () => {
  settings = {
    channelName: $('channelName').value.trim() || defaultSettings.channelName,
    channelUrl: $('channelUrl').value.trim() || defaultSettings.channelUrl,
    footer: $('footer').value.trim(),
    affiliateTag: $('affiliateTag').value.trim(),
    mlAccessToken: $('mlAccessToken').value.trim(),
    template: $('template').value.trim()
  };
  persist();
  $('config').close();
};

$('copy').onclick = async () => {
  await navigator.clipboard.writeText($('message').value);
  promoMetrics.copied += 1;
  savePromoMetrics();
  refreshPromoMetrics();
  $('copy').textContent = 'Copiado ✓';
  setTimeout(() => $('copy').textContent = 'Copiar mensagem', 1400);
};

$('published').onclick = () => {
  promoMetrics.published += 1;
  savePromoMetrics();
  refreshPromoMetrics();
  $('published').textContent = 'Registrada ✓';
  setTimeout(() => { $('published').textContent = 'Marcar publicada'; $('editor').close(); }, 900);
};

refreshPromoMetrics();
