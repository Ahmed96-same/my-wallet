import { useState, useCallback } from "react";

const C = {
  bg:"#05080f",s1:"#09111f",s2:"#0e1a2e",s3:"#142035",s4:"#1b2c45",
  bdr:"rgba(255,255,255,0.055)",bdrH:"rgba(255,255,255,0.12)",
  text:"#d8e8ff",muted:"rgba(216,232,255,0.46)",hint:"rgba(216,232,255,0.2)",
  gold:"#e9bc52",coral:"#ff5f5f",teal:"#2dd4bf",amber:"#fb923c",green:"#4ade80",blue:"#60a5fa",
};

const CATS=[
  {l:"طعام وشراب",c:"#ff6b6b"},{l:"مواصلات",c:"#60a5fa"},{l:"ملابس",c:"#c084fc"},
  {l:"صحة",c:"#4ade80"},{l:"ترفيه",c:"#fbbf24"},{l:"فواتير",c:"#fb923c"},
  {l:"تسوق",c:"#f472b6"},{l:"أخرى",c:"#94a3b8"},
];
const catC=(l)=>CATS.find(c=>c.l===l)?.c||"#94a3b8";

const IQD=(n)=>Number(n||0).toLocaleString("ar-IQ")+" د.ع";
const SHORT=(n)=>{
  const v=Number(n||0),abs=Math.abs(v);
  if(abs>=1e6)return(v/1e6).toFixed(1)+"م";
  if(abs>=1e3)return(v/1e3).toFixed(0)+"K";
  return v.toLocaleString("ar-IQ");
};
const today=()=>new Date().toISOString().split("T")[0];
const curMonth=()=>new Date().toISOString().slice(0,7);
const initials=(s="")=>(s||"").trim().split(" ").map(w=>w[0]||"").join("").slice(0,2)||"؟";
const AV=["#2563eb","#7c3aed","#db2777","#059669","#d97706","#dc2626","#0891b2"];
const avC=(s)=>AV[(s?.charCodeAt(0)||0)%AV.length];

const STYLES=`
  @keyframes slideUp{from{transform:translateY(14px);opacity:0}to{transform:none;opacity:1}}
  @keyframes sheetUp{from{transform:translateY(100%)}to{transform:none}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0}
  html,body,#root{background:#05080f;min-height:100vh}
  input,select,button{font-family:inherit}
  input:focus,select:focus{outline:2px solid rgba(233,188,82,.35);outline-offset:0}
  input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
  ::-webkit-scrollbar{width:0;height:0}
`;

function useStorage(key,init){
  const[data,setData]=useState(()=>{
    try{const s=localStorage.getItem(key);return s?JSON.parse(s):init;}catch{return init;}
  });
  const save=useCallback((val)=>{
    setData(prev=>{
      const next=typeof val==="function"?val(prev):val;
      try{localStorage.setItem(key,JSON.stringify(next));}catch{}
      return next;
    });
  },[key]);
  return[data,save];
}

function Sheet({title,onClose,children}){
  return(
    <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,.72)",animation:"fadeIn .2s ease"}} onClick={onClose}>
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:C.s2,borderRadius:"22px 22px 0 0",padding:"0 20px 40px",maxHeight:"88vh",overflowY:"auto",animation:"sheetUp .28s cubic-bezier(.32,.72,0,1)"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:38,height:4,background:C.bdrH,borderRadius:2,margin:"14px auto 22px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <span style={{fontSize:17,fontWeight:700}}>{title}</span>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:"50%",background:C.s3,border:`1px solid ${C.bdrH}`,color:C.muted,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inp={width:"100%",background:C.s3,border:`1px solid ${C.bdrH}`,borderRadius:12,padding:"14px 15px",color:C.text,fontSize:15,marginBottom:14};
const lbl={display:"block",fontSize:11,color:C.muted,marginBottom:6,fontWeight:600,letterSpacing:.8};

function Field({label,...p}){return<div><label style={lbl}>{label}</label><input style={inp} {...p}/></div>;}
function Sel({label,options,value,onChange}){
  return(
    <div style={{marginBottom:14}}>
      <label style={lbl}>{label}</label>
      <select value={value} onChange={onChange} style={{...inp,marginBottom:0,cursor:"pointer"}}>
        {options.map(o=><option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}
      </select>
    </div>
  );
}
function SaveBtn({onClick}){
  return<button onClick={onClick} style={{width:"100%",padding:"16px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gold},#c99a32)`,color:"#150d00",fontWeight:800,fontSize:15,cursor:"pointer",marginTop:6}}>حفظ</button>;
}

function Donut({data,total}){
  if(!data.length||!total)return null;
  const R=50,cx=60,cy=60,circ=2*Math.PI*R;
  let off=0;
  const segs=data.map(d=>{const dash=(d.val/total)*circ,s={...d,dash,off};off+=dash;return s;});
  return(
    <svg width={120} height={120} viewBox="0 0 120 120" style={{flexShrink:0}}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.s3} strokeWidth={16}/>
      {segs.map((s,i)=>(
        <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={s.c} strokeWidth={16}
          strokeDasharray={`${s.dash} ${circ-s.dash}`} strokeDashoffset={circ/4-s.off}/>
      ))}
      <text x={cx} y={cy-5} textAnchor="middle" fill={C.text} fontSize={10} fontWeight="700">{data.length}</text>
      <text x={cx} y={cy+9} textAnchor="middle" fill={C.muted} fontSize={8}>فئة</text>
    </svg>
  );
}

function Empty({text}){
  return<div style={{padding:"44px 20px",textAlign:"center",color:C.hint}}><div style={{fontSize:40,marginBottom:12,opacity:.3}}>◯</div><div style={{fontSize:13}}>{text}</div></div>;
}

function ExpRow({item,onDelete}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:`1px solid ${C.bdr}`}}>
      <div style={{width:38,height:38,borderRadius:11,background:C.s3,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <div style={{width:10,height:10,borderRadius:3,background:catC(item.category)}}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:600}}>{item.category}</div>
        <div style={{fontSize:11,color:C.muted,marginTop:3}}>{item.note||"—"} · {item.date}</div>
      </div>
      <div style={{flexShrink:0,textAlign:"left"}}>
        <div style={{fontSize:14,fontWeight:700,color:C.coral}}>-{SHORT(item.amount)}</div>
        <div style={{fontSize:9,color:C.hint,textAlign:"center"}}>د.ع</div>
      </div>
      {onDelete&&<button onClick={()=>onDelete(item.id)} style={{background:"none",border:"none",color:C.hint,cursor:"pointer",fontSize:19,lineHeight:1,padding:"0 2px",flexShrink:0}}>×</button>}
    </div>
  );
}

function IncRow({item,onDelete}){
  const isF=item.type==="ثابت";
  return(
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:`1px solid ${C.bdr}`}}>
      <div style={{width:38,height:38,borderRadius:11,background:isF?"rgba(74,222,128,.1)":"rgba(96,165,250,.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:17,color:isF?C.green:C.blue}}>{isF?"↻":"↺"}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:600}}>{item.source||"مدخول"}</div>
        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
          <span style={{padding:"2px 7px",borderRadius:5,background:isF?"rgba(74,222,128,.12)":"rgba(96,165,250,.12)",color:isF?C.green:C.blue,fontSize:9,fontWeight:600}}>{item.type}</span>
          <span style={{fontSize:11,color:C.muted}}>{item.date}</span>
        </div>
      </div>
      <div style={{flexShrink:0,textAlign:"left"}}>
        <div style={{fontSize:14,fontWeight:700,color:C.green}}>+{SHORT(item.amount)}</div>
        <div style={{fontSize:9,color:C.hint,textAlign:"center"}}>د.ع</div>
      </div>
      <button onClick={()=>onDelete(item.id)} style={{background:"none",border:"none",color:C.hint,cursor:"pointer",fontSize:19,lineHeight:1,padding:"0 2px",flexShrink:0}}>×</button>
    </div>
  );
}

function DebtRow({item,type,onDelete,onToggle}){
  const color=type==="lent"?C.teal:C.amber;
  return(
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:`1px solid ${C.bdr}`,opacity:item.paid?.5:1,transition:"opacity .3s"}}>
      <div style={{width:40,height:40,borderRadius:"50%",background:avC(item.person),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:13,fontWeight:800,color:"#fff"}}>{initials(item.person)}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:600}}>{item.person}</div>
        <div style={{fontSize:11,color:C.muted,marginTop:3}}>{item.note||"—"} · {item.date}</div>
      </div>
      <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
        <div style={{fontSize:14,fontWeight:700,color}}>{SHORT(item.amount)}</div>
        <button onClick={()=>onToggle(item.id)} style={{padding:"3px 9px",borderRadius:6,border:`1px solid ${item.paid?C.green:C.bdrH}`,background:item.paid?"rgba(74,222,128,.12)":"none",color:item.paid?C.green:C.muted,fontSize:9,cursor:"pointer",fontWeight:700,transition:"all .2s"}}>
          {item.paid?"✓ مسدّد":"سدّد"}
        </button>
      </div>
      <button onClick={()=>onDelete(item.id)} style={{background:"none",border:"none",color:C.hint,cursor:"pointer",fontSize:19,lineHeight:1,flexShrink:0}}>×</button>
    </div>
  );
}

function Stats({items}){
  return(
    <div style={{display:"flex",gap:8,marginBottom:16}}>
      {items.map((d,i)=>(
        <div key={i} style={{flex:1,background:C.s2,border:`1px solid ${C.bdr}`,borderRadius:14,padding:"13px 12px"}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:5,letterSpacing:.4}}>{d.label}</div>
          <div style={{fontSize:17,fontWeight:700,color:d.color||C.text,letterSpacing:-.3}}>{d.value}</div>
        </div>
      ))}
    </div>
  );
}

function AddBtn({onClick,label}){
  return(
    <button onClick={onClick} style={{width:"100%",padding:"14px",borderRadius:14,border:`1.5px dashed ${C.bdrH}`,background:"none",color:C.muted,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16}}>
      <span style={{width:26,height:26,borderRadius:8,background:C.s3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:C.gold,lineHeight:1}}>+</span>
      {label}
    </button>
  );
}

function SCard({children}){
  return<div style={{background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:16,overflow:"hidden",marginBottom:16}}>{children}</div>;
}

function Dashboard({expenses,income,lent,owed,balance,totalIncome,totalExpenses,totalLent,totalOwed,setTab}){
  const curM=curMonth();
  const mExp=expenses.filter(e=>e.date?.startsWith(curM)).reduce((s,e)=>s+Number(e.amount),0);
  const mInc=income.filter(i=>i.date?.startsWith(curM)).reduce((s,i)=>s+Number(i.amount),0);
  const mBal=mInc-mExp;
  const pct=mInc>0?Math.min(100,Math.round(mExp/mInc*100)):0;
  const isPos=balance>=0;
  const catTotals={};
  expenses.forEach(e=>{catTotals[e.category]=(catTotals[e.category]||0)+Number(e.amount);});
  const catData=Object.entries(catTotals).map(([l,val])=>({l,val,c:catC(l)})).sort((a,b)=>b.val-a.val);
  const months={};
  expenses.forEach(e=>{const m=e.date?.slice(0,7);if(m)months[m]=(months[m]||0)+Number(e.amount);});
  const bars=Object.entries(months).sort((a,b)=>a[0]<b[0]?1:-1).slice(0,5).reverse();
  const maxBar=Math.max(...bars.map(b=>b[1]),1);
  return(
    <div style={{animation:"slideUp .35s ease"}}>
      <div style={{background:`linear-gradient(145deg,${C.s3} 0%,#182d48 60%,#0e1d32 100%)`,border:`1px solid ${C.bdrH}`,borderRadius:22,padding:"26px 22px 22px",marginBottom:14,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,left:-50,width:180,height:180,borderRadius:"50%",background:isPos?"rgba(74,222,128,.05)":"rgba(255,95,95,.05)",pointerEvents:"none"}}/>
        <div style={{fontSize:11,color:C.muted,letterSpacing:2,marginBottom:10,fontWeight:600}}>الرصيد الإجمالي</div>
        <div style={{fontSize:34,fontWeight:800,color:isPos?C.green:C.coral,letterSpacing:-1,marginBottom:6,lineHeight:1}}>{isPos?"+ ":"- "}{IQD(Math.abs(balance))}</div>
        <div style={{fontSize:11,color:C.hint,marginBottom:22}}>{isPos?"مبروك! أنت في مأمن مالي ✓":"تنبّه! مصاريفك تتجاوز مدخولك"}</div>
        <div style={{display:"flex",gap:0,background:C.s1,borderRadius:14,overflow:"hidden",border:`1px solid ${C.bdr}`}}>
          {[{label:"مدخول ↓",val:totalIncome,color:C.green},{label:"مصاريف ↑",val:totalExpenses,color:C.coral},{label:"هذا الشهر",val:mBal,color:mBal>=0?C.green:C.coral}].map((d,i)=>(
            <div key={i} style={{flex:1,padding:"11px 0",textAlign:"center",borderRight:i<2?`1px solid ${C.bdr}`:"none"}}>
              <div style={{fontSize:9,color:C.hint,marginBottom:4,letterSpacing:.5}}>{d.label}</div>
              <div style={{fontSize:13,fontWeight:700,color:d.color}}>{SHORT(d.val)}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[{label:"ديون لي",val:totalLent,color:C.teal,icon:"⟵",tab:3,count:lent.filter(d=>!d.paid).length},{label:"ديون عليّ",val:totalOwed,color:C.amber,icon:"⟶",tab:4,count:owed.filter(d=>!d.paid).length}].map((d,i)=>(
          <div key={i} onClick={()=>setTab(d.tab)} style={{background:C.s2,border:`1px solid ${C.bdr}`,borderRadius:16,padding:"14px 16px",cursor:"pointer",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-12,left:-12,width:60,height:60,borderRadius:"50%",background:`${d.color}0a`}}/>
            <div style={{fontSize:11,color:C.muted,marginBottom:2}}>{d.icon} {d.label}</div>
            <div style={{fontSize:9,color:C.hint,marginBottom:10}}>غير مسددة</div>
            <div style={{fontSize:20,fontWeight:800,color:d.color,letterSpacing:-.5}}>{SHORT(d.val)}</div>
            <div style={{fontSize:9,color:C.hint,marginTop:2}}>{d.count} شخص</div>
          </div>
        ))}
      </div>
      {mInc>0&&(
        <div style={{background:C.s2,border:`1px solid ${C.bdr}`,borderRadius:16,padding:"16px 18px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
            <span style={{fontSize:13,fontWeight:600}}>إنفاق هذا الشهر</span>
            <span style={{fontSize:20,fontWeight:800,color:pct>80?C.coral:pct>55?C.amber:C.green}}>{pct}٪</span>
          </div>
          <div style={{height:9,background:C.s3,borderRadius:99,overflow:"hidden",marginBottom:10}}>
            <div style={{height:"100%",borderRadius:99,width:`${pct}%`,background:pct>80?`linear-gradient(90deg,${C.amber},${C.coral})`:pct>55?C.amber:C.green,transition:"width .9s ease"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted}}>
            <span>صرفت {SHORT(mExp)} د.ع</span><span>من أصل {SHORT(mInc)} د.ع</span>
          </div>
        </div>
      )}
      {catData.length>0&&(
        <div style={{background:C.s2,border:`1px solid ${C.bdr}`,borderRadius:16,padding:"16px 18px",marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>توزيع المصاريف</div>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            <Donut data={catData} total={totalExpenses}/>
            <div style={{flex:1}}>
              {catData.slice(0,5).map((d,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <div style={{width:8,height:8,borderRadius:2,background:d.c,flexShrink:0}}/>
                    <span style={{fontSize:11,color:C.muted}}>{d.l}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:50,height:4,borderRadius:2,background:C.s3,overflow:"hidden"}}>
                      <div style={{height:"100%",background:d.c,width:`${Math.round(d.val/totalExpenses*100)}%`,borderRadius:2}}/>
                    </div>
                    <span style={{fontSize:11,fontWeight:600,minWidth:28,textAlign:"left"}}>{Math.round(d.val/totalExpenses*100)}٪</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {bars.length>1&&(
        <div style={{background:C.s2,border:`1px solid ${C.bdr}`,borderRadius:16,padding:"16px 18px",marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>المصاريف الشهرية</div>
          <div style={{display:"flex",gap:6,alignItems:"flex-end",height:90}}>
            {bars.map(([m,v],i)=>{
              const h=Math.round(v/maxBar*78),isLast=i===bars.length-1;
              return(
                <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <div style={{fontSize:10,color:isLast?C.coral:C.hint,fontWeight:isLast?700:400}}>{SHORT(v)}</div>
                  <div style={{width:"100%",borderRadius:"5px 5px 0 0",background:isLast?C.coral:C.s4,height:`${h}px`,minHeight:4}}/>
                  <div style={{fontSize:9,color:C.hint}}>{m.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {expenses.slice(0,3).length>0&&(
        <div style={{marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:10,color:C.muted}}>آخر المصاريف</div>
          <SCard>{expenses.slice(0,3).map(e=><ExpRow key={e.id} item={e}/>)}</SCard>
        </div>
      )}
    </div>
  );
}

function ExpensesTab({expenses,setExpenses}){
  const[open,setOpen]=useState(false);
  const[form,setForm]=useState({amount:"",category:"طعام وشراب",note:"",date:today()});
  const add=()=>{if(!form.amount||isNaN(form.amount))return;setExpenses(p=>[{...form,id:Date.now()},...p]);setOpen(false);setForm({amount:"",category:"طعام وشراب",note:"",date:today()});};
  const del=(id)=>setExpenses(p=>p.filter(e=>e.id!==id));
  const total=expenses.reduce((s,e)=>s+Number(e.amount),0);
  const mTotal=expenses.filter(e=>e.date?.startsWith(curMonth())).reduce((s,e)=>s+Number(e.amount),0);
  return(
    <div style={{animation:"slideUp .3s ease"}}>
      <Stats items={[{label:"إجمالي الكل",value:SHORT(total),color:C.coral},{label:"هذا الشهر",value:SHORT(mTotal),color:C.amber},{label:"عدد السجلات",value:expenses.length}]}/>
      <AddBtn onClick={()=>setOpen(true)} label="إضافة مصروف جديد"/>
      <SCard>{expenses.length===0?<Empty text="لا توجد مصاريف مسجّلة بعد"/>:expenses.map(e=><ExpRow key={e.id} item={e} onDelete={del}/>)}</SCard>
      {open&&<Sheet title="مصروف جديد" onClose={()=>setOpen(false)}>
        <Field label="المبلغ (دينار عراقي)" type="number" placeholder="0" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/>
        <Sel label="الفئة" options={CATS.map(c=>({v:c.l,l:c.l}))} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}/>
        <Field label="ملاحظة (اختياري)" placeholder="وصف المصروف..." value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}/>
        <Field label="التاريخ" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
        <SaveBtn onClick={add}/>
      </Sheet>}
    </div>
  );
}

function IncomeTab({income,setIncome}){
  const[open,setOpen]=useState(false);
  const[form,setForm]=useState({amount:"",type:"ثابت",source:"",date:today()});
  const add=()=>{if(!form.amount||isNaN(form.amount))return;setIncome(p=>[{...form,id:Date.now()},...p]);setOpen(false);setForm({amount:"",type:"ثابت",source:"",date:today()});};
  const del=(id)=>setIncome(p=>p.filter(i=>i.id!==id));
  const tF=income.filter(i=>i.type==="ثابت").reduce((s,i)=>s+Number(i.amount),0);
  const tV=income.filter(i=>i.type==="متغير").reduce((s,i)=>s+Number(i.amount),0);
  return(
    <div style={{animation:"slideUp .3s ease"}}>
      <Stats items={[{label:"ثابت",value:SHORT(tF),color:C.green},{label:"متغير",value:SHORT(tV),color:C.blue},{label:"الإجمالي",value:SHORT(tF+tV),color:C.gold}]}/>
      <AddBtn onClick={()=>setOpen(true)} label="إضافة مدخول جديد"/>
      <SCard>{income.length===0?<Empty text="لا توجد مداخيل مسجّلة بعد"/>:income.map(i=><IncRow key={i.id} item={i} onDelete={del}/>)}</SCard>
      {open&&<Sheet title="مدخول جديد" onClose={()=>setOpen(false)}>
        <Field label="المبلغ (دينار عراقي)" type="number" placeholder="0" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/>
        <Sel label="النوع" options={["ثابت","متغير"]} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}/>
        <Field label="المصدر" placeholder="راتب، مشروع، عمل حر..." value={form.source} onChange={e=>setForm(f=>({...f,source:e.target.value}))}/>
        <Field label="التاريخ" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
        <SaveBtn onClick={add}/>
      </Sheet>}
    </div>
  );
}

function DebtTab({debts,setDebts,type}){
  const isLent=type==="lent";
  const[open,setOpen]=useState(false);
  const[form,setForm]=useState({amount:"",person:"",note:"",date:today()});
  const add=()=>{if(!form.amount||isNaN(form.amount)||!form.person)return;setDebts(p=>[{...form,id:Date.now(),paid:false},...p]);setOpen(false);setForm({amount:"",person:"",note:"",date:today()});};
  const del=(id)=>setDebts(p=>p.filter(d=>d.id!==id));
  const toggle=(id)=>setDebts(p=>p.map(d=>d.id===id?{...d,paid:!d.paid}:d));
  const pending=debts.filter(d=>!d.paid).reduce((s,d)=>s+Number(d.amount),0);
  const done=debts.filter(d=>d.paid).reduce((s,d)=>s+Number(d.amount),0);
  const color=isLent?C.teal:C.amber;
  return(
    <div style={{animation:"slideUp .3s ease"}}>
      <Stats items={[{label:isLent?"لم يُردّ بعد":"لم أسدّد بعد",value:SHORT(pending),color},{label:"مسدّد",value:SHORT(done),color:C.green},{label:"عدد الأشخاص",value:debts.length}]}/>
      <AddBtn onClick={()=>setOpen(true)} label={isLent?"تسجيل دين أعطيته":"تسجيل دين عليّ"}/>
      <SCard>{debts.length===0?<Empty text={isLent?"لا توجد ديون لك مسجّلة":"لا توجد ديون عليك مسجّلة"}/>:debts.map(d=><DebtRow key={d.id} item={d} type={type} onDelete={del} onToggle={toggle}/>)}</SCard>
      {open&&<Sheet title={isLent?"دين أعطيته لشخص":"دين عليّ لشخص"} onClose={()=>setOpen(false)}>
        <Field label={isLent?"اسم المدين":"اسم الدائن"} placeholder="الاسم الكامل" value={form.person} onChange={e=>setForm(f=>({...f,person:e.target.value}))}/>
        <Field label="المبلغ (دينار عراقي)" type="number" placeholder="0" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/>
        <Field label="ملاحظة (اختياري)" placeholder="سبب الدين..." value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}/>
        <Field label="التاريخ" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
        <SaveBtn onClick={add}/>
      </Sheet>}
    </div>
  );
}

const TABS=[{icon:"◈",label:"الرئيسية"},{icon:"↑",label:"المصاريف"},{icon:"↓",label:"المدخول"},{icon:"⟵",label:"ديون لي"},{icon:"⟶",label:"ديون عليّ"}];

export default function App(){
  const[tab,setTab]=useState(0);
  const[expenses,setExpenses]=useStorage("pf-exp",[]);
  const[income,setIncome]=useStorage("pf-inc",[]);
  const[lent,setLent]=useStorage("pf-lnt",[]);
  const[owed,setOwed]=useStorage("pf-owd",[]);
  const totalIncome=income.reduce((s,i)=>s+Number(i.amount),0);
  const totalExpenses=expenses.reduce((s,e)=>s+Number(e.amount),0);
  const balance=totalIncome-totalExpenses;
  const totalLent=lent.filter(d=>!d.paid).reduce((s,d)=>s+Number(d.amount),0);
  const totalOwed=owed.filter(d=>!d.paid).reduce((s,d)=>s+Number(d.amount),0);
  const pages=[
    <Dashboard key="d" {...{expenses,income,lent,owed,balance,totalIncome,totalExpenses,totalLent,totalOwed,setTab}}/>,
    <ExpensesTab key="e" expenses={expenses} setExpenses={setExpenses}/>,
    <IncomeTab key="i" income={income} setIncome={setIncome}/>,
    <DebtTab key="l" debts={lent} setDebts={setLent} type="lent"/>,
    <DebtTab key="o" debts={owed} setDebts={setOwed} type="owed"/>,
  ];
  return(
    <>
      <style>{STYLES}</style>
      <div dir="rtl" style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"'Segoe UI',Tahoma,system-ui,sans-serif",maxWidth:430,margin:"0 auto",paddingBottom:90}}>
        <div style={{padding:"24px 20px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:10,color:C.hint,letterSpacing:3,fontWeight:600,marginBottom:3}}>MY WALLET</div>
            <div style={{fontSize:22,fontWeight:800,letterSpacing:-.5}}>محفظتي</div>
          </div>
          <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${C.s3},${C.s4})`,border:`1.5px solid ${C.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:C.gold}}>أ</div>
        </div>
        <div style={{padding:"0 16px"}}>{pages[tab]}</div>
        <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:C.s1,borderTop:`1px solid ${C.bdr}`,display:"flex",alignItems:"center",padding:"8px 0 18px",zIndex:99}}>
          {TABS.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",padding:"4px 0",color:tab===i?C.gold:C.hint,transition:"color .2s"}}>
              <div style={{height:2,width:tab===i?24:0,background:C.gold,borderRadius:1,transition:"width .25s ease",marginBottom:2}}/>
              <span style={{fontSize:17,lineHeight:1}}>{t.icon}</span>
              <span style={{fontSize:9,fontWeight:tab===i?700:400,letterSpacing:.5}}>{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
