var CTemplate = (function() {
    this.parseTemplate = function(tpl) {
        //  EVALS rausschneiden; Dient auch dazu das der Parser nicht anfängt im Scriptcode Expressions auszuwerten!
        var aEVALS=[];
        tpl = tpl.replace(/\{eval\}([\s\S]*?)\{\/eval\}/g,function(_,sEVAL){
            aEVALS.push(sEVAL);
            return "{eval}{/eval}";
        })
        //  Ausdrücke wie ${x} auswerten
        .replace(/\$\{([^\|^\}]+(\([^\)]+\))?)\s?\s?([^\}]*)?\}/ig, function(_, sCMD, sPRM, sEXT) {
            if(sEXT) {          //  Funktion bearbeiten:
                //  Pipes filtern und Funktionen basteln:
                sEXT.replace(/\|([^\|^\:]+):?((([^,^\|]),?)*)/g, function(_, sEXPR, sPARAMS) {
                    sCMD = '__M__("' + sEXPR + '", ' + sCMD + (sPARAMS?(','+sPARAMS.split(/[\,\:]/g).join(",")):'') + ')';
                })
            }
            return "</ESCAPE>'+(" + sCMD + ")+'<ESCAPE>";
        })
        //  Funktionen auswerten
        .replace(/\{(\/?\w+(\([^\)]+\))?)\s?\s?([^\}]*)?\}/ig, function(_, sCMD, sPRM, sEXT) {
            //  Kommandos auswerten:
            switch(sCMD) {
                case "var":
                    return "</ESCAPE>';var "+sEXT+"; __TMPL__+='<ESCAPE>";
                case "if":
                    return "</ESCAPE>';if("+sEXT+") {__TMPL__+='<ESCAPE>";
                case "elseif":
                    return "</ESCAPE>'}else if("+sEXT+") {__TMPL__+='<ESCAPE>";
                case "/if":
                    return "</ESCAPE>'}; __TMPL__+='<ESCAPE>";
                case "else":
                    return "</ESCAPE>'}else{__TMPL__+='<ESCAPE>";
                case "for":
                    return sEXT.replace(/(\w+)\sin\s(.*)/,function(_,sKEY,sOBJ) {
                        return "</ESCAPE>'; var __LIST__KEY__COUNT__=0;var __LIST__"+sKEY+"="+sOBJ+";if(typeof __LIST__"+sKEY+"=='object')for(var "+sKEY+"_index in __LIST__"+sKEY+"){__LIST__KEY__COUNT__++;var "+sKEY+"=__LIST__"+sKEY+"["+sKEY+"_index]; __TMPL__+='<ESCAPE>";
                    });
                case "/for":
                    return "</ESCAPE>'}; __TMPL__+='<ESCAPE>";
                case "forelse":
                    return "</ESCAPE>'}; if(!__LIST__KEY__COUNT__){__TMPL__+='<ESCAPE>";
                case "macro":
                    return "</ESCAPE>'; function "+sEXT+"{var __TMPL__=''; __TMPL__+='<ESCAPE>";
                case "/macro":
                    return "</ESCAPE>'; return __TMPL__}; __TMPL__+='<ESCAPE>";

                default:
                    return _;  //  Original zurückliefern falls kein echo
            }
        })
        //  EVALS wieder reinnehmen
        .replace(/\{eval\}\{\/eval\}/igm,function(_){
            return "</ESCAPE>';"+aEVALS.shift()+";\n __TMPL__+='<ESCAPE>";
        });

        //  Finale virtuelle Funktion basteln
        var sVirtualFunction = 'function __M__(f){try{var args=Array.prototype.slice.call(arguments).slice(1);return (typeof f == "function") ? f.apply(this,args) : __M__[f].apply(this,args);}catch(e){debug(f+"::"+e.message);return arguments[1];}}';
        sVirtualFunction+= '__M__.eat=function(){return "";};__M__.escape=function(s){return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");};__M__.capitalize=function(s){return String(s).toUpperCase();};__M__["default"]=function(s,d){return s!=null?s:d;};\n';
        sVirtualFunction+= "this.process=function(__CONTEXT__){if(__CONTEXT__._MODIFIERS!=null){for(var key in __CONTEXT__._MODIFIERS)__M__[key]=__CONTEXT__._MODIFIERS[key]};with(__CONTEXT__){\nvar __TMPL__='';__TMPL__+='<ESCAPE>"+tpl+"</ESCAPE>';\nreturn __TMPL__;}}";

        //  Strings escapen
        sVirtualFunction=sVirtualFunction.replace(/(\<ESCAPE\>)([\s\S]*?)(\<\/ESCAPE\>)/g,function(){return arguments[2].replace(/(['\\])/g,'\\$1').replace(/\r?\n/g,'\\n')});

        //  Als neue Instanz zurückliefern
        try {
            return new (Function(sVirtualFunction));
        } catch(e) {
            debug(e);debug(sVirtualFunction);
            return null;
        }
    }
    return this;
})();
