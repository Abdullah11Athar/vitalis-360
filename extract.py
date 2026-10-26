import docx

def extract_text(file_path):
    try:
        doc = docx.Document(file_path)
        with open('extracted_docx.txt', 'w', encoding='utf-8') as f:
            for p in doc.paragraphs:
                f.write(p.text + '\n')
    except Exception as e:
        print(f"Error: {e}")

extract_text(r'C:\Users\FairCom\Downloads\VITALIS-360\Google project.docx')
