// O Mercado Livre gera links de afiliado por produto no Portal do Afiliado.
// Este complemento guarda localmente o link oficial que você colar para cada oferta.
let affiliateProduct = null;
const originalEdit = edit;

edit = function (product) {
  affiliateProduct = product;
  originalEdit(product);
  let box = document.getElementById('affiliateBox');
  if (!box) {
    box = document.createElement('section');
    box.id = 'affiliateBox';
    box.innerHTML = `<p class="affiliate-title">Link de afiliado da oferta</p><label>Link gerado pelo Linkbuilder<input id="productAffiliateLink" placeholder="Cole aqui o link gerado no Portal do Afiliado"></label><div><button class="outline" type="button" id="prepareLinkBuilder">Preparar no Linkbuilder</button><small id="affiliateStatus"></small></div>`;
    $('message').closest('label').before(box);
  }
  const input = $('productAffiliateLink');
  input.value = product.affiliateLink || '';
  updateAffiliateStatus();
  input.oninput = () => {
    affiliateProduct.affiliateLink = input.value.trim();
    persist();
    $('message').value = text(affiliateProduct);
    updateAffiliateStatus();
  };
  $('prepareLinkBuilder').onclick = async () => {
    try { await navigator.clipboard.writeText(product.permalink); } catch (_) {}
    window.open('https://www.mercadolivre.com.br/afiliados/linkbuilder', '_blank', 'noopener');
    $('affiliateStatus').textContent = settings.affiliateTag ? `URL copiada. No Linkbuilder, confirme a etiqueta “${settings.affiliateTag}”, cole a URL e gere o link.` : 'URL copiada. No Linkbuilder, selecione sua etiqueta, cole a URL e gere o link.';
    $('affiliateStatus').className = 'affiliate-ok';
  };
};

function updateAffiliateStatus() {
  const value = $('productAffiliateLink').value.trim();
  const status = $('affiliateStatus');
  if (!value) { status.textContent = 'Sem link de afiliado: a mensagem usará o link normal do produto.'; status.className = 'affiliate-muted'; return; }
  if (value.includes('/social/')) { status.textContent = 'Este é um link de perfil, não serve para comissão por produto. Use o Gerador oficial.'; status.className = 'affiliate-warning'; return; }
  status.textContent = 'Link de afiliado salvo para esta oferta.';
  status.className = 'affiliate-ok';
}

const affiliateCss = document.createElement('style');
affiliateCss.textContent = `#affiliateBox{margin:17px 0;background:#f4f8f2;border:1px solid #dce8dc;border-radius:9px;padding:12px}.affiliate-title{margin:0 0 10px;font-size:11px;font-weight:800;color:#176b4b}#affiliateBox label{margin:0}#affiliateBox div{display:flex;align-items:center;gap:10px;margin-top:9px}#affiliateBox .outline{padding:8px 10px;font-size:10px}.affiliate-muted,.affiliate-warning,.affiliate-ok{font-size:10px;line-height:1.35}.affiliate-muted{color:#758078}.affiliate-warning{color:#a34a2e}.affiliate-ok{color:#176b4b}`;
document.head.appendChild(affiliateCss);
