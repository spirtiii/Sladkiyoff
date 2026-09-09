export class TouchInput {
  constructor({ moveZone, lookZone, stick, onAction }) {
    this.move = { x: 0, y: 0 }; this.look = { x: 0, y: 0 }; this.ids = { move: null, look: null }; this.origin = null; this.last = null;
    this.moveZone = moveZone; this.stick = stick; this.onAction = onAction;
    this.bindStick(); this.bindLook(lookZone); this.bindButtons();
  }
  bindStick() {
    const track = e => { for (const t of e.changedTouches) if (t.identifier === this.ids.move) this.updateStick(t); };
    this.moveZone.addEventListener('touchstart', e => { const t = [...e.changedTouches].find(t => this.ids.move === null); if (!t) return; e.preventDefault(); this.ids.move = t.identifier; this.origin = { x:t.clientX, y:t.clientY }; this.stick.style.cssText += `;display:block;left:${t.clientX}px;top:${t.clientY}px`; }, { passive:false });
    this.moveZone.addEventListener('touchmove', e => { e.preventDefault(); track(e); }, { passive:false });
    const end = e => { for (const t of e.changedTouches) if (t.identifier === this.ids.move) { this.ids.move=null; this.move.x=this.move.y=0; this.stick.style.display='none'; } };
    this.moveZone.addEventListener('touchend', end); this.moveZone.addEventListener('touchcancel', end);
  }
  updateStick(t) { let x=t.clientX-this.origin.x,y=t.clientY-this.origin.y; const length=Math.hypot(x,y), cap=45, ratio=Math.min(1, length/cap); if(length>cap){x=x/length*cap;y=y/length*cap;} this.stick.firstElementChild.style.transform=`translate(-50%,-50%) translate(${x}px,${y}px)`; this.move.x=(x/cap)*ratio; this.move.y=(-y/cap)*ratio; }
  bindLook(zone) {
    zone.addEventListener('touchstart', e => { const t=[...e.changedTouches].find(t=>this.ids.look===null); if(t){ this.ids.look=t.identifier; this.last={x:t.clientX,y:t.clientY}; } }, {passive:false});
    zone.addEventListener('touchmove', e => { e.preventDefault(); for(const t of e.changedTouches) if(t.identifier===this.ids.look){ const dx=t.clientX-this.last.x,dy=t.clientY-this.last.y; if(Math.hypot(dx,dy)>1){this.look.x+=dx;this.look.y+=dy;} this.last={x:t.clientX,y:t.clientY}; } }, {passive:false});
    const end=e=>{for(const t of e.changedTouches)if(t.identifier===this.ids.look)this.ids.look=null;}; zone.addEventListener('touchend',end);zone.addEventListener('touchcancel',end);
  }
  bindButtons() { document.querySelectorAll('[data-action]').forEach(el => { el.addEventListener('touchstart', e=>{e.preventDefault();this.onAction(el.dataset.action,true);},{passive:false}); el.addEventListener('touchend', e=>{e.preventDefault();this.onAction(el.dataset.action,false);},{passive:false}); }); }
  consumeLook() { const value={...this.look}; this.look.x=this.look.y=0; return value; }
}
