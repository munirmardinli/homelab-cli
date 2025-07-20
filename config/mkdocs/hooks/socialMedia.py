from textwrap import dedent
import urllib.parse

x_intent = "https://x.com/munirmardinli"
fb_intent = "https://www.facebook.com/munirmardinli"

def on_page_markdown(markdown, **kwargs):
    page = kwargs['page']
    config = kwargs['config']
    if page.meta.get('template') != 'blog-post.html':
        return markdown
    
    page_url = config['site_url'] + page.url
    page_title = urllib.parse.quote(page.title + '\n')
    
    return markdown + dedent(f"""
    <div style="text-align: center; margin: 2rem 0; padding: 1rem; border-top: 1px solid #e0e0e0;">
        <h3 style="font-weight: bold; margin-bottom: 1rem;">Share on Social Media</h3>
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <a href="{x_intent}?text={page_title}" target="_blank" rel="noopener" 
               style="display: inline-flex; align-items: center; padding: 0.5rem 1rem; background: #000; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                <svg style="width: 16px; height: 16px; margin-right: 0.5rem;" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Share on X
            </a>
            <a href="{fb_intent}?text={page_url}" target="_blank" rel="noopener"
               style="display: inline-flex; align-items: center; padding: 0.5rem 1rem; background: #4267B2; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                <svg style="width: 16px; height: 16px; margin-right: 0.5rem;" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Share on Facebook
            </a>
        </div>
    </div>
    """)
