document.querySelectorAll('pre code:not(.hljs):not(.language-mermaid)').forEach(function(el){
    if(el.classList.contains('language-wat'))el.classList.replace('language-wat','language-scheme');
    hljs.highlightElement(el);
});
