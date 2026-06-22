import zipfile
import xml.etree.ElementTree as ET

def get_docx_text(path):
    try:
        document = zipfile.ZipFile(path)
        xml_content = document.read('word/document.xml')
        tree = ET.XML(xml_content)
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        paragraphs = []
        for paragraph in tree.findall('.//w:p', ns):
            texts = [node.text for node in paragraph.findall('.//w:t', ns) if node.text]
            if texts:
                paragraphs.append(''.join(texts))
        return '\n'.join(paragraphs)
    except Exception as e:
        return str(e)

files = ["Docs/DocumentoRequisitos.docx", "Docs/DRE-SalãodeBeleza 1.1.docx"]
for f in files:
    print(f"\n--- {f} ---")
    text = get_docx_text(f)
    lines = text.split('\n')
    for i, line in enumerate(lines):
        if any(w in line.lower() for w in ['relat', 'test', 'selenium', 'automat']):
            print(f"[{i}] {line}")
