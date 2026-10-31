const $ = id => document.getElementById(id);
const brands = window.SMART_SENIOR_VIDEOS;
let selected;
brands.forEach(b => {
  const button = document.createElement('button');
  button.className = 'brand';
  button.innerHTML = `<span class="mark ${b.color}" aria-hidden="true">${b.symbol}</span><span><strong>${b.name}</strong><small>${b.src ? '안내 영상 보기' : '영상 준비 중'}</small></span><span class="arrow" aria-hidden="true">→</span>`;
  button.addEventListener('click', () => { selected = button; location.hash = b.id; });
  $('brands').append(button);
});
function route() {
  const b = brands.find(item => '#' + item.id === location.hash);
  const video = $('video'); video.pause(); video.removeAttribute('src'); video.replaceChildren(); video.load();
  $('home').hidden = !!b; $('lesson').hidden = !b; $('player-status').textContent = '';
  if (!b) {if(selected) selected.focus(); window.scrollTo(0,0); return;}
  $('lesson-title').textContent = b.name + ' 키오스크 사용법';
  $('lesson-desc').textContent = '화면을 보며 천천히 따라 해보세요.';
  $('waiting').hidden = !!b.src; $('player-area').hidden = !b.src;
  if (b.src) {
    video.src = b.src;
    if (b.captions) {const t = document.createElement('track');t.kind='captions';t.srclang='ko';t.label='한국어 자막';t.src=b.captions;t.default=true;video.append(t);}
  }
  window.scrollTo(0,0); $('lesson-title').focus();
}
function home(){if(location.hash)location.hash='';else route();}
$('back').addEventListener('click', home);
$('logo').addEventListener('click',e=>{e.preventDefault();home();});
$('size').addEventListener('click',()=>{const large=document.documentElement.classList.toggle('large');$('size').setAttribute('aria-pressed',String(large));$('size').textContent=large?'기본 글씨로 －':'글씨 더 크게 ＋';});
async function play(){try{await $('video').play();$('player-status').textContent='';}catch{$('player-status').textContent='영상을 재생할 수 없어요. 잠시 후 다시 시도해주세요.';}}
$('play').addEventListener('click',play);
$('pause').addEventListener('click',()=>$('video').pause());
$('restart').addEventListener('click',()=>{$('video').currentTime=0;play();});
$('video').addEventListener('error',()=>{$('player-status').textContent='영상을 불러오지 못했어요. 인터넷 연결을 확인하고 다시 시도해주세요.';});
window.addEventListener('hashchange',route);route();

// 브랜드별 순서 사진 표시
function showStepPhotos() {
  document.getElementById('step-photos')?.remove();

  const brand = window.SMART_SENIOR_VIDEOS.find(
    item => '#' + item.id === location.hash
  );
  if (!brand?.images?.length) return;

  const section = document.createElement('section');
  section.id = 'step-photos';
  section.style.margin = '40px 0';

  const title = document.createElement('h2');
  title.textContent = '사진으로 천천히 따라 하기';
  section.append(title);

  const guide = document.createElement('p');
  guide.textContent = '사진을 누르면 크게 볼 수 있어요.';
  section.append(guide);

  brand.images.forEach((src, index) => {
    const figure = document.createElement('figure');
    figure.style.margin = '32px 0';

    const caption = document.createElement('h3');
    caption.textContent = `${index + 1}단계`;

    const link = document.createElement('a');
    link.href = src;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute(
      'aria-label',
      `${index + 1}단계 사진 크게 보기 (새 탭)`
    );

    const img = document.createElement('img');
    img.src = src;
    img.alt = `${brand.name} 주문 안내 ${index + 1}단계`;
    img.loading = 'lazy';
    img.style.cssText =
      'display:block;width:100%;max-width:700px;' +
      'height:auto;border:2px solid #dedbd3;border-radius:16px';

    link.append(img);
    figure.append(caption, link);
    section.append(figure);
  });

  document.getElementById('lesson').append(section);
}

window.addEventListener('hashchange', showStepPhotos);
showStepPhotos();
