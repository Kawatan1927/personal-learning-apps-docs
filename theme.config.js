export default {
  logo: <span>個人開発アプリケーションドキュメント集</span>,
  project: {
    link: 'https://github.com/Kawatan1927/personal-learning-apps-docs',
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – 個人開発アプリケーションドキュメント集',
    }
  },
  sidebar:{
    defaultMenuCollapseLevel: 1
  },
  feedback: {
    content: null
  },
  editLink: {
    text: null
  }
}
