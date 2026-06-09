// ── App Logic ────────────────────────────────────────────────────────────────
let activeId=null;
const catMap={e:"electron",f:"frontend",b:"backend",x:"external",d:"data",u:"user"};
const catLabel={e:"Electron",f:"Frontend",b:"Backend",x:"External",d:"Data",u:"User"};

function buildTree(node,container,depth){
  const div=document.createElement("div");
  div.className="tn";
  div.dataset.id=node.id;
  const hasKids=node.children&&node.children.length>0;
  const label=document.createElement("div");
  label.className="tl";
  label.dataset.id=node.id;
  const arrow=document.createElement("span");
  arrow.className="ta"+(hasKids?"":" lf");
  arrow.textContent="▶";
  label.appendChild(arrow);
  const icon=document.createElement("span");
  icon.className="ti "+node.cat;
  icon.textContent=catLabel[node.cat][0];
  label.appendChild(icon);
  const txt=document.createElement("span");
  txt.textContent=node.label;
  label.appendChild(txt);
  div.appendChild(label);
  let childContainer;
  if(hasKids){
    childContainer=document.createElement("div");
    childContainer.className="tc";
    node.children.forEach(c=>buildTree(c,childContainer,depth+1));
    div.appendChild(childContainer);
  }
  label.addEventListener("click",e=>{
    e.stopPropagation();
    if(hasKids){
      const open=childContainer.classList.toggle("op");
      arrow.classList.toggle("ex",open);
    }
    selectNode(node.id);
  });
  container.appendChild(div);
}

function selectNode(id){
  activeId=id;
  document.querySelectorAll(".tl").forEach(l=>l.classList.toggle("ac",l.dataset.id===id));
  showDetail(id);
}

function showDetail(id){
  const wv=document.getElementById("wv");
  const dv=document.getElementById("dv");
  wv.style.display="none";
  dv.style.display="block";
  const d=D[id];
  if(!d){dv.innerHTML='<p style="color:var(--txd)">No detail data for this node.</p>';return;}
  const cat=d.t.includes("Electron")||id.includes("electron")||id.includes("main-js")||id.includes("preload")||id.includes("loading")||id.includes("ipc")||id.includes("ea-")||id.includes("es-")||id.includes("clean-exit")||id.includes("harden")||id.includes("wipe")||id.includes("start-")||id.includes("create-")||id.includes("child-proc")||id.includes("ollama-proc")||id.includes("backend-proc")||id.includes("eb-")?"e":
    d.t.includes("FastAPI")||d.t.includes("POST")||d.t.includes("GET")||d.t.includes("DELETE")||d.t.includes("PATCH")||d.t.includes("WS")||id.includes("route-")||id.includes("chat-")||id.includes("tr-")||id.includes("tts-")||id.includes("ext-")||id.includes("v-")||id.includes("mod-")||id.includes("db-")||id.includes("py-")||id.includes("help-")||id.includes("nexa-db")||id.includes("models-py")||id.includes("database-py")||id.includes("pydantic")||id.includes("main-py")?"b":
    d.t.includes("Ollama")||d.t.includes("Piper")||d.t.includes("Vosk")||d.t.includes("Argos")||d.t.includes("Pyodide")||id.includes("ol-")||id.includes("pi-")||id.includes("vo-")||id.includes("ar-")||id.includes("py-wasm")||id.includes("py-stdout")||id.includes("py-plots")?"x":
    d.t.includes("localStorage")||d.t.includes("SQLite")||d.t.includes("table")||id.includes("ls-")||id.includes("db-conversations")||id.includes("db-messages")||id.includes("ol-models-dir")?"d":
    id.includes("user")?"u":"f";
  let html=`<div class="dt">${d.t} <span class="bd fn ${cat}" style="font-size:9px;padding:2px 7px;border-radius:99px;color:#fff;background:var(--${catMap[cat]})">${catLabel[cat]}</span></div>`;
  html+=`<div class="ds">${d.d}</div>`;
  if(d.f&&d.f.length>0){
    html+=`<div class="dsec"><h3>Data Flows</h3>`;
    d.f.forEach(fl=>{
      html+=`<div class="fr">`;
      fl.n.forEach((n,i)=>{
        const nc=getCatForNode(n);
        html+=`<span class="fn ${nc}" onclick="navigateTo('${n}')" title="Click to navigate">${nodeName(n)}</span>`;
        if(i<fl.n.length-1)html+=`<span class="fa">${fl.a}</span>`;
      });
      html+=`<span class="fl">${fl.l}</span></div>`;
    });
    html+=`</div>`;
  }
  if(d.c&&d.c.length>0){
    html+=`<div class="dsec"><h3>Connected Components</h3><div class="ct">`;
    d.c.forEach(cid=>{
      const cc=getCatForNode(cid);
      html+=`<span class="ctg ${cc}" onclick="navigateTo('${cid}')" title="${(D[cid]||{}).t||cid}">${(D[cid]||{}).t||cid}</span>`;
    });
    html+=`</div></div>`;
  }
  const treeNode=findTreeNode(TREE,id);
  if(treeNode&&treeNode.children&&treeNode.children.length>0){
    html+=`<div class="dsec"><h3>Children</h3>`;
    treeNode.children.forEach(ch=>{
      const cc=ch.cat;
      html+=`<div class="dc" onclick="navigateTo('${ch.id}')" style="cursor:pointer"><h4><span class="fn ${cc}" style="font-size:9px;padding:1px 5px;margin-right:4px">${catLabel[cc][0]}</span> ${(D[ch.id]||{}).t||ch.label}</h4><p>${(D[ch.id]||{}).d||""}</p></div>`;
    });
    html+=`</div>`;
  }
  dv.innerHTML=html;
}

function getCatForNode(id){
  if(id.startsWith("user"))return"u";
  if(id.includes("electron")||id.includes("main-js")||id.includes("preload")||id.includes("loading")||id.includes("ipc-")||id.includes("ea-")||id.includes("es-")||id.includes("clean-exit")||id.includes("harden")||id.includes("wipe")||id.includes("start-")||id.includes("create-")||id.includes("child-proc")||id.includes("ollama-proc")||id.includes("backend-proc")||id.includes("eb-"))return"e";
  if(id.includes("route-")||id.includes("chat-")||id.includes("tr-")||id.includes("tts-")||id.includes("ext-")||id.includes("v-")||id.includes("mod-")||id.includes("db-")||id.includes("py-")||id.includes("help-")||id.includes("nexa-db")||id.includes("models-py")||id.includes("database-py")||id.includes("pydantic")||id.includes("main-py"))return"b";
  if(id.includes("ol-")||id.includes("pi-")||id.includes("vo-")||id.includes("ar-")||id.includes("pyodide")||id.includes("py-wasm")||id.includes("py-stdout")||id.includes("py-plots")||id.includes("ollama")||id.includes("piper")||id.includes("vosk")||id.includes("argos"))return"x";
  if(id.includes("ls-")||id.includes("db-conversations")||id.includes("db-messages")||id.includes("ol-models-dir")||id.includes("flow-")||id.includes("data-flows"))return"d";
  return"f";
}

function nodeName(id){return(D[id]||{}).t||id;}

function findTreeNode(node,id){
  if(node.id===id)return node;
  if(node.children){
    for(let c of node.children){
      const r=findTreeNode(c,id);
      if(r)return r;
    }
  }
  return null;
}

window.navigateTo=function(id){
  const el=document.querySelector(`.tl[data-id="${id}"]`);
  if(el){
    let parent=el.parentElement;
    while(parent){
      if(parent.classList&&parent.classList.contains("tc")){
        parent.classList.add("op");
        const arrow=parent.previousElementSibling?.querySelector(".ta");
        if(arrow)arrow.classList.add("ex");
      }
      parent=parent.parentElement;
    }
    el.scrollIntoView({behavior:"smooth",block:"nearest"});
    selectNode(id);
  }
};

// ── Search ──────────────────────────────────────────────────────────────────
document.getElementById("si").addEventListener("input",function(){
  const q=this.value.toLowerCase().trim();
  document.querySelectorAll(".tn").forEach(tn=>{
    const label=tn.querySelector(":scope > .tl");
    if(!label)return;
    const text=label.textContent.toLowerCase();
    const id=(tn.dataset.id||"").toLowerCase();
    const match=!q||text.includes(q)||id.includes(q);
    tn.style.display=match?"":"none";
    if(match&&q){
      let p=tn.parentElement;
      while(p&&p.classList){
        if(p.classList.contains("tc")){p.classList.add("op");const a=p.previousElementSibling?.querySelector(".ta");if(a)a.classList.add("ex");}
        p=p.parentElement;
      }
    }
  });
});

// ── Init ─────────────────────────────────────────────────────────────────────
buildTree(TREE,document.getElementById("tr"),0);
// Auto-expand top level
document.querySelectorAll("#tr > .tn > .tc").forEach(tc=>{tc.classList.add("op");const a=tc.previousElementSibling?.querySelector(".ta");if(a)a.classList.add("ex");});
