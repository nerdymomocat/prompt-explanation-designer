rangy.init();import{getUniqueRandomColor,predefinedColors}from"./module_color.js";import{wordDiff}from"./module_diff.js";import{tab_create_viz}from"./module_viz.js";import{hideVisWhenSidebarIsUpdated,internalCompareButtonClick,convertInputToSidebar,getParentId,removeAllItemsFromSidebar}from"./setup.js";const savedOptionsCateg=["","Hypothetical","Mathematics","Causation"],activeTabNumber=()=>{let e;document.querySelectorAll(".accordion-content").forEach((t=>{t.classList.contains("active")&&(e=t)}));return e.getAttribute("id").replace("tab","")};function updatePlaceholderVisibility(e){const t=document.querySelector("#"+e),n=t.querySelector(".item-container"),o=t.querySelector(".item-placeholder"),i=Array.from(n.children).some((e=>e!==o&&(e.querySelector(".color-index-container")||e.querySelector(".horizontal-line-container"))));o.style.display=i?"none":"block"}function showModal(e){const t=document.getElementById("modalImg");document.getElementById("generated-image").src=e,t.style.display="block"}function closeModal(){document.getElementById("modalImg").style.display="none"}window.addEventListener("resize",(()=>{const e=activeTabNumber(),t=`tb${e}-visualization`;"none"!==document.getElementById(t).style.display&&tab_create_viz(t,"tab"+e)}));const hamburgerMenu=document.getElementById("hamburger-menu"),dropdownMenu=document.getElementById("dropdown-menu");document.addEventListener("DOMContentLoaded",(()=>{document.querySelectorAll(".sidebar").forEach((e=>{e.addEventListener("dragover",onDragOver),e.addEventListener("drop",onDrop)})),hideVisWhenSidebarIsUpdated(),internalCompareButtonClick();[{btnClass:"#tb2-export-viz-btn",vizId:"tb2-visualization",tabName:"tab2"},{btnClass:"#tb3-export-viz-btn",vizId:"tb3-visualization",tabName:"tab3"},{btnClass:"#tb4-export-viz-btn",vizId:"tb4-visualization",tabName:"tab4"}].forEach((e=>{return t=e.btnClass,n=e.vizId,o=e.tabName,void document.querySelector(t).addEventListener("click",(()=>{document.getElementById(n).style.display="block",tab_create_viz(n,o)}));var t,n,o})),window.addEventListener("click",(e=>{const t=document.querySelector("#comparisonModal");e.target===t&&(t.style.display="none")})),window.addEventListener("keydown",(e=>{const t=document.querySelector("#comparisonModal");"Escape"===e.key&&(t.style.display="none")}));const e=document.getElementById("download-btn"),t=document.querySelector(".close");function n(e,t,n,o){const i=document.querySelector(e),a=(e,t)=>{e.forEach((e=>{const n=document.querySelector(e);n&&(n.style.visibility=t)}))};i.addEventListener("click",(()=>{const e=document.querySelector(t),i=675*n,d=Math.min(1200/e.offsetWidth,i/e.offsetHeight);a(o,"hidden"),html2canvas(e,{scale:d}).then((e=>{const t=e.toDataURL("image/png");a(o,"visible"),showModal(t)}))}))}n("#tb2-export-btn",".tb2-container",1,[["#tb2-compare-btn"]]),n("#tb3-export-btn",".tb3-container",2,["#tb3-compare-btn","#tb3-settings-button-gen","#tb3-generate-button"]),n("#tb4-export-btn",".tb4-container",3,["#tb4-compare-btn","#tb4-settings-button-gen-1","#tb4-generate-button-1","#tb4-settings-button-gen-2","#tb4-generate-button-2"]),e.addEventListener("click",(()=>{const e=document.getElementById("generated-image"),t=document.createElement("a");t.href=e.src,t.download="explained-prompt.png",t.click()})),t.addEventListener("click",(()=>{closeModal()})),window.addEventListener("click",(e=>{const t=document.getElementById("modalImg"),n=document.querySelector("#comparisonModal");e.target===t?closeModal():e.target===n&&(n.style.display="none")})),document.getElementById("saveOptions").addEventListener("click",(()=>{const e=document.getElementById("optionsTextarea").value.split("\n").map((e=>e.trim()));localStorage.setItem("dropdownOptions",JSON.stringify(e)),document.getElementById("optionsModal").style.display="none"})),document.getElementById("closeModal").addEventListener("click",(()=>{document.getElementById("optionsModal").style.display="none"})),document.getElementById("optionsModal").addEventListener("click",(e=>{e.target===e.currentTarget&&document.getElementById("saveOptions").click()})),document.querySelectorAll(".settings-button").forEach((e=>{e.addEventListener("click",(()=>{!function(){document.getElementById("optionsModal").style.display="block";let e=JSON.parse(localStorage.getItem("dropdownOptions"));e||(e=savedOptionsCateg),e.includes("")||e.unshift(""),document.getElementById("optionsTextarea").value=e.join("\n")}()}))}));document.querySelector("#tb1-copy-to-designer-btn").addEventListener("click",(function(){const e=document.querySelector("#comparisonModal");removeAllItemsFromSidebar(e.dataset.sidebarContainerId),console.log(e.dataset.sidebarContainerId);const t=document.getElementById("tb1-diff-results");""===t.textContent.trim()&&t.setAttribute("data-placeholder","Comparison Output Will Appear Here");const n=t.innerHTML,o=document.createElement("div");o.innerHTML=n;const i=o.querySelectorAll("del");i.forEach((t=>{const n=rangy.createRange();n.selectNodeContents(t),g([n],e.dataset.sidebarContainerId)}));const a=o.querySelectorAll("ins");a.forEach((t=>{const n=rangy.createRange();n.selectNodeContents(t);((e,t,n)=>{const o=`color-highlight-${e.replace("#","").toLowerCase()}`,i=document.createElement("style");i.textContent=`\n    .${o} {\n      background-color: ${e};\n      border-radius: 3px;\n      padding: 1px 1px;\n    }\n  `,document.head.appendChild(i);const a=rangy.createClassApplier(o,{normalize:!0});t.forEach((e=>{r.undoToRange(e),a.toggleRange(e)})),updateSidebar(e,n)})(getUniqueRandomColor(e.dataset.sidebarContainerId),[n],e.dataset.sidebarContainerId)})),i.forEach((e=>{const t=e.parentNode;for(;e.firstChild;)t.insertBefore(e.firstChild,e);t.removeChild(e)})),a.forEach((e=>{const t=e.parentNode;for(;e.firstChild;)t.insertBefore(e.firstChild,e);t.removeChild(e)}));document.querySelector("#"+e.dataset.relatedTextInput).innerHTML=o.innerHTML,e.style.display="none"}));document.querySelector("#tb1-compare-btn").addEventListener("click",(function(){const e=document.getElementById("tb1-text-area-1"),t=document.getElementById("tb1-text-area-2"),n=document.getElementById("tb1-diff-results"),o=wordDiff(e.value,t.value).map((([e,t])=>-1===e?`<del>${t}</del>`:1===e?`<ins>${t}</ins>`:t)).join(" ");n.innerHTML=o}));const o=document.querySelectorAll(".text-input");o.forEach((e=>{e.addEventListener("click",(t=>{t.stopPropagation(),e.classList.add("active")})),e.addEventListener("mouseup",(t=>{const n=rangy.getSelection();if(n.rangeCount>0){const o=n.getRangeAt(0);o.collapsed||(i.push(o),r.toggleRange(o),n.removeAllRanges(),1===i.length&&l(t,convertInputToSidebar(e.getAttribute("id"))))}}))})),document.addEventListener("click",(e=>{o.forEach((t=>{!t.contains(e.target)&&t.classList.contains("active")&&t.classList.remove("active")})),hamburgerMenu.contains(e.target)||dropdownMenu.contains(e.target)||(dropdownMenu.style.display="none")})),o.forEach((e=>{e.addEventListener("paste",(function(e){e.preventDefault();var t="";e.clipboardData&&e.clipboardData.getData?t=e.clipboardData.getData("text/plain"):window.clipboardData&&window.clipboardData.getData&&(t=window.clipboardData.getData("Text")),document.execCommand("insertText",!1,t)}))}));let i=[];const a="temp-highlight",d=document.createElement("style");d.textContent=".temp-highlight { background-color: rgba(0, 0, 0, 0.1); }",document.head.appendChild(d);const r=rangy.createClassApplier(a,{normalize:!0}),l=(e,t)=>{if(document.querySelector(".color-popup"))return;const n=document.createElement("div");n.classList.add("color-popup"),n.style.top=`${e.pageY}px`,n.style.left=`${e.pageX}px`;const o=document.createElement("div");o.classList.add("color-input-wrapper"),n.appendChild(o);const a=document.createElement("input");a.type="color",a.classList.add("color-input"),o.appendChild(a),predefinedColors.forEach((e=>{const o=document.createElement("button");o.classList.add("color-option"),o.style.backgroundColor=e,o.addEventListener("click",(()=>s(e,t))),n.appendChild(o)}));const d=document.createElement("style");d.textContent="\n  .color-popup {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 5px; /* Add space between the color options */\n    padding: 5px;\n  }\n  .color-option {\n    width: 20px; /* Set the width of the color option circle */\n    height: 20px; /* Set the height of the color option circle */\n    border-radius: 50%; /* Make the color option a circle */\n    border: none; \n    cursor: pointer; /* Change the cursor to a pointer when hovering over the color option */\n    outline: none; /* Remove the default focus outline */\n    margin: 5px; /* Add space between the color options */\n  }\n  .color-option:hover {\n    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1); /* Add a subtle shadow when hovering over the color option */\n  }\n",document.head.appendChild(d);const r=document.createElement("button");r.classList.add("strikethrough-option"),r.addEventListener("click",(()=>g(i,t)));const l=document.createElement("i");l.classList.add("fas","fa-strikethrough","icon","line-color","fa-lg"),r.appendChild(l),n.appendChild(r);const p=document.createElement("style");p.textContent="\n  .strikethrough-option {\n    background: none;\n    border: none;\n    position: relative;\n    font-size: 12px;\n    padding: 0;\n    cursor: pointer;\n      display: flex;\n  align-items: center;\n  justify-content: center;\n  }\n  .icon {\n    width: 20px;\n    height: 20px;\n  }\n    .strikethrough-option:hover {\n    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1); /* Add a subtle shadow when hovering over the color option */\n  }\n",document.head.appendChild(p);const m=document.createElement("button");m.classList.add("collapse-option"),m.addEventListener("click",(()=>c()));const b=document.createElement("i");b.classList.add("fas","fa-ellipsis-h","icon","line-color","fa-lg"),m.appendChild(b);const h=document.createElement("style");h.textContent="\n  .collapse-option {\n    background: none;\n    border: none;\n    position: relative;\n    font-size: 12px;\n    padding: 0;\n    cursor: pointer;\n  }\n  .collapse-option:hover {\n    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);\n  }\n",document.head.appendChild(h),n.appendChild(m),document.body.appendChild(n),a.addEventListener("change",(()=>s(a.value,t)));const y=e=>{n.contains(e.target)||(u(),document.removeEventListener("mousedown",y))};setTimeout((()=>{document.addEventListener("mousedown",y)}),0)},s=(e,t)=>{const n=`color-highlight-${e.replace("#","").toLowerCase()}`,o=document.createElement("style");o.textContent=`\n    .${n} {\n      background-color: ${e};\n      border-radius: 3px;\n      padding: 1px 1px;\n    }\n  `,document.head.appendChild(o);const a=rangy.createClassApplier(n,{normalize:!0});i.forEach((e=>{r.undoToRange(e),a.toggleRange(e)})),updateSidebar(e,t),i=[],u()},c=()=>{const e="collapsed-content",t=rangy.createClassApplier(e,{normalize:!0}),n=rangy.createClassApplier("collapsible-content",{normalize:!0});i.forEach((o=>{r.undoToRange(o);const i=document.createElement("span");i.textContent="...",i.setAttribute("data-original-text",o.toString()),i.classList.add(e),i.style.cursor="pointer",i.addEventListener("click",(function(){t.undoToRange(o),n.undoToRange(o),o.deleteContents(),o.insertNode(document.createTextNode(i.getAttribute("data-original-text"))),i.remove()})),o.deleteContents(),o.insertNode(i)})),i=[],u()},u=()=>{document.querySelectorAll(".color-popup").forEach((e=>e.remove())),i.forEach((e=>{r.undoToRange(e)})),i=[]},p="strikethrough",m=document.createElement("style");m.textContent=".strikethrough { text-decoration: line-through; }",document.head.appendChild(m);rangy.createClassApplier(p,{normalize:!0});const g=(e,t)=>{const n=getUniqueRandomColor(t),o=`strikethrough-${n.replace("#","").toLowerCase()}`,i=document.createElement("style");i.textContent=`\n    .${o} {\n      color: lightgrey;\n      font-style: italic;\n      text-decoration: line-through ${n} solid;\n    }\n  `,document.head.appendChild(i);const a=rangy.createClassApplier(o,{normalize:!0});e.forEach((e=>{r.undoToRange(e),a.toggleRange(e)})),updateSidebar(n,t,!0),e=[],u()};function b(e,t){document.querySelector(e).addEventListener("click",(()=>{addHorizontalLine(t)}))}b("#tb2-plus-button","tb2-sidebar"),b("#tb3-plus-button-1","tb3-sidebar-1"),b("#tb3-plus-button-2","tb3-sidebar-2"),b("#tb4-plus-button-1","tb4-sidebar-1"),b("#tb4-plus-button-2","tb4-sidebar-2"),b("#tb4-plus-button-3","tb4-sidebar-3");[{inputId:"tb2-text-input",sidebarId:"tb2-sidebar",visualizationId:"tb2-visualization"},{inputId:"tb3-text-input-1",sidebarId:"tb3-sidebar-1",visualizationId:"tb3-visualization"},{inputId:"tb3-text-input-2",sidebarId:"tb3-sidebar-2",visualizationId:"tb3-visualization"},{inputId:"tb4-text-input-1",sidebarId:"tb4-sidebar-1",visualizationId:"tb4-visualization"},{inputId:"tb4-text-input-2",sidebarId:"tb4-sidebar-2",visualizationId:"tb4-visualization"},{inputId:"tb4-text-input-3",sidebarId:"tb4-sidebar-3",visualizationId:"tb4-visualization"}].forEach((({inputId:e,sidebarId:t,visualizationId:n})=>{!function(e,t,n){document.getElementById(e).addEventListener("input",(()=>handleTextInputChange(e,t,n)))}(e,t,n)}))}));const addHorizontalLine=e=>{const t=document.getElementById(e),n=document.createElement("div");n.classList.add("item-wrapper"),n.id=`item-${Date.now()}`;const o=document.createElement("div");o.classList.add("horizontal-line-container"),n.setAttribute("draggable","true"),n.setAttribute("data-type","horizontal-line"),n.addEventListener("dragstart",onDragStart),n.addEventListener("dragover",onDragOver),n.addEventListener("drop",onDrop);const i=document.createElement("hr");i.classList.add("horizontal-line");const a=document.createElement("button");a.textContent="X",a.classList.add("delete-button","horizontal-line-delete"),a.style.visibility="hidden",a.onclick=()=>n.remove(),n.addEventListener("mouseover",(()=>{a.style.visibility="visible"})),n.addEventListener("mouseout",(()=>{a.style.visibility="hidden"}));const d=document.createElement("input");d.type="text",d.placeholder="Text",d.classList.add("horizontal-line-text"),d.oninput=()=>updateInputSize(d),d.onfocus=()=>updateInputSize(d),updateInputSize(d);const r=document.createElement("div");r.style.position="relative",o.appendChild(i),r.appendChild(a),r.appendChild(o),r.appendChild(d),n.appendChild(r);t.querySelector(".item-container").appendChild(n),updatePlaceholderVisibility(e)},updateInputSize=e=>{const t=document.createElement("span");t.style.visibility="hidden",t.style.whiteSpace="pre",t.style.font=getComputedStyle(e).font,t.textContent=e.value||e.placeholder,document.body.appendChild(t),e.style.width=`${t.getBoundingClientRect().width+2}px`,document.body.removeChild(t)};function handleTextInputChange(e,t,n){document.getElementById(n).style.display="none";const o=document.getElementById(t),i=document.getElementById(e),a=i.querySelectorAll("span"),d=new Set;a.forEach((e=>{if(!e.classList.value.startsWith("color-highlight-")&&!e.classList.value.startsWith("strikethrough-")||e.textContent.trim()){const t=e.classList.value.split("-").pop();d.add(t)}else{const t=e.classList.value.split("-").pop(),n=o.querySelector(`.delete-button-${t}:not(.horizontal-line-delete)`);n&&n.click()}}));o.querySelectorAll(".delete-button:not(.horizontal-line-delete)").forEach((e=>{const t=e.classList.value.split("-").pop();d.has(t)||e.click()})),updatePlaceholderVisibility(t),"<br>"===i.innerHTML&&(i.innerHTML="")}function updateSidebar(e,t,n=!1){const o=document.createElement("div"),i=document.getElementById(t);o.classList.add("item-wrapper"),o.id=`item-${Date.now()}`;const a=`color-index-${e.replace("#","").toLowerCase()}`;if(!i.querySelector("#"+a)){const l=document.createElement("div");l.id=a,l.classList.add("color-index-container"),l.style.display="flex",l.style.alignItems="center";const s=document.createElement("span");s.style.backgroundColor=e,n?s.classList.add("strikethrough-color-index"):s.classList.add("color-box");const c=document.createElement("button");c.textContent="X",c.classList.add("delete-button",`delete-button-${e.replace("#","").toLowerCase()}`),c.style.visibility="hidden",c.onclick=()=>{const o=getParentId(t);if(deleteColor(e,o,n),n){const t=`strikethrough-${e.replace("#","").toLowerCase()}`;rangy.createClassApplier(t,{normalize:!0});removeStrikethroughStyle(t,o)}};const u=document.createElement("button");function d(){const e=document.createElement("div");e.classList.add("input-wrapper"),e.style.display="flex",e.style.alignItems="center";const t=document.createElement("button");t.textContent="x",t.classList.add("delete-input-button"),t.style.visibility="hidden",t.onclick=()=>{e.remove(),r()},e.onmouseover=()=>{p.children.length>1&&(t.style.visibility="visible")},e.onmouseout=()=>{t.style.visibility="hidden"};const n=function(e){const t=document.createElement("select");return t.classList.add("description-dropdown"),e.forEach((e=>{const n=document.createElement("option");n.value=e,n.text=e,t.add(n)})),t}(function(){let e=JSON.parse(localStorage.getItem("dropdownOptions"));return e||(e=["","Logical","Spatial","Material"],localStorage.setItem("dropdownOptions",JSON.stringify(e))),e}()),o=document.createElement("input");return o.type="text",o.placeholder="Add description",o.classList.add("color-description-input"),e.appendChild(t),e.appendChild(n),e.appendChild(o),e}function r(){const e=p.querySelectorAll(".color-description-input").length,t=p.querySelectorAll(".delete-input-button");e>1?t.forEach((e=>{e.style.visibility="visible"})):t.forEach((e=>{e.style.visibility="hidden"}))}u.textContent="+",u.classList.add("add-description-button"),u.classList.add("button-hidden-style"),u.style.visibility="hidden",u.addEventListener("click",(function(e){e.preventDefault();const t=d();p.appendChild(t)}));const p=document.createElement("div");p.classList.add("description-inputs-container"),p.style.display="flex",p.style.flexDirection="column",p.style.alignItems="flex-start";const m=d();p.appendChild(m),r(),o.setAttribute("draggable","true"),o.addEventListener("dragstart",onDragStart),o.addEventListener("dragover",onDragOver),o.addEventListener("drop",onDrop),l.appendChild(s),l.appendChild(c),l.appendChild(u),l.appendChild(p),o.appendChild(l);i.querySelector(".item-container").appendChild(o),o.addEventListener("mouseover",(function(){c.style.visibility="visible",u.style.visibility="visible";const e=p.querySelectorAll(".input-wrapper");e.length>1&&e.forEach((e=>{e.querySelector(".delete-input-button").style.visibility="visible"}))})),o.addEventListener("mouseout",(function(){c.style.visibility="hidden",u.style.visibility="hidden",p.querySelectorAll(".input-wrapper").forEach((e=>{e.querySelector(".delete-input-button").style.visibility="hidden"}))}))}updatePlaceholderVisibility(t)}function removeStrikethroughStyle(e,t){document.getElementById(t).querySelectorAll(`.${e}`).forEach((t=>{t.classList.remove(e)}))}let draggedElement=null;const onDragStart=e=>{e.dataTransfer.setData("text/plain",e.currentTarget.id),e.dataTransfer.effectAllowed="move"},onDragOver=e=>{e.preventDefault()},onDrop=e=>{e.preventDefault();const t=e.dataTransfer.getData("text/plain");draggedElement=document.getElementById(t);const n=e.target.closest(".item-wrapper");if(n&&sidebar.contains(n)&&draggedElement!==n){const t=n.getBoundingClientRect();e.clientY<t.top+t.height/2?n.parentElement.insertBefore(draggedElement,n):n.parentElement.insertBefore(draggedElement,n.nextSibling)}else!n&&sidebar.contains(e.target)&&e.target.appendChild(draggedElement)},deleteColor=(e,t,n=!1)=>{const o=document.getElementById(t),i=`${n?"strikethrough":"color-highlight"}-${e.replace("#","").toLowerCase()}`;let a=o.querySelectorAll("."+i);for(;a.length>0;){const e=a[0];e.parentNode.replaceChild(document.createTextNode(e.textContent),e),a=o.querySelectorAll("."+i)}const d=`color-index-${e.replace("#","").toLowerCase()}`,r=o.querySelector("#"+d);if(r){const e=r.closest(".item-wrapper");e?e.remove():r.remove()}const l=Array.from(o.getElementsByTagName("style")).find((e=>e.textContent.includes(`.${i}`)));l&&l.remove()};
