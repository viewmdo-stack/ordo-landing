import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove s3-sub paragraph exactly
html = re.sub(r'<p class="s3-sub">[\s\S]*?</p>', '', html)
print('s3-sub removed, new len:', len(html))

new_left = (
    '<!-- s3-left: image right 65%, text overlay bottom -->\n'
    '    <div style="width:100%; margin-bottom:40px; position:relative; overflow:visible;">\n'
    '      <p style="text-align:center; padding:0 24px 16px; margin:0; line-height:1.8; font-size:clamp(15px,4vw,18px); font-weight:bold;">\n'
    '        \uADF8 \uB0C4\uC0C8\uC5D0 \uB9C8\uC74C\uC774 \uBA3C\uC800 \uBA48\uCE67\uD558\uAE30 \uC804\uC5D0,<br>\uADF8\uC758 \uD558\uB8E8\uB97C \uBA3C\uC800 \uC0DD\uAC01\uD574 \uBCF4\uC138\uC694.\n'
    '      </p>\n'
    '      <div style="position:relative; width:65%; margin-left:auto; margin-right:0;">\n'
    '        <img src="images/s3-left.jpg" style="width:100%; display:block;">\n'
    '        <div style="position:absolute; bottom:0; left:-55%; right:0; padding:10px 12px 12px;">\n'
    '          <p style="margin:0; line-height:1.9;">\n'
    '            <span style="background:#1a3a6b; color:white; padding:3px 8px; display:inline; box-decoration-break:clone; -webkit-box-decoration-break:clone; font-weight:bold; font-size:clamp(13px,3.8vw,16px);">\uD799\uB4E0 \uB0B4\uC0C9 \uC5C6\uC774 \uACAC\uB514\uACE0, \uB538\uC744 \uC0BC\uCF1C\uB0B4\uACE0,</span><br>\n'
    '            <span style="background:#1a3a6b; color:white; padding:3px 8px; display:inline; box-decoration-break:clone; -webkit-box-decoration-break:clone; font-weight:bold; font-size:clamp(13px,3.8vw,16px);">\uC624\uB298\uB3C4 \uB204\uAD70\uAC00\uB97C \uC704\uD574</span><br>\n'
    '            <span style="background:#1a3a6b; color:white; padding:3px 8px; display:inline; box-decoration-break:clone; -webkit-box-decoration-break:clone; font-weight:bold; font-size:clamp(13px,3.8vw,16px);">\uC790\uC2E0\uC758 \uC790\uB9AC\uB97C \uC9C0\uCF1C\uB0C8\uC744 \uD558\uB8E8.</span>\n'
    '          </p>\n'
    '        </div>\n'
    '      </div>\n'
    '    </div>\n\n    '
)

new_right = (
    '<!-- s3-right: image left 65%, text overlay bottom -->\n'
    '    <div style="width:100%; margin-bottom:40px; position:relative; overflow:visible;">\n'
    '      <div style="position:relative; width:65%; margin-right:auto; margin-left:0;">\n'
    '        <img src="images/s3-right.jpg" style="width:100%; display:block;">\n'
    '        <div style="position:absolute; bottom:0; left:0; right:-55%; padding:10px 12px 12px;">\n'
    '          <p style="margin:0; line-height:1.9;">\n'
    '            <span style="background:#1a3a6b; color:white; padding:3px 8px; display:inline; box-decoration-break:clone; -webkit-box-decoration-break:clone; font-weight:bold; font-size:clamp(13px,3.8vw,16px);">\uCCB4\uCDE8\uB294 \uB2E8\uC21C\uD55C \uB0C4\uC0C8\uAC00 \uC544\uB2C8\uB77C,</span><br>\n'
    '            <span style="background:#1a3a6b; color:white; padding:3px 8px; display:inline; box-decoration-break:clone; -webkit-box-decoration-break:clone; font-weight:bold; font-size:clamp(13px,3.8vw,16px);">\uC5F4\uC815\uC801\uC778 \uD558\uB8E8\uAC00 \uD53C\uBD80 \uC704\uC5D0 \uB0A8\uAE34</span><br>\n'
    '            <span style="background:#1a3a6b; color:white; padding:3px 8px; display:inline; box-decoration-break:clone; -webkit-box-decoration-break:clone; font-weight:bold; font-size:clamp(13px,3.8vw,16px);">\uD754\uC801\uC77C \uC218 \uC788\uC2B5\uB2C8\uB2E4.</span>\n'
    '          </p>\n'
    '        </div>\n'
    '      </div>\n'
    '    </div>\n\n    '
)

m = re.search(r'<!-- s3-left.*?(?=<!-- s3-right)', html, re.DOTALL)
if m:
    html = html[:m.start()] + new_left + html[m.end():]
    print('s3-left replaced')
else:
    print('s3-left NOT found')

m2 = re.search(r'<!-- s3-right.*?(?=\s*</section>|\s*<!--(?!\s*s3-))', html, re.DOTALL)
if m2:
    html = html[:m2.start()] + new_right + html[m2.end():]
    print('s3-right replaced')
else:
    print('s3-right NOT found')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Done')
