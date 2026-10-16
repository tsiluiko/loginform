var T={
uk:{n_about:"Про мене",n_skills:"Навички",n_code:"Приклади коду",n_edu:"Освіта",n_lang:"Мови",n_proj:"Проєкти",
name:"Олексій Цілуйко",role:"Студент",email:"Електронна пошта",phone:"Номер телефону",bd:"Дата народження",bdv:"26 березня 2008 року",addr:"Адреса",addrv:"Україна",
about:"Студент, який вивчає web-технології. Цікавлюся фронтенд-розробкою та створенням зручних інтерфейсів.",
college:"Коледж",collegeName:"Ваш коледж",courses:"Курси",coursesName:"Ваші курси",
l1:"Українська (рідна)",l2:"Англійська (A1)",p1:"Форма входу на HTML та CSS.",p2t:"Персональна сторінка",p2:"Ця сторінка-резюме.",view:"Переглянути"},
en:{n_about:"About me",n_skills:"Skills",n_code:"Code Examples",n_edu:"Education",n_lang:"Languages",n_proj:"Projects",
name:"Alex Tsiliuko",role:"Student",email:"Email",phone:"Phone number",bd:"Date of birth",bdv:"March 26, 2008",addr:"Address",addrv:"Ukraine",
about:"A student learning web technologies. I am interested in front-end development and building user-friendly interfaces.",
college:"College",collegeName:"Your college",courses:"Courses",coursesName:"Your courses",
l1:"Ukrainian (Native)",l2:"English (A1)",p1:"A login form built with HTML and CSS.",p2t:"Personal page",p2:"This CV page.",view:"View"}
};
function setLang(l){
  document.documentElement.lang=l;
  document.querySelectorAll("[data-i]").forEach(function(e){e.textContent=T[l][e.dataset.i]});
  document.getElementById("bUk").className="btn"+(l==="uk"?" on":"");
  document.getElementById("bEn").className="btn"+(l==="en"?" on":"");
}
document.getElementById("bUk").onclick=function(){setLang("uk")};
document.getElementById("bEn").onclick=function(){setLang("en")};
document.getElementById("bTh").onclick=function(){
  var r=document.documentElement,d=r.dataset.theme==="dark"||(!r.dataset.theme&&matchMedia("(prefers-color-scheme: dark)").matches);
  r.dataset.theme=d?"light":"dark";
};
setLang("uk");
