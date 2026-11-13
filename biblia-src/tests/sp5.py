import json, re, unicodedata, collections
from spellchecker import SpellChecker
sp=SpellChecker(language='es')
T=json.load(open('alltext.json'))
strip=lambda w:''.join(c for c in unicodedata.normalize('NFD',w) if unicodedata.category(c)!='Mn')
dic=set(sp.word_frequency.dictionary.keys())
byst=collections.defaultdict(set)
for w in dic: byst[strip(w)].add(w)
cnt=collections.Counter(); where={}
for pid,t in T.items():
    for w in re.findall(r"[A-Za-zÁÉÍÓÚÑÜáéíóúñü]+",t):
        if len(w)<3 or w.isupper() or (w[0].isupper() and w[1:].islower() and False): continue
        lw=w.lower()
        if lw in dic: continue
        cnt[lw]+=1; where.setdefault(lw,set()).add(pid)
# accent candidates
acc=[(w,c,sorted(byst[strip(w)])) for w,c in cnt.items() if strip(w) in byst and w not in byst[strip(w)]]
print('desconocidas',len(cnt))
print('ACENTO', len(acc))
for w,c,alts in sorted(acc,key=lambda x:-x[1]): print(w,c,alts[:3],sorted(where[w])[:3])
json.dump({w:[c,sorted(where[w])[:4]] for w,c in cnt.items()},open('unknown.json','w'))
