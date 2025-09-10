import type { Plugin } from 'vite'

export function createGoogleAnalyticsPlugin(env: IViteEnv): Plugin {
  return {
    name: 'vite-plugin-google-analytics',
    enforce: 'pre',

    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const GA_ID = env.gaId
        if (GA_ID) {
          const scriptTag = `
<script>
    const GA_ID = '${GA_ID}';
    if (GA_ID) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', GA_ID);
    }
</script>`
          html = html.replace(/<\/head>/, `${scriptTag}\n</head>`)
        }
        return html
      },
    },
  }
}
