import zipfile
import xml.etree.ElementTree as ET

with zipfile.ZipFile('dummy.docx') as z:
    rels_xml = z.read('word/_rels/document.xml.rels')
    doc_xml = z.read('word/document.xml')

root = ET.fromstring(doc_xml)
rels_root = ET.fromstring(rels_xml)

r_map = {}
for r in rels_root:
    r_map[r.attrib['Id']] = r.attrib.get('Target', '')

ns = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

all_elements = list(root.iter('{' + ns['w'] + '}p'))

for i, p in enumerate(all_elements):
    blips = p.findall('.//{' + ns['a'] + '}blip')
    if blips:
        for b in blips:
            rid = b.attrib.get('{' + ns['r'] + '}embed')
            target = r_map.get(rid, '')
            print(f"\n--- IMAGE {target} found at index {i} ---")
            # print surrounding paragraphs
            start = max(0, i - 3)
            end = min(len(all_elements), i + 4)
            for j in range(start, end):
                t = ''.join(all_elements[j].itertext()).strip()
                marker = ">>>" if j == i else "   "
                print(f"{marker} [{j}] {t}")
