import dpn from './theme/dpn.json'
export default {
  base: '/',
  title: 'Dorpn Documentation',
  description: 'Official documentation for the Dorpn Programming Language.',
  themeConfig: {
    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'On this page' },  
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Variables', link: '/Variables' }
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/README' }
        ]
      },
      {
        text: 'Core Concepts',
        items: [
          { text: 'Syntax', link: '/Syntax'},
          { text: 'Examples', link: '/Examples'},
          { text: 'Variables', link: '/Variables' },
          { text: 'Types', link: '/Types' },
          { text: 'Operators', link: '/Operators' }, 
          { text: 'Control Flow', link: '/Control-flow'}, 
          { text: 'Functions', link: '/Functions'},
          { text: 'CLI Usage', link: '/CLI' },

        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Built-in Functions', link: '/Built-in-Functions' },
          { text: 'Built-in Methods', link: '/Built-in-Methods' },
          { text: 'Errors', link: '/Errors' }, 
          { text: 'FAQ', link: '/FAQ' }
          
        ]
      }, 
      { 
        text: 'Changelogs', 
        items: [
            { text :'Changelog 0.4.4', link: '/Changelog'}
        ]
      }
    ]
  },
  markdown: {
  languages: [dpn],
  lineNumbers: true,
  theme: { light: 'github-light', dark: 'one-dark-pro' }
 }, 
  vite: {
    server: {
      allowedHosts: ['.trycloudflare.com']
    }
  }
 }	
