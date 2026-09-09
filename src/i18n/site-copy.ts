export const supportedLocales = ['en', 'zh-CN'] as const;
export type SiteLocale = (typeof supportedLocales)[number];

export const defaultLocale: SiteLocale = 'en';
export const localeStorageKey = 'navfolio-locale';

export const siteCopy = {
  en: {
    description:
      'Yuxiang Ren’s personal website for software development, projects, and continuous learning.',
    pageTitle: 'Yuxiang Ren',
    pageDescription:
      'Computer Science student at EURECOM, interested in software engineering, distributed systems, deep learning, and full-stack development.',
    footerNote: 'Built with Astro and Navfolio.',
    nav: {
      '/': 'Home',
      '/blog': 'Blog',
      '/projects': 'Projects',
      '/about': 'About',
    },
    pages: {
      blog: {
        title: 'Blog',
        kicker: 'Writing archive',
        subtitle: 'Technology, projects, and ideas.',
        note: 'Articles and learning notes worth keeping for the long term.',
      },
      projects: {
        title: 'Projects',
        kicker: 'Work and practice',
        subtitle: 'Keep building. Keep documenting.',
        note: 'Personal projects, implementation notes, and related documentation.',
      },
      about: { title: 'About', description: 'About Yuxiang Ren and this personal website.' },
    },
    home: {
      quote: ['Learn in public,', 'build with care,', 'and keep ideas growing.'],
      intro: {
        title: 'I’m ',
        name: 'Yuxiang Ren',
        body: [
          'I am a Computer Science student at EURECOM.',
          'I am interested in software engineering, distributed systems, deep learning, and full-stack development.',
          'This site is where I document projects, technical writing, and what I learn along the way.',
        ],
      },
      navigation: [
        { title: 'Projects', subtitle: 'Things I build and how they work' },
        { title: 'Blog', subtitle: 'Technical notes and long-form thinking' },
        { title: 'About', subtitle: 'Background and ways to reach me' },
        { title: 'GitHub', subtitle: 'Code, experiments, and open source' },
      ],
      doing: [
        'Learning and practicing distributed systems',
        'Exploring software engineering methods',
        'Working on deep-learning projects',
        'Building full-stack development experience',
        'Maintaining personal open-source projects',
      ],
    },
  },
  'zh-CN': {
    description: 'Yuxiang Ren的个人网站，记录软件开发、项目实践与持续学习。',
    pageTitle: 'Yuxiang Ren',
    pageDescription: 'EURECOM学生，关注软件工程、分布式系统、深度学习与全栈开发。',
    footerNote: '基于 Astro 与 Navfolio 构建。',
    nav: {
      '/': '首页',
      '/blog': '文章',
      '/projects': '项目',
      '/about': '关于',
    },
    pages: {
      blog: {
        title: '文章',
        kicker: '写作归档',
        subtitle: '技术、项目与思考。',
        note: '这里收录值得长期保存的文章和学习记录。',
      },
      projects: {
        title: '项目',
        kicker: '作品与实践',
        subtitle: '持续构建，持续记录。',
        note: '这里展示个人项目、实现过程和相关文档。',
      },
      about: { title: '关于', description: '关于Yuxiang Ren与这个个人网站。' },
    },
    home: {
      quote: ['记录所学，', '展示所做，', '让想法持续生长。'],
      intro: {
        title: '你好，这里是 ',
        name: 'Yuxiang Ren',
        body: [
          '我是Yuxiang Ren，EURECOM 计算机科学 学生。',
          '关注软件工程、分布式系统、深度学习与全栈开发。',
          '这里用于整理项目、技术文章和持续学习的记录。',
        ],
      },
      navigation: [
        { title: '项目', subtitle: '作品、实践与实现记录' },
        { title: '文章', subtitle: '技术笔记与长期思考' },
        { title: '关于', subtitle: '个人介绍与联系方式' },
        { title: 'GitHub', subtitle: '代码、实验与开源项目' },
      ],
      doing: [
        '找寻自我',
        '四处转转',
        '学习与实践分布式系统, 开展深度学习实践',
        '积累全栈开发经验',
        '维护个人开源项目',
      ],
    },
  },
} as const;
