import os
import bs4
import re

def scrape_ubc_calendar():
    # 1. Get the directory where the script is located
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 2. Find all files matching the UBC naming convention
    files_to_process = [
        f for f in os.listdir(current_dir) 
        if "UBC Academic Calendar" in f and (f.endswith(".htm") or f.endswith(".html"))
    ]

    if not files_to_process:
        print("No UBC Academic Calendar HTML files found in the folder.")
        return

    for file_name in files_to_process:
        print(f"\n{'='*80}")
        print(f"PROCESSING FILE: {file_name}")
        print(f"{'='*80}")
        
        file_path = os.path.join(current_dir, file_name)
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                soup = bs4.BeautifulSoup(file.read(), 'html.parser')

            # UBC courses are wrapped in <article class="node--type-course">
            courses = soup.find_all('article', class_='node--type-course')

            for course in courses:
                # Part A: Extract Code and Title from the <h3> tag
                h3 = course.find('h3')
                if not h3:
                    continue
                
                header_text = h3.get_text(separator=" ", strip=True)
                # Regex for Subject_V Code, Credits, and Title
                header_match = re.search(r'([A-Z]+_V\s\d+)\s\(\d+\)\s+(.*)', header_text)
                
                if header_match:
                    code = header_match.group(1)
                    title = header_match.group(2)
                else:
                    code = "Unknown"
                    title = header_text

                # Part B: Extract the Long Description
                # We look for all tags within the article, excluding the <h3> header
                content_div = course.find('div', class_='node__content')
                description = ""
                
                if content_div:
                    # Get all text from the content div, but remove the header text
                    # We often look for <p> tags that don't have special classes like "mt-0" (credits info)
                    all_paragraphs = content_div.find_all('p')
                    desc_parts = []
                    for p in all_paragraphs:
                        # Skip the "Credit/D/Fail grading" and credits notice
                        p_text = p.get_text(strip=True)
                        if "not eligible for Credit/D/Fail" in p_text or "(3)" in p_text:
                            continue
                        if p_text:
                            desc_parts.append(p_text)
                    
                    description = " ".join(desc_parts)

                # Final Print Output
                print(f"COURSE: {code} - {title}")
                print(f"DESCRIPTION: {description if description else 'No description found.'}")
                print("-" * 40)

        except Exception as e:
            print(f"Error processing {file_name}: {e}")

if __name__ == "__main__":
    scrape_ubc_calendar()