"""Reproducible media bundle, containing only explicitly public brand resources."""
import hashlib, json, pathlib, sys, zipfile
root=pathlib.Path(sys.argv[1]).resolve()
config=json.loads((root/'config/site.json').read_text())
dist=root/'dist'
entries={}
for folder,label in [('assets/brand','logos'),('assets/fonts','fonts')]:
    for p in sorted((root/folder).rglob('*')):
        if p.is_file() and not p.name.startswith('.'):
            entries[f'{label}/{p.relative_to(root/folder)}']=p.read_bytes()
entries['BOILERPLATE.txt']=(dist/'media-kit/boilerplate.txt').read_bytes()
entries['colours.json']=(json.dumps(config['colors'],indent=2)+'\n').encode()
entries['brand-tokens.css']=(dist/'assets/brand/theme.css').read_bytes()
guide=root/'media-kit/brand-guide.pdf'
if guide.exists(): entries['brand-guide.pdf']=guide.read_bytes()
entries['README.txt']=(f"{config['name']} - Media kit\nBy Curious Commons\n\n"
    "Logos: SVG masters and PNG exports; profile.png has a pure-white background.\n"
    "Use the supplied artwork unchanged, with clear space of half a capital letter.\n"
    "Fonts: bundled under their accompanying licences.\n"
    "The guide is for digital use; obtain a printer's colour proof for physical materials.\n"
    "No event dates, venues, speakers or partnerships are announced by this kit.\n"
    "Logo use does not imply permission to announce an affiliation or sponsorship.\n"
    "Contact: hello@curiouscommons.com\n"
    + ("Private preparation only. This initiative has not been published.\n" if not config['publish'] else '')).encode()
hashes={name:hashlib.sha256(data).hexdigest() for name,data in entries.items()}
entries['SHA256SUMS.json']=(json.dumps(hashes,indent=2,sort_keys=True)+'\n').encode()
out=dist/'downloads'/f"{config['slug']}-media-kit.zip"
out.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for name,data in sorted(entries.items()):
        info=zipfile.ZipInfo(f"{config['slug']}-media-kit/{name}",(2026,10,21,0,0,0))
        info.compress_type=zipfile.ZIP_DEFLATED; info.external_attr=0o644<<16
        z.writestr(info,data)
with zipfile.ZipFile(out) as z:
    assert z.testzip() is None
    for name,digest in hashes.items(): assert hashlib.sha256(z.read(f"{config['slug']}-media-kit/{name}")).hexdigest()==digest
(out.parent/(out.name+'.sha256')).write_text(hashlib.sha256(out.read_bytes()).hexdigest()+'  '+out.name+'\n')
print(f'Media bundle verified: {len(entries)} files')
