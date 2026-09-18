import docx

doc = docx.Document('dummy.docx')
with open('dummy_outline.txt', 'w', encoding='utf-8') as out:
    for i, p in enumerate(doc.paragraphs):
        text = p.text.strip()
        has_page_break = 'type="page"' in p._p.xml or 'lastRenderedPageBreak' in p._p.xml
        if text:
            r0 = p.runs[0] if p.runs else None
            sz = r0.font.size.pt if (r0 and r0.font and r0.font.size) else ''
            b = r0.font.bold if (r0 and r0.font) else ''
            f_name = r0.font.name if (r0 and r0.font) else ''
            pb = ' [PAGE]' if has_page_break else ''
            out.write(f'{i:3d}: ({f_name}, {sz}, b={b}, align={p.alignment}){pb} {text}\n')

print("Outline written to dummy_outline.txt")
