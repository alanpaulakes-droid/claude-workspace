s=open('test.html',encoding='utf-8').read(); i=s.rfind('})();')
open('testx.html','w',encoding='utf-8').write(s[:i]+'window.__X={GROUPS,PAGES,COURSES,C,SAB,IND,GLOS,GUIDE,GX,BG,vals,num,CAREAS,linTex,katexMotor,t8Applies,NUC,runTest3,T2,FORM,doExport,toModel};'+s[i:])
