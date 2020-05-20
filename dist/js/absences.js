
async function checkLogin(){localforage.getItem("logged_in").then(function(value){if(value!==true){window.location.replace("/index.html");}}).catch(function(err){console.log(err);});}
function setLoading(state){if(state){$("#loading-bar").removeClass("hidden");}else{$("#loading-bar").addClass("hidden");}}
async function loadAbsences(forceRefresh=false){setLoading(true);let promisesToRun=[localforage.getItem("username").then(function(value){username=value;}),localforage.getItem("password").then(function(value){password=value;}),localforage.getItem("absences").then(function(value){absences=value;})];await Promise.all(promisesToRun);if(absences==null||absences=={}||forceRefresh){try{let gsecInstance=new gsec();await gsecInstance.login(username,password);let date={};date.from=$("#datepicker-from").val().split(".");date.till=$("#datepicker-to").val().split(".");Object.keys(date).map((key)=>{date[key]=new Date(Date.parse(date[key].reverse().join("-")));});gsecInstance.fetchAbsences().then((fetchedAbsences)=>{fetchedAbsences.sort((a,b)=>{return new Date(b.date)-new Date(a.date);});var fromKey=fetchedAbsences.findIndex((procEl)=>{if(procEl.date.getTime()>=date.from.getTime()){return true;}});var tillKey=fetchedAbsences.findIndex((procEl)=>{if(procEl.date.getTime()>date.till.getTime()){return true;}});if(fromKey===0&&tillKey===-2){fetchedAbsences=[];}else{fetchedAbsences=fetchedAbsences.slice(fromKey,tillKey);}
absences=fetchedAbsences;localforage.setItem("absences",fetchedAbsences).then(()=>{displayData();setLoading(false);});setLoading(false);}).catch((err)=>{gsecErrorHandlerUI(err);setLoading(false);});}catch(err){gsecErrorHandlerUI(err);setLoading(false);}}else{displayData();setLoading(false);}}
function displayData(){absences.forEach(absence=>{let li=document.createElement("li");let dateStringValue=dateString.longFormatted(absence["date"]);let header=document.createElement("div");header.className="collapsible-header";header.innerText=dateStringValue;let body=document.createElement("div");body.className="collapsible-body";let body_table=document.createElement("table");body_table.className="highlight";let body_table_tbody=document.createElement("tbody");Object.keys(absence.subjects).forEach(lesson=>{let absenceLessonObject=absence["subjects"][lesson];let subjectRow=document.createElement("tr");let subjectLessonIcon=document.createElement("td");let subjectLessonText=document.createElement("td");subjectLessonText.innerText=`${S("lesson")} ${lesson}`;let subjectLessonIconInner=document.createElement("i");subjectLessonIconInner.className="material-icons";switch(absenceLessonObject["status"]){case 0:subjectLessonIconInner.innerText="schedule";break;case 1:subjectLessonIconInner.innerText="check_circle_outline";break;case 2:subjectLessonIconInner.innerText="error_outline";break;case 3:subjectLessonIconInner.innerText="not_interested";break;}
subjectLessonIcon.appendChild(subjectLessonIconInner);let subjectName=document.createElement("td");subjectName.innerText=`${S(gseAbsenceTypes[absenceLessonObject["status"]])} : ${absenceLessonObject["subject"]}`;subjectRow.appendChild(subjectLessonIcon);subjectRow.appendChild(subjectLessonText);subjectRow.appendChild(subjectName);body_table_tbody.appendChild(subjectRow);});body_table.appendChild(body_table_tbody);body.appendChild(body_table);li.appendChild(header);li.appendChild(body);$("#absences-col").append(li);});}
function clearAbsences(){const table=document.getElementById("absences-col");while(table.firstChild){table.removeChild(table.firstChild);}}
function refreshAbsences(){clearAbsences();loadAbsences(true);}
function setupPickers(){var dateObject=new Date();let elems=document.querySelectorAll('#datepicker-to');let options={autoClose:true,format:"dd.mm.yyyy",defaultDate:dateObject,setDefaultDate:true,firstDay:1,onSelect:refreshAbsences}
M.Datepicker.init(elems,options);dateObject.setDate(dateObject.getDate()-14);elems=document.querySelectorAll('#datepicker-from');options={autoClose:true,format:"dd.mm.yyyy",defaultDate:dateObject,setDefaultDate:true,firstDay:1,onSelect:refreshAbsences}
M.Datepicker.init(elems,options);}
document.addEventListener("DOMContentLoaded",()=>{checkLogin();loadAbsences(true);$("#refresh-icon").click(function(){refreshAbsences();});setupPickers();let collectionElem=document.querySelectorAll('.collapsible');M.Collapsible.init(collectionElem,{});const menus=document.querySelectorAll('.side-menu');M.Sidenav.init(menus,{edge:'right',draggable:true});});